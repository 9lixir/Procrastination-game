import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Leaderboard() {
    const[memeRevealed, setMemeRevealed] =useState(False) 
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const fetchLeaderboard = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/leaderboard/')
            const data = await res.json()
            setSessions(data)
        } catch (err) {
            setError('Failed to load leaderboard. Even the survivors are gone.')
        } finally {
            setLoading(false)
        }
        }

        fetchLeaderboard()
    }, []) // runs once on mount

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0')
        const s = (seconds % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    const getMedal = (index) => {
        if (index === 0) return '🥇'
        if (index === 1) return '🥈'
        if (index === 2) return '🥉'
        return `#${index + 1}`
    }

    if (loading) return (
        <div style={styles.center}>
        <p>Loading survivors...</p>
        </div>
    )

    if (error) return (
        <div style={styles.center}>
        <p style={{color: '#ff6b6b'}}>{error}</p>
        </div>
    )

    return (
        <div style={styles.container}>
        <h1 style={styles.title}>🏆 Hall of Survivors</h1>
        <p style={styles.subtitle}>People who almost studied</p>

        {sessions.length === 0 ? (
            <p style={{color: '#888'}}>No survivors yet. Be the first.</p>
        ) : (
            <div style={styles.list}>
            {sessions.map((session, index) => (
                <div key={session.id} style={styles.row}>
                <span style={styles.medal}>{getMedal(index)}</span>
                <span style={styles.name}>{session.player_name}</span>
                <span style={styles.time}>{formatTime(session.time_survived)}</span>
                <span style={styles.tag}>
                    {session.gave_up ? '🏳️ gave up' : '✅ finished'}
                </span>
                </div>
            ))}
            </div>
        )}

        <button style={styles.btn} onClick={() => navigate('/')}>
            Go back.
        </button>
        </div>
    )
    }

const styles = {
container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    gap: '20px',
},
center: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
},
title: { fontSize: '2.5rem', fontWeight: 'bold' },
subtitle: { color: '#888', fontSize: '1rem' },
list: {
    width: '100%',
    maxWidth: '600px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
},
row: {
    background: '#1a1a1a',
    borderRadius: '10px',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
},
medal: { fontSize: '1.3rem', minWidth: '40px' },
name: { flex: 1, fontWeight: 'bold', fontSize: '1.1rem' },
time: { color: '#6c63ff', fontWeight: 'bold', fontSize: '1.1rem' },
tag: { color: '#888', fontSize: '0.85rem' },
btn: {
    padding: '12px 28px',
    background: '#6c63ff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '10px',
}
}

export default Leaderboard