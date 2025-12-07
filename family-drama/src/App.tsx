import { useMemo, useState } from 'react'
import FloatingHead from './components/FloatingHead'
import './App.css'

const TARGET_EXPLOSIONS = 5

function App() {
  const [explodedHeads, setExplodedHeads] = useState(0)

  const remainingHeads = useMemo(
    () => Math.max(TARGET_EXPLOSIONS - explodedHeads, 0),
    [explodedHeads],
  )
  const hasWon = explodedHeads >= TARGET_EXPLOSIONS
  const remainingText = useMemo(
    () => `Remaining family witches: ${remainingHeads}`,
    [remainingHeads],
  )

  const handleHeadExploded = () => {
    setExplodedHeads((current) => Math.min(current + 1, TARGET_EXPLOSIONS))
  }

  return (
    <div className="app">
      <header className="scoreboard">
        <h1>Eliminate the family wench</h1>
      </header>

      <main className="game-area">
        <FloatingHead onExplode={handleHeadExploded} disabled={hasWon} />

        <section className="counter-card" aria-live="polite">
          <span>{remainingText}</span>
        </section>

        {hasWon && (
          <div className="victory-overlay" role="alert" aria-live="assertive">
            <img
              src={`${import.meta.env.BASE_URL}poppers.gif`}
              alt="Animated party poppers celebrating your victory"
              className="victory-overlay__poppers"
            />

            <div className="victory-overlay__card">
              <h2>Congratulations, you've eliminated all family drama!</h2>
              <p>U find uw prijs, tussen het ijs!</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
