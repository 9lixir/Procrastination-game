import { useEffect, useRef, useState } from 'react'

function DinoGame({ onClose }) {
    const canvasRef = useRef(null)
    const gameRef = useRef(null)
    const [dead, setDead] = useState(false)
    const [score, setScore] = useState(0)

    const W = 360
    const H = 180
    const GROUND_Y = H - 30      // y position of ground line
    const DINO_X = 50
    const DINO_W = 28
    const DINO_H = 38
    const OBS_W = 18

    const initGame = () => ({
        dinoY: GROUND_Y - DINO_H,  // top of dino, sitting on ground
        vy: 0,
        jumping: false,
        obstacles: [],
        score: 0,
        speed: 3.5,
        tickCount: 0,
        gameOver: false,
        animFrame: null,
    })

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        gameRef.current = initGame()
        const g = gameRef.current

        const jump = () => {
            if (!g.jumping && !g.gameOver) {
                g.vy = -10  // negative = moving up in canvas coords
                g.jumping = true
            }
        }

        const handleKey = (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault()
                jump()
            }
        }

        window.addEventListener('keydown', handleKey)
        canvas.addEventListener('click', jump)

        const draw = () => {
            ctx.clearRect(0, 0, W, H)

            // background
            ctx.fillStyle = '#111'
            ctx.fillRect(0, 0, W, H)

            // ground line
            ctx.fillStyle = '#444'
            ctx.fillRect(0, GROUND_Y, W, 2)

            // update dino physics
            g.vy += 0.6                     // gravity pulls down (positive y)
            g.dinoY += g.vy

            // land on ground
            if (g.dinoY >= GROUND_Y - DINO_H) {
                g.dinoY = GROUND_Y - DINO_H
                g.vy = 0
                g.jumping = false
            }

            // draw dino (rectangle, top-left corner is DINO_X, g.dinoY)
            ctx.fillStyle = '#6c63ff'
            ctx.fillRect(DINO_X, g.dinoY, DINO_W, DINO_H)

            // dino eye
            ctx.fillStyle = '#fff'
            ctx.fillRect(DINO_X + 18, g.dinoY + 8, 6, 6)
            ctx.fillStyle = '#000'
            ctx.fillRect(DINO_X + 20, g.dinoY + 10, 3, 3)

            // spawn obstacles
            g.tickCount++
            const spawnInterval = Math.max(70 - Math.floor(g.score / 10), 35)
            if (g.tickCount >= spawnInterval) {
                const obsH = 20 + Math.random() * 25
                g.obstacles.push({
                    x: W,
                    h: obsH,
                    y: GROUND_Y - obsH   // sits on ground
                })
                g.tickCount = 0
            }

            // move + draw obstacles
            g.obstacles = g.obstacles.filter(obs => obs.x + OBS_W > 0)
            g.obstacles.forEach(obs => {
                obs.x -= g.speed
                ctx.fillStyle = '#ff4444'
                ctx.fillRect(obs.x, obs.y, OBS_W, obs.h)
            })

            // collision detection
            const dinoLeft = DINO_X + 4
            const dinoRight = DINO_X + DINO_W - 4
            const dinoBottom = g.dinoY + DINO_H - 4

            for (const obs of g.obstacles) {
                const obsLeft = obs.x + 3
                const obsRight = obs.x + OBS_W - 3
                const obsTop = obs.y

                if (
                    dinoRight > obsLeft &&
                    dinoLeft < obsRight &&
                    dinoBottom > obsTop
                ) {
                    g.gameOver = true
                    setDead(true)
                    setScore(Math.floor(g.score))
                    return
                }
            }

            // score + speed
            g.score += 0.08
            g.speed = 3.5 + g.score / 40
            setScore(Math.floor(g.score))

            // score text
            ctx.fillStyle = '#666'
            ctx.font = '13px monospace'
            ctx.fillText(`score: ${Math.floor(g.score)}`, W - 90, 20)

            g.animFrame = requestAnimationFrame(draw)
        }

        g.animFrame = requestAnimationFrame(draw)

        return () => {
            cancelAnimationFrame(g.animFrame)
            window.removeEventListener('keydown', handleKey)
            canvas.removeEventListener('click', jump)
        }
    }, [])

    const restart = () => {
        cancelAnimationFrame(gameRef.current?.animFrame)
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        gameRef.current = initGame()
        const g = gameRef.current
        setDead(false)
        setScore(0)

        const jump = () => {
            if (!g.jumping && !g.gameOver) {
                g.vy = -10
                g.jumping = true
            }
        }

        canvas.onclick = jump

        const draw = () => {
            ctx.clearRect(0, 0, W, H)
            ctx.fillStyle = '#111'
            ctx.fillRect(0, 0, W, H)
            ctx.fillStyle = '#444'
            ctx.fillRect(0, GROUND_Y, W, 2)

            g.vy += 0.6
            g.dinoY += g.vy
            if (g.dinoY >= GROUND_Y - DINO_H) {
                g.dinoY = GROUND_Y - DINO_H
                g.vy = 0
                g.jumping = false
            }

            ctx.fillStyle = '#6c63ff'
            ctx.fillRect(DINO_X, g.dinoY, DINO_W, DINO_H)
            ctx.fillStyle = '#fff'
            ctx.fillRect(DINO_X + 18, g.dinoY + 8, 6, 6)
            ctx.fillStyle = '#000'
            ctx.fillRect(DINO_X + 20, g.dinoY + 10, 3, 3)

            g.tickCount++
            const spawnInterval = Math.max(70 - Math.floor(g.score / 10), 35)
            if (g.tickCount >= spawnInterval) {
                const obsH = 20 + Math.random() * 25
                g.obstacles.push({ x: W, h: obsH, y: GROUND_Y - obsH })
                g.tickCount = 0
            }

            g.obstacles = g.obstacles.filter(obs => obs.x + OBS_W > 0)
            g.obstacles.forEach(obs => {
                obs.x -= g.speed
                ctx.fillStyle = '#ff4444'
                ctx.fillRect(obs.x, obs.y, OBS_W, obs.h)
            })

            const dinoBottom = g.dinoY + DINO_H - 4
            for (const obs of g.obstacles) {
                if (
                    DINO_X + DINO_W - 4 > obs.x + 3 &&
                    DINO_X + 4 < obs.x + OBS_W - 3 &&
                    dinoBottom > obs.y
                ) {
                    g.gameOver = true
                    setDead(true)
                    setScore(Math.floor(g.score))
                    return
                }
            }

            g.score += 0.08
            g.speed = 3.5 + g.score / 40
            setScore(Math.floor(g.score))

            ctx.fillStyle = '#666'
            ctx.font = '13px monospace'
            ctx.fillText(`score: ${Math.floor(g.score)}`, W - 90, 20)

            g.animFrame = requestAnimationFrame(draw)
        }

        g.animFrame = requestAnimationFrame(draw)
    }

    return (
        <div style={styles.wrapper}>
            <p style={styles.title}>🦖 Don't hit the red things</p>
            <p style={styles.hint}>Space / Arrow Up / Click to jump</p>
            <div style={{ position: 'relative' }}>
                <canvas
                    ref={canvasRef}
                    width={W}
                    height={H}
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
        </div>
    )
}

const styles = {
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
    },
    title: { fontWeight: 'bold', fontSize: '1rem' },
    hint: { color: '#888', fontSize: '0.8rem' },
    canvas: {
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'block',
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
