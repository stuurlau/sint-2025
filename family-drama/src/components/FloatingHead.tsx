import { useEffect, useRef, useState } from 'react'

type FloatingHeadProps = {
  disabled?: boolean
  onExplode: () => void
}

type Position = {
  x: number
  y: number
}

type Velocity = {
  vx: number
  vy: number
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min

const randomVelocity = (): Velocity => ({
  vx: randomBetween(0.008, 0.02) * (Math.random() > 0.5 ? 1 : -1),
  vy: randomBetween(0.01, 0.025) * (Math.random() > 0.5 ? 1 : -1),
})

const randomPosition = (): Position => ({
  x: randomBetween(10, 80),
  y: randomBetween(10, 70),
})

export const FloatingHead = ({ disabled = false, onExplode }: FloatingHeadProps) => {
  const [position, setPosition] = useState<Position>(() => randomPosition())
  const [isExploding, setIsExploding] = useState(false)
  const frameRef = useRef<number | undefined>(undefined)
  const lastTimeRef = useRef<number | undefined>(undefined)
  const positionRef = useRef(position)
  const velocityRef = useRef<Velocity>(randomVelocity())
  const explosionTimeoutRef = useRef<number | undefined>(undefined)

  const resetHead = () => {
    const nextPos = randomPosition()
    positionRef.current = nextPos
    setPosition(nextPos)
    velocityRef.current = randomVelocity()
  }

  useEffect(() => {
    positionRef.current = position
  }, [position])

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp
      }
      const delta = Math.min(timestamp - lastTimeRef.current, 32)
      lastTimeRef.current = timestamp

      if (!disabled && !isExploding) {
        let { x, y } = positionRef.current
        let { vx, vy } = velocityRef.current

        x += vx * delta
        y += vy * delta

        if (x <= 5 || x >= 90) {
          vx *= -1
          x = clamp(x, 5, 90)
        }

        if (y <= 5 || y >= 85) {
          vy *= -1
          y = clamp(y, 5, 85)
        }

        velocityRef.current = { vx, vy }
        const nextPos = { x, y }
        positionRef.current = nextPos
        setPosition(nextPos)
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      lastTimeRef.current = undefined
    }
  }, [disabled, isExploding])

  useEffect(() => {
    return () => {
      if (explosionTimeoutRef.current) {
        window.clearTimeout(explosionTimeoutRef.current)
      }
    }
  }, [])

  const handleExplode = () => {
    if (disabled || isExploding) return

    setIsExploding(true)
    onExplode()

    if (explosionTimeoutRef.current) {
      window.clearTimeout(explosionTimeoutRef.current)
    }
    explosionTimeoutRef.current = window.setTimeout(() => {
      setIsExploding(false)
      resetHead()
    }, 500)
  }

  return (
    <button
      className={`floating-head ${isExploding ? 'exploding' : ''}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        visibility: disabled && !isExploding ? 'hidden' : 'visible',
      }}
      type="button"
      onClick={handleExplode}
      aria-label="Explode the mean head"
    >
      <div className="floating-head__sprite">
        <img src="/heks.png" alt="Mean family member" className="floating-head__image" />
        {isExploding && (
          <img
            src="/explosion.gif"
            alt=""
            aria-hidden="true"
            className="floating-head__explosion"
          />
        )}
      </div>
    </button>
  )
}

export default FloatingHead

