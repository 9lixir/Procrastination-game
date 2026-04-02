import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DinoGame from './games/DinoGame'
import FlappyGame from './games/FlappyGame'

function GameScreen() {
    const [timeElapsed, setTimeElapsed] = useState(0)
    const [distraction, setDistraction] = useState(null)
    const [distractionsClicked, setDistractionsClicked] = useState(0)
    const [loadingDistraction, setLoadingDistraction] = useState(false)
    const [memeRevealed, setMemeRevealed] = useState(false)
    const navigate = useNavigate()
    const [miniGame, setMiniGame] = useState(null) 

    const player = JSON.parse(sessionStorage.getItem('player'))

    // Timer - runs every second
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeElapsed(prev => prev + 1)
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    // Fetch a distraction every 15 seconds
    useEffect(() => {
        const distractionInterval = setInterval(() => {
            fetchDistraction()
        }, 15000)
        return () => clearInterval(distractionInterval)
    }, [])

    const fetchDistraction = async () => {
        setMemeRevealed(false)
        setMiniGame(null)
        setLoadingDistraction(true)
        try {
            const res = await fetch('http://127.0.0.1:8000/api/distraction/')
            const data = await res.json()
            if (data.type == 'minigame'){
                setMiniGame(Math.random()>0.5?'dino':'flappy')
            }
            setDistraction(data)
        } catch (err) {
            console.error('Distraction fetch failed', err)
        } finally {
            setLoadingDistraction(false)
        }
    }

    const handleDistractionClick = () => {
        setDistractionsClicked(prev => prev + 1)
        setDistraction(null)
        setMiniGame(null)
    }

    const endSession = async (gaveUp) => {
        try {
            await fetch('http://127.0.0.1:8000/api/session/save/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    player: player.id,
                    time_survived: timeElapsed,
                    distractions_clicked: distractionsClicked,
                    gave_up: gaveUp
                })
            })
            sessionStorage.setItem('result', JSON.stringify({
                timeElapsed,
                distractionsClicked,
                gaveUp
            }))
            navigate('/result')
        } catch (err) {
            console.error('Failed to save session', err)
        }
    }

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0')
        const s = (seconds % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <p style={styles.playerName}>📖 {player?.name} is "studying"</p>
                <p style={styles.timer}>{formatTime(timeElapsed)}</p>
            </div>

            {/* Fake study area */}
            <div style={styles.studyArea}>
                <p style={styles.studyText}>
                    Chapter 1: Introduction to Studying...
                </p>
                <p style={styles.studyText2}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Just kidding, you're not reading this.
                </p>
            </div>

            {/* Distraction Popup */}
            {distraction && (
                <div style={styles.popup}>
                    {distraction.type === 'meme' && (
                        <>
                            <p style={styles.popupTitle}>🖼️ {distraction.title}</p>
                            <div style={styles.memeContainer}>
                                <img
                                    src={distraction.content}
                                    alt="meme"
                                    style={{
                                        ...styles.memeImg,
                                        filter: memeRevealed ? 'none' : 'blur(8px)',
                                        transform: memeRevealed ? 'none' : 'scale(1.1)',
                                    }}
                                />
                                {!memeRevealed && (
                                    <div style={styles.memeBlur}>
                                        <p style={styles.memeTeaser}>👀 something funny is happening here...</p>
                                        <button
                                            style={styles.revealBtn}
                                            onClick={() => {
                                                setMemeRevealed(true)
                                                setDistractionsClicked(prev => prev + 1)
                                            }}
                                        >
                                            see the full meme  (+1 distraction)
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    {distraction.type === 'minigame' && (
                        <>
                            <p style={styles.popupTitle}>🎮 a game appeared mid-study!</p>
                            {miniGame === 'dino' && (
                                <DinoGame onClose={handleDistractionClick} />
                            )}
                            {miniGame === 'flappy' && (
                                <FlappyGame onClose={handleDistractionClick} />
                            )}
                        </>
                    )}
                    <p style={styles.roast}>{distraction.roast_message}</p>
                    <button style={styles.dismissBtn} onClick={handleDistractionClick}>
                        okay fine 😔
                    </button>
                </div>
            )}

            {/* Buttons */}
            <div style={styles.btnRow}>
                <button
                    style={styles.distractionBtn}
                    onClick={fetchDistraction}
                    disabled={loadingDistraction}
                >
                    {loadingDistraction ? 'loading...' : '🎲 Distract me'}
                </button>
                <button
                    style={styles.giveUpBtn}
                    onClick={() => endSession(true)}
                >
                    🏳️ I give up
                </button>
                <button
                    style={styles.doneBtn}
                    onClick={() => endSession(false)}
                >
                    ✅ I studied (liar)
                </button>
            </div>
        </div>
    )
}

const styles = {
    container: {
        minHeight: '100vh',
        padding: '30px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        position: 'relative',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '700px',
        alignItems: 'center',
    },
    playerName: { fontSize: '1.1rem', color: '#888' },
    timer: { fontSize: '2rem', fontWeight: 'bold', color: '#6c63ff' },
    studyArea: {
        background: '#1a1a1a',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '700px',
        width: '100%',
    },
    studyText: { fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '16px' },
    studyText2: { fontSize: '1rem', color: '#555', lineHeight: '1.8' },
    popup: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#1a1a1a',
        border: '2px solid #6c63ff',
        borderRadius: '16px',
        padding: '30px',
        maxWidth: '420px',
        maxHeight: '90vh',
        overflow: 'auto',
        width: '90%',
        textAlign: 'center',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    popupTitle: { fontSize: '1.2rem', fontWeight: 'bold' },
    memeContainer: {
        position: 'relative',
        width: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
    },
    memeImg: {
        width: '100%',
        borderRadius: '8px',
        maxHeight: '300px',
        objectFit: 'cover',
        transition: 'filter 0.3s ease, transform 0.3s ease',
    },
    memeBlur: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(transparent, rgba(0,0,0,0.95))',
        padding: '40px 20px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
    },
    memeTeaser: {
        fontSize: '0.95rem',
        color: '#ccc',
    },
    revealBtn: {
        padding: '8px 18px',
        background: '#ff4444',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    roast: { color: '#888', fontSize: '0.9rem', fontStyle: 'italic' },
    dismissBtn: {
        padding: '10px 20px',
        background: '#6c63ff',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    btnRow: {
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 'auto',
    },
    distractionBtn: {
        padding: '12px 24px',
        background: '#333',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    giveUpBtn: {
        padding: '12px 24px',
        background: '#ff4444',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    doneBtn: {
        padding: '12px 24px',
        background: '#44bb44',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
    },
}

export default GameScreen