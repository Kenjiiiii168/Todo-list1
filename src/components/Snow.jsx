import { useEffect, useRef } from 'react'

export default function Snow() {
  const canvasRef = useRef(null)
  const animationRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const DPR = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = width * DPR
    canvas.height = height * DPR
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    ctx.scale(DPR, DPR)

    const numFlakes = Math.round((width * height) / 9000)

    const flakes = Array.from({ length: numFlakes }, () => createFlake(width, height))

    function createFlake(w, h) {
      const size = Math.random() * 2.2 + 0.8 // 0.8 - 3 px
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: size,
        speed: 0.6 + Math.random() * 1.2,
        drift: (Math.random() * 0.6 + 0.2) * (Math.random() < 0.5 ? -1 : 1),
        angle: Math.random() * Math.PI * 2,
      }
    }

    function tick() {
      ctx.clearRect(0, 0, width, height)

      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      flakes.forEach((f) => {
        f.angle += 0.01
        f.y += f.speed
        f.x += Math.sin(f.angle) * f.drift
        if (f.y > height + 5) {
          f.y = -10
          f.x = Math.random() * width
        }
        if (f.x < -5) f.x = width + 5
        if (f.x > width + 5) f.x = -5

        ctx.beginPath()
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(tick)
    }

    function onResize() {
      width = window.innerWidth
      height = window.innerHeight
      const DPR2 = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * DPR2
      canvas.height = height * DPR2
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.scale(DPR2, DPR2)
    }

    window.addEventListener('resize', onResize)
    tick()

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}


