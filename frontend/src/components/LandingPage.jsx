import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleStart = async () => {
        if (!name.trim()) {
        setError('Enter your name first. We need someone to blame.')
        return
        }

        setLoading(true)
        try {
        const response = await fetch('http://127.0.0.1:8000/api/player/create/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        })
        const player = await response.json()
        
        // save player to sessionStorage so other components can use it
        sessionStorage.setItem('player', JSON.stringify(player))
        navigate('/game')
        } catch (err) {
        setError('Something went wrong. Even the server gave up.')
        } finally {
        setLoading(false)
        }
    }

    return (
        <div style={styles.container}>
        <h1 style={styles.title}> Study Simulator</h1>
        <p style={styles.subtitle}>A totally legitimate study tool.</p>
        <p style={styles.subtitle}>No distractions. Promise.</p>

        <input
            style={styles.input}
            type="text"
            placeholder="Enter your name."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button
            style={styles.button}
            onClick={handleStart}
            disabled={loading}
        >
            {loading ? 'Preparing...' : 'Start Studying'}
        </button>

        <button
            style={{...styles.button, background: '#333', marginTop: '10px'}}
            onClick={() => navigate('/leaderboard')}
        >
            🏆 Hall of Survivors
        </button>
        </div>
    )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '16px',
    padding: '20px',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#888',
  },
  input: {
    padding: '14px 20px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '2px solid #333',
    background: '#1a1a1a',
    color: '#fff',
    width: '100%',
    maxWidth: '400px',
    marginTop: '10px',
  },
  button: {
    padding: '14px 32px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: 'none',
    background: '#6c63ff',
    color: '#fff',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '400px',
  },
  error: {
    color: '#ff6b6b',
    fontSize: '0.9rem',
  }
}

export default LandingPage