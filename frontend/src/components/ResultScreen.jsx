import { useNavigate } from 'react-router-dom'

function ResultScreen() {
    const navigate = useNavigate()
    const player = JSON.parse(sessionStorage.getItem('player'))
    const result = JSON.parse(sessionStorage.getItem('result'))

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0')
        const s = (seconds % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    const getRoast = () => {
        if (result.gaveUp && result.timeElapsed < 30) return "You lasted less than 30 seconds. Legendary."
        if (result.gaveUp && result.timeElapsed < 120) return "Under 2 minutes. Your future is in safe hands."
        if (result.gaveUp) return "You gave up. But at least you're honest."
        if (result.distractionsClicked > 5) return "You clicked every distraction and still said you studied. Respect."
        if (result.timeElapsed > 300) return "5 minutes?! You might actually pass."
        return "You didn't study. But you survived. That's something."
    }

    return (
        <div style={styles.container}>
        <h1 style={styles.emoji}>💀</h1>
        <h2 style={styles.title}>Session Over</h2>
        <p style={styles.roast}>{getRoast()}</p>

        <div style={styles.statsBox}>
            <div style={styles.stat}>
            <span style={styles.statLabel}>Time Survived</span>
            <span style={styles.statValue}>{formatTime(result.timeElapsed)}</span>
            </div>
            <div style={styles.stat}>
            <span style={styles.statLabel}>Distractions Clicked</span>
            <span style={styles.statValue}>{result.distractionsClicked}</span>
            </div>
            <div style={styles.stat}>
            <span style={styles.statLabel}>Cause of Death</span>
            <span style={styles.statValue}>{result.gaveUp ? 'Gave up 🏳️' : 'Finished (sure) ✅'}</span>
            </div>
        </div>

        <div style={styles.btnRow}>
            <button style={styles.btn} onClick={() => navigate('/')}>
            Try Again (you won't)
            </button>
            <button style={{...styles.btn, background: '#333'}} onClick={() => navigate('/leaderboard')}>
            🏆 Hall of Survivors
            </button>
        </div>
        </div>
    )
    }

    const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        padding: '30px 20px',
    },
    emoji: { fontSize: '4rem' },
    title: { fontSize: '2.5rem', fontWeight: 'bold' },
    roast: {
        fontSize: '1.2rem',
        color: '#888',
        fontStyle: 'italic',
        textAlign: 'center',
        maxWidth: '500px',
    },
    statsBox: {
        background: '#1a1a1a',
        borderRadius: '12px',
        padding: '24px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        maxWidth: '400px',
    },
    stat: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statLabel: { color: '#888', fontSize: '0.95rem' },
    statValue: { fontWeight: 'bold', fontSize: '1.1rem' },
    btnRow: {
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    btn: {
        padding: '12px 24px',
        background: '#6c63ff',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
    }
}

export default ResultScreen