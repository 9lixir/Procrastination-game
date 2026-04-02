import { useEffect, useRef, useState } from 'react'

function DinoGame({ onClose }) {
    const canvasRef = useRef(null)
    const gameRef = useRef({
        dino: { y: 0, vy: 0, jumping: false },
        obstacles: [],
        score: 0,
        speed: 4,
        gameOver: false,
        animFrame: null,
        tickCount: 0,
    })
    const [score, setScore] = useState(0)
    const [dead, setDead] = useState(false)

    const GROUND = 120
    const DINO_X = 50
    const DINO_W = 30
    const DINO_H = 40
    const OBS_W = 20

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const g = gameRef.current
        g.dino.y = GROUND

        const jump = () => {
            if (!g.dino.jumping && !g.gameOver) {
                g.dino.vy = -12
                g.dino.jumping = true
            }
        }

        const handleKey = (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault()
                jump()
            }
        }
        const handleClick = () => jump()

        window.addEventListener('keydown', handleKey)
        canvas.addEventListener('click', handleClick)

        const loop = () => {
            if (g.gameOver) return

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // ground
            ctx.fillStyle = '#333'
            ctx.fillRect(0, canvas.height - 30, canvas.width, 2)

            // dino
            g.dino.vy += 0.7
            g.dino.y += g.dino.vy
            if (g.dino.y >= GROUND) {
                g.dino.y = GROUND
                g.dino.vy = 0
                g.dino.jumping = false
            }

            ctx.fillStyle = '#6c63ff'
            ctx.fillRect(DINO_X, canvas.height - 30 - g.dino.y - DINO_H, DINO_W, DINO_H)

            // eyes
            ctx.fillStyle = '#fff'
            ctx.fillRect(DINO_X + 18, canvas.height - 30 - g.dino.y - DINO_H + 8, 6, 6)
            ctx.fillStyle = '#000'
            ctx.fillRect(DINO_X + 20, canvas.height - 30 - g.dino.y - DINO_H + 10, 3, 3)

            // obstacles
            g.tickCount++
            if (g.tickCount > Math.max(60 - g.score / 5, 30)) {
                const h = 20 + Math.random() * 30
                g.obstacles.push({ x: canvas.width, h })
                g.tickCount = 0
            }

            g.obstacles.forEach(obs => {
                obs.x -= g.speed
                ctx.fillStyle = '#ff4444'
                ctx.fillRect(obs.x, canvas.height - 30 - obs.h, OBS_W, obs.h)
            })

            g.obstacles = g.obstacles.filter(obs => obs.x > -OBS_W)

            // collision
            const dinoTop = canvas.height - 30 - g.dino.y - DINO_H
            const dinoBottom = canvas.height - 30 - g.dino.y
            g.obstacles.forEach(obs => {
                const obsLeft = obs.x
                const obsRight = obs.x + OBS_W
                const obsTop = canvas.height - 30 - obs.h
                if (
                    DINO_X + DINO_W > obsLeft + 4 &&
                    DINO_X < obsRight - 4 &&
                    dinoBottom > obsTop + 4 &&
                    dinoTop < canvas.height - 30
                ) {
                    g.gameOver = true
                    setDead(true)
                    setScore(Math.floor(g.score))
                    return
                }
            })

            // score
            g.score += 0.1
            g.speed = 4 + g.score / 50
            setScore(Math.floor(g.score))

            ctx.fillStyle = '#888'
            ctx.font = '14px monospace'
            ctx.fillText(`score: ${Math.floor(g.score)}`, canvas.width - 90, 20)

            g.animFrame = requestAnimationFrame(loop)
        }

        g.animFrame = requestAnimationFrame(loop)

        return () => {
            cancelAnimationFrame(g.animFrame)
            window.removeEventListener('keydown', handleKey)
            canvas.removeEventListener('click', handleClick)
        }
    }, [])

    const restart = () => {
        const g = gameRef.current
        g.dino = { y: 0, vy: 0, jumping: false }
        g.obstacles = []
        g.score = 0
        g.speed = 4
        g.gameOver = false
        g.tickCount = 0
        setDead(false)
        setScore(0)

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        const jump = () => {
            if (!g.dino.jumping && !g.gameOver) {
                g.dino.vy = -12
                g.dino.jumping = true
            }
        }

        const loop = () => {
            if (g.gameOver) return
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = '#333'
            ctx.fillRect(0, canvas.height - 30, canvas.width, 2)
            g.dino.vy += 0.7
            g.dino.y += g.dino.vy
            if (g.dino.y >= GROUND) {
                g.dino.y = GROUND
                g.dino.vy = 0
                g.dino.jumping = false
            }
            ctx.fillStyle = '#6c63ff'
            ctx.fillRect(DINO_X, canvas.height - 30 - g.dino.y - DINO_H, DINO_W, DINO_H)
            ctx.fillStyle = '#fff'
            ctx.fillRect(DINO_X + 18, canvas.height - 30 - g.dino.y - DINO_H + 8, 6, 6)
            ctx.fillStyle = '#000'
            ctx.fillRect(DINO_X + 20, canvas.height - 30 - g.dino.y - DINO_H + 10, 3, 3)
            g.tickCount++
            if (g.tickCount > Math.max(60 - g.score / 5, 30)) {
                const h = 20 + Math.random() * 30
                g.obstacles.push({ x: canvas.width, h })
                g.tickCount = 0
            }
            g.obstacles.forEach(obs => {
                obs.x -= g.speed
                ctx.fillStyle = '#ff4444'
                ctx.fillRect(obs.x, canvas.height - 30 - obs.h, OBS_W, obs.h)
            })
            g.obstacles = g.obstacles.filter(obs => obs.x > -OBS_W)
            const dinoTop = canvas.height - 30 - g.dino.y - DINO_H
            const dinoBottom = canvas.height - 30 - g.dino.y
            g.obstacles.forEach(obs => {
                if (
                    DINO_X + DINO_W > obs.x + 4 &&
                    DINO_X < obs.x + OBS_W - 4 &&
                    dinoBottom > canvas.height - 30 - obs.h + 4 &&
                    dinoTop < canvas.height - 30
                ) {
                    g.gameOver = true
                    setDead(true)
                    setScore(Math.floor(g.score))
                    return
                }
            })
            g.score += 0.1
            g.speed = 4 + g.score / 50
            setScore(Math.floor(g.score))
            ctx.fillStyle = '#888'
            ctx.font = '14px monospace'
            ctx.fillText(`score: ${Math.floor(g.score)}`, canvas.width - 90, 20)
            g.animFrame = requestAnimationFrame(loop)
        }

        g.animFrame = requestAnimationFrame(loop)
    }

    return (
        <div style={styles.wrapper}>
            <p style={styles.title}>🦖 Don't hit the red things</p>
            <p style={styles.hint}>Space / Arrow Up / Click to jump</p>
            <canvas
                ref={canvasRef}
                width={360}
                height={180}
                style={styles.canvas}
            />
            {dead && (
                <div style={styles.deadOverlay}>
                    <p style={styles.deadText}>💀 Score: {score}</p>
                    <p style={styles.deadSub}>you were supposed to be studying</p>
                    <div style={styles.btnRow}>
                        <button style={styles.retryBtn} onClick={restart}>retry 🔄</button>
                        <button style={styles.closeBtn} onClick={onClose}>close 😔</button>
                    </div>
                </div>
            )}
        </div>
    )
}

const styles = {
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        position: 'relative',
    },
    title: { fontWeight: 'bold', fontSize: '1rem' },
    hint: { color: '#888', fontSize: '0.8rem' },
    canvas: {
        borderRadius: '8px',
        background: '#111',
        cursor: 'pointer',
    },
    deadOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.85)',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    },
    deadText: { fontSize: '1.3rem', fontWeight: 'bold' },
    deadSub: { color: '#888', fontSize: '0.85rem' },
    btnRow: { display: 'flex', gap: '10px', marginTop: '8px' },
    retryBtn: {
        padding: '8px 16px',
        background: '#6c63ff',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    },
    closeBtn: {
        padding: '8px 16px',
        background: '#333',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    },
}

export default DinoGame 