import { useEffect, useRef, useState } from 'react'

function FlappyGame({ onClose }) {
    const canvasRef = useRef(null)
    const gameRef = useRef({
        bird: { y: 80, vy: 0 },
        pipes: [],
        score: 0,
        gameOver: false,
        started: false,
        animFrame: null,
        tickCount: 0,
    })
    const [score, setScore] = useState(0)
    const [dead, setDead] = useState(false)
    const [started, setStarted] = useState(false)

    const W = 360
    const H = 180
    const BIRD_X = 60
    const BIRD_R = 12
    const PIPE_W = 28
    const GAP = 55
    const GRAVITY = 0.5
    const FLAP = -7
    const PIPE_SPEED = 3

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const g = gameRef.current

        const flap = () => {
            if (g.gameOver) return
            if (!g.started) {
                g.started = true
                setStarted(true)
            }
            g.bird.vy = FLAP
        }

        const handleKey = (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault()
                flap()
            }
        }
        const handleClick = () => flap()

        window.addEventListener('keydown', handleKey)
        canvas.addEventListener('click', handleClick)

        const loop = () => {
            if (g.gameOver) return
            ctx.clearRect(0, 0, W, H)

            // background
            ctx.fillStyle = '#111'
            ctx.fillRect(0, 0, W, H)

            // ground
            ctx.fillStyle = '#333'
            ctx.fillRect(0, H - 20, W, 20)

            if (g.started) {
                // gravity
                g.bird.vy += GRAVITY
                g.bird.y += g.bird.vy

                // spawn pipes
                g.tickCount++
                if (g.tickCount > 90) {
                    const topH = 20 + Math.random() * (H - GAP - 50)
                    g.pipes.push({ x: W, topH, scored: false })
                    g.tickCount = 0
                }

                // move pipes
                g.pipes.forEach(p => { p.x -= PIPE_SPEED })
                g.pipes = g.pipes.filter(p => p.x > -PIPE_W)

                // score
                g.pipes.forEach(p => {
                    if (!p.scored && p.x + PIPE_W < BIRD_X) {
                        p.scored = true
                        g.score++
                        setScore(g.score)
                    }
                })

                // collision with ground/ceiling
                if (g.bird.y + BIRD_R > H - 20 || g.bird.y - BIRD_R < 0) {
                    g.gameOver = true
                    setDead(true)
                    return
                }

                // collision with pipes
                g.pipes.forEach(p => {
                    const inXRange = BIRD_X + BIRD_R > p.x + 4 && BIRD_X - BIRD_R < p.x + PIPE_W - 4
                    const inTopPipe = g.bird.y - BIRD_R < p.topH
                    const inBottomPipe = g.bird.y + BIRD_R > p.topH + GAP
                    if (inXRange && (inTopPipe || inBottomPipe)) {
                        g.gameOver = true
                        setDead(true)
                        return
                    }
                })
            }

            // draw pipes
            g.pipes.forEach(p => {
                ctx.fillStyle = '#44bb44'
                ctx.fillRect(p.x, 0, PIPE_W, p.topH)
                ctx.fillRect(p.x, p.topH + GAP, PIPE_W, H - p.topH - GAP - 20)
                // pipe caps
                ctx.fillRect(p.x - 3, p.topH - 10, PIPE_W + 6, 10)
                ctx.fillRect(p.x - 3, p.topH + GAP, PIPE_W + 6, 10)
            })

            // draw bird
            ctx.beginPath()
            ctx.arc(BIRD_X, g.bird.y, BIRD_R, 0, Math.PI * 2)
            ctx.fillStyle = '#FFD700'
            ctx.fill()
            // eye
            ctx.beginPath()
            ctx.arc(BIRD_X + 5, g.bird.y - 3, 3, 0, Math.PI * 2)
            ctx.fillStyle = '#000'
            ctx.fill()
            // beak
            ctx.beginPath()
            ctx.moveTo(BIRD_X + BIRD_R, g.bird.y)
            ctx.lineTo(BIRD_X + BIRD_R + 8, g.bird.y + 3)
            ctx.lineTo(BIRD_X + BIRD_R, g.bird.y + 6)
            ctx.fillStyle = '#FF8C00'
            ctx.fill()

            // score
            ctx.fillStyle = '#fff'
            ctx.font = 'bold 16px monospace'
            ctx.fillText(g.score, W / 2, 25)

            if (!g.started) {
                ctx.fillStyle = 'rgba(0,0,0,0.5)'
                ctx.fillRect(0, 0, W, H)
                ctx.fillStyle = '#fff'
                ctx.font = '14px monospace'
                ctx.textAlign = 'center'
                ctx.fillText('click or press space to start', W / 2, H / 2)
                ctx.textAlign = 'left'
            }

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
        g.bird = { y: 80, vy: 0 }
        g.pipes = []
        g.score = 0
        g.gameOver = false
        g.started = false
        g.tickCount = 0
        setDead(false)
        setScore(0)
        setStarted(false)

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        const flap = () => {
            if (g.gameOver) return
            if (!g.started) { g.started = true; setStarted(true) }
            g.bird.vy = FLAP
        }

        canvas.onclick = () => flap()

        const loop = () => {
            if (g.gameOver) return
            ctx.clearRect(0, 0, W, H)
            ctx.fillStyle = '#111'
            ctx.fillRect(0, 0, W, H)
            ctx.fillStyle = '#333'
            ctx.fillRect(0, H - 20, W, 20)

            if (g.started) {
                g.bird.vy += GRAVITY
                g.bird.y += g.bird.vy
                g.tickCount++
                if (g.tickCount > 90) {
                    const topH = 20 + Math.random() * (H - GAP - 50)
                    g.pipes.push({ x: W, topH, scored: false })
                    g.tickCount = 0
                }
                g.pipes.forEach(p => { p.x -= PIPE_SPEED })
                g.pipes = g.pipes.filter(p => p.x > -PIPE_W)
                g.pipes.forEach(p => {
                    if (!p.scored && p.x + PIPE_W < BIRD_X) { p.scored = true; g.score++; setScore(g.score) }
                })
                if (g.bird.y + BIRD_R > H - 20 || g.bird.y - BIRD_R < 0) { g.gameOver = true; setDead(true); return }
                g.pipes.forEach(p => {
                    const inX = BIRD_X + BIRD_R > p.x + 4 && BIRD_X - BIRD_R < p.x + PIPE_W - 4
                    if (inX && (g.bird.y - BIRD_R < p.topH || g.bird.y + BIRD_R > p.topH + GAP)) {
                        g.gameOver = true; setDead(true); return
                    }
                })
            }

            g.pipes.forEach(p => {
                ctx.fillStyle = '#44bb44'
                ctx.fillRect(p.x, 0, PIPE_W, p.topH)
                ctx.fillRect(p.x, p.topH + GAP, PIPE_W, H - p.topH - GAP - 20)
                ctx.fillRect(p.x - 3, p.topH - 10, PIPE_W + 6, 10)
                ctx.fillRect(p.x - 3, p.topH + GAP, PIPE_W + 6, 10)
            })

            ctx.beginPath()
            ctx.arc(BIRD_X, g.bird.y, BIRD_R, 0, Math.PI * 2)
            ctx.fillStyle = '#FFD700'
            ctx.fill()
            ctx.beginPath()
            ctx.arc(BIRD_X + 5, g.bird.y - 3, 3, 0, Math.PI * 2)
            ctx.fillStyle = '#000'
            ctx.fill()
            ctx.beginPath()
            ctx.moveTo(BIRD_X + BIRD_R, g.bird.y)
            ctx.lineTo(BIRD_X + BIRD_R + 8, g.bird.y + 3)
            ctx.lineTo(BIRD_X + BIRD_R, g.bird.y + 6)
            ctx.fillStyle = '#FF8C00'
            ctx.fill()

            ctx.fillStyle = '#fff'
            ctx.font = 'bold 16px monospace'
            ctx.fillText(g.score, W / 2, 25)

            if (!g.started) {
                ctx.fillStyle = 'rgba(0,0,0,0.5)'
                ctx.fillRect(0, 0, W, H)
                ctx.fillStyle = '#fff'
                ctx.font = '14px monospace'
                ctx.textAlign = 'center'
                ctx.fillText('click or press space to start', W / 2, H / 2)
                ctx.textAlign = 'left'
            }

            g.animFrame = requestAnimationFrame(loop)
        }
        g.animFrame = requestAnimationFrame(loop)
    }

    return (
        <div style={styles.wrapper}>
            <p style={styles.title}>🐦 Flappy Bird appeared!</p>
            <p style={styles.hint}>Click or Space to flap</p>
            <canvas
                ref={canvasRef}
                width={W}
                height={H}
                style={styles.canvas}
            />
            {dead && (
                <div style={styles.deadOverlay}>
                    <p style={styles.deadText}>💀 Score: {score}</p>
                    <p style={styles.deadSub}>still not studying huh</p>
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

export default FlappyGame