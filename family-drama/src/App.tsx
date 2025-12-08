import { useCallback, useMemo, useState } from 'react'
import FloatingHead, { type HeadType } from './components/FloatingHead'
import './App.css'

const TARGET_EXPLOSIONS = 5

const FRIENDLY_MEMBERS = [
  { id: 'emilie', src: 'Emilie-2.png', name: 'Emilie' },
  { id: 'lau', src: 'Lau.png', name: 'Lau' },
  { id: 'mo', src: 'Mo.png', name: 'Mo' },
  { id: 'fiona', src: 'Fiona.png', name: 'Fiona' },
]

function App() {
  const [explodedHeads, setExplodedHeads] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [shotFriendly, setShotFriendly] = useState<string | null>(null)
  const [gameKey, setGameKey] = useState(0)

  const remainingHeads = useMemo(
    () => Math.max(TARGET_EXPLOSIONS - explodedHeads, 0),
    [explodedHeads],
  )
  const hasWon = explodedHeads >= TARGET_EXPLOSIONS
  const remainingText = useMemo(
    () => `Overgebleven familie heksen: ${remainingHeads}`,
    [remainingHeads],
  )

  const activeFriendlies = useMemo(() => {
    return FRIENDLY_MEMBERS
  }, [gameKey])

  const handleHeadExplode = useCallback((id: string, type: HeadType) => {
    if (type === 'enemy') {
      setExplodedHeads((current) => Math.min(current + 1, TARGET_EXPLOSIONS))
    } else {
      const friendly = FRIENDLY_MEMBERS.find((m) => m.id === id)
      setShotFriendly(friendly?.name ?? 'een familielid')
      setGameOver(true)
    }
  }, [])

  const handleRestart = () => {
    setExplodedHeads(0)
    setGameOver(false)
    setShotFriendly(null)
    setGameKey((k) => k + 1)
  }

  const isDisabled = hasWon || gameOver

  return (
    <div className="app">
      <header className="scoreboard">
        <h1>Versla de familie feeks!
        </h1>
      </header>

      <main className="game-area">
        <FloatingHead
          key={`enemy-${gameKey}`}
          id="heks"
          imageSrc="heks.png"
          imageAlt="De heks"
          type="enemy"
          onExplode={handleHeadExplode}
          disabled={isDisabled}
        />

        {activeFriendlies.map((member) => (
          <FloatingHead
            key={`${member.id}-${gameKey}`}
            id={member.id}
            imageSrc={member.src}
            imageAlt={member.name}
            type="friendly"
            onExplode={handleHeadExplode}
            disabled={isDisabled}
          />
        ))}

        <section className="counter-card" aria-live="polite">
          <span>{remainingText}</span>
        </section>

        {hasWon && (
          <div className="victory-overlay" role="alert" aria-live="assertive">
            <img
              src={`${import.meta.env.BASE_URL}poppers.gif`}
              alt="Geanimeerde confetti om je overwinning te vieren"
              className="victory-overlay__poppers"
            />

            <div className="victory-overlay__card">
              <h2> Hoezee! De familie verslagen!</h2>
              <p> Open nu je cadeau, hopelijk zal je het dagelijks dragen.</p>
            </div>
          </div>
        )}

        {gameOver && !hasWon && (
          <div className="gameover-overlay" role="alert" aria-live="assertive">
            <div className="gameover-overlay__card">
              <h2>Game Over!</h2>
              <p>Je hebt {shotFriendly} geraakt! Dat is familie, geen heks!</p>
              <button 
                type="button" 
                className="gameover-overlay__restart"
                onClick={handleRestart}
              >
                Opnieuw proberen
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
