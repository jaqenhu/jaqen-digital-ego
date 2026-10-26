import { useEffect, useRef } from 'react'

const HOVER_RADIUS = 260

/**
 * 克制的科技感背景：缓慢漂移的粒子星座 + 近邻连线。
 * 红色调、低透明度，配合 CSS 的红色辉光与细网格构成首屏氛围。
 */
export default function HeroBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf = 0
    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    const motionPreference = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )
    let isVisible = true

    const pointer = { x: -9999, y: -9999 }
    let particles = []

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // 按面积决定粒子数，控制密度，保持克制
      const count = Math.round(Math.min(120, (width * height) / 14000))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.6 + 0.6,
      }))
      syncAnimation()
    }

    const step = () => {
      raf = 0
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        const pdist = Math.hypot(p.x - pointer.x, p.y - pointer.y)
        const hoverStrength = Math.max(0, 1 - pdist / HOVER_RADIUS)

        // 近邻连线（星座）
        for (let j = i + 1; j < particles.length; j += 1) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.hypot(dx, dy)
          if (dist < 150) {
            const midpointDistance = Math.hypot(
              (p.x + q.x) / 2 - pointer.x,
              (p.y + q.y) / 2 - pointer.y,
            )
            const linkHover = Math.max(0, 1 - midpointDistance / HOVER_RADIUS)
            const alpha = (1 - dist / 150) * (0.32 + linkHover * 0.55)
            ctx.strokeStyle = `rgba(255, ${Math.round(70 + linkHover * 135)}, ${Math.round(78 + linkHover * 102)}, ${alpha})`
            ctx.lineWidth = 0.6 + linkHover * 0.8
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }

        // 鼠标附近使用更亮的蜜桃色，增强与深色背景的对比。
        if (hoverStrength > 0) {
          const alpha = hoverStrength ** 0.65 * 0.95
          ctx.strokeStyle = `rgba(255, 205, 180, ${alpha})`
          ctx.lineWidth = 1 + hoverStrength * 0.7
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(pointer.x, pointer.y)
          ctx.stroke()

          const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r + 8)
          halo.addColorStop(0, `rgba(255, 205, 168, ${hoverStrength * 0.3})`)
          halo.addColorStop(1, 'rgba(255, 205, 168, 0)')
          ctx.fillStyle = halo
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r + 8, 0, Math.PI * 2)
          ctx.fill()
        }

        // 节点
        ctx.fillStyle = `rgba(255, ${Math.round(90 + hoverStrength * 140)}, ${Math.round(96 + hoverStrength * 109)}, ${0.85 + hoverStrength * 0.15})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r + hoverStrength * 2, 0, Math.PI * 2)
        ctx.fill()
      }

      if (isVisible && !document.hidden && !motionPreference.matches) {
        raf = requestAnimationFrame(step)
      }
    }

    const syncAnimation = () => {
      cancelAnimationFrame(raf)
      raf = 0
      if (!isVisible || document.hidden) return
      if (motionPreference.matches) step()
      else raf = requestAnimationFrame(step)
    }
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      syncAnimation()
    })

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      if (
        e.pointerType === 'touch' ||
        e.clientX < rect.left || e.clientX > rect.right ||
        e.clientY < rect.top || e.clientY > rect.bottom
      ) {
        onPointerLeave()
        return
      }
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
    }
    const onPointerLeave = () => {
      pointer.x = -9999
      pointer.y = -9999
    }
    const onPointerOut = (e) => {
      if (!e.relatedTarget) onPointerLeave()
    }

    resize()
    visibilityObserver.observe(canvas)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('blur', onPointerLeave)
    document.addEventListener('pointerout', onPointerOut)
    document.addEventListener('visibilitychange', syncAnimation)
    motionPreference.addEventListener('change', syncAnimation)

    return () => {
      cancelAnimationFrame(raf)
      visibilityObserver.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('blur', onPointerLeave)
      document.removeEventListener('pointerout', onPointerOut)
      document.removeEventListener('visibilitychange', syncAnimation)
      motionPreference.removeEventListener('change', syncAnimation)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />
}
