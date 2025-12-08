import { useEffect, useRef, useState } from 'react'

export type HeadType = 'enemy' | 'friendly'

type FloatingHeadProps = {
  id: string
  imageSrc: string
  imageAlt: string
  type: HeadType
  disabled?: boolean
  onExplode: (id: string, type: HeadType) => void
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

export const FloatingHead = ({
  id,
  imageSrc,
  imageAlt,
  type,
  disabled = false,
  onExplode,
}: FloatingHeadProps) => {
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
    onExplode(id, type)

    if (explosionTimeoutRef.current) {
      window.clearTimeout(explosionTimeoutRef.current)
    }
    explosionTimeoutRef.current = window.setTimeout(() => {
      setIsExploding(false)
      resetHead()
    }, 500)
  }

  const ariaLabel = type === 'enemy' 
    ? 'Klik om de heks te raken' 
    : `Niet schieten! Dit is ${imageAlt}`

  return (
    <button
      className={`floating-head ${isExploding ? 'exploding' : ''} floating-head--${type}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        visibility: disabled && !isExploding ? 'hidden' : 'visible',
      }}
      type="button"
      onClick={handleExplode}
      aria-label={ariaLabel}
    >
      <div className="floating-head__sprite">
        <img 
          src={`${import.meta.env.BASE_URL}${imageSrc}`} 
          alt={imageAlt} 
          className="floating-head__image"
        />
        {isExploding && (
          <img
            src={`${import.meta.env.BASE_URL}explosion.gif`}
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
