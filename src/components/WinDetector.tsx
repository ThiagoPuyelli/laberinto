import { useEffect, useState } from 'react'

interface WinDetectorProps {
  playerPosition: { row: number; col: number }
  exitPosition: { row: number; col: number }
}

export default function WinDetector({ playerPosition, exitPosition }: WinDetectorProps) {
  const [hasWon, setHasWon] = useState(false)

  useEffect(() => {
    const reachedExit =
      playerPosition.row === exitPosition.row && playerPosition.col === exitPosition.col

    if (reachedExit) {
      setHasWon(true)
    } else if (hasWon) {
      setHasWon(false)
    }
  }, [playerPosition, exitPosition])

  if (!hasWon) return null

  return (
    <div className="win-overlay">
      <div className="win-message">🎉 ¡Ganaste! 🎉</div>
    </div>
  )
}
