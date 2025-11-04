import { useEffect, useMemo, useState } from 'react'
import './App.css'
import Maze from './components/Maze'
import {
  agregarTrampas,
  generarLaberintoKruskalSimple,
} from './generators/GenerarLaberinto'

type MazeCell = 0 | 1 | 2 | 3 | 4 | 5

type Coordinate = {
  row: number
  col: number
}

const START_POSITION: Coordinate = { row: 1, col: 0 }

function App() {
  const [maze] = useState<MazeCell[][]>(() => {
    const generated = agregarTrampas(generarLaberintoKruskalSimple(45, 20), 0.4)
    const exitRow = generated.length - 2
    const exitCol = generated[0].length - 1

    return generated.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (
          (rowIndex === START_POSITION.row && colIndex === START_POSITION.col) ||
          (rowIndex === exitRow && colIndex === exitCol)
        ) {
          return 0
        }
        return cell as MazeCell
      }),
    )
  })

  const exitPosition = useMemo<Coordinate>(
    () => ({
      row: maze.length > 1 ? maze.length - 2 : 0,
      col: maze.length > 0 ? maze[0].length - 1 : 0,
    }),
    [maze],
  )

  const [playerPosition, setPlayerPosition] = useState<Coordinate>(
    START_POSITION,
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {

      let delta: Coordinate | null = null
      switch (event.key) {
        case 'ArrowUp':
          delta = { row: -1, col: 0 }
          break
        case 'ArrowDown':
          delta = { row: 1, col: 0 }
          break
        case 'ArrowLeft':
          delta = { row: 0, col: -1 }
          break
        case 'ArrowRight':
          delta = { row: 0, col: 1 }
          break
        default:
          return
      }

      event.preventDefault()

      setPlayerPosition((prev) => {
        if (!delta) return prev
        const nextRow = prev.row + delta.row
        const nextCol = prev.col + delta.col

        if (
          nextRow < 0 ||
          nextRow >= maze.length ||
          nextCol < 0 ||
          nextCol >= maze[0].length
        ) {
          return prev
        }

        const nextCell = maze[nextRow][nextCol]
        if (nextCell === 1) {
          return prev
        } else if (nextCell === 2) {
          return {row: 1, col: 0}
        }

        return { row: nextRow, col: nextCol }
      })
    }

    window.addEventListener('keyup', handleKeyDown)
    return () => window.removeEventListener('keyup', handleKeyDown)
  }, [maze])

  const renderedMaze = useMemo(() => {
    return maze.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (rowIndex === playerPosition.row && colIndex === playerPosition.col) {
          return 3
        }
        if (rowIndex === exitPosition.row && colIndex === exitPosition.col) {
          return 4
        }
        return cell
      }),
    )
  }, [maze, playerPosition, exitPosition])

  return (
    <main className="app">
      <Maze grid={renderedMaze} />
    </main>
  )
}

export default App
