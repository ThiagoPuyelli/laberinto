import { useEffect, useMemo, useState } from 'react'
import laberinto from './laberintos/2.json'
import './App.css'
import Maze from './components/Maze'
//import {
//  agregarTrampas,
//  generarLaberintoKruskalSimple,
//} from './generators/GenerarLaberinto'

type MazeCell = 0 | 1 | 2 | 3 | 4 | 5 | 6

type Coordinate = {
  row: number
  col: number
}

const START_POSITION: Coordinate = { row: 1, col: 0 }

/**
 * Encuentra el camino más corto entre dos puntos usando BFS
 */
function encontrarCamino(
  maze: MazeCell[][],
  start: Coordinate,
  exit: Coordinate
): Coordinate[] {
  const rows = maze.length
  const cols = maze[0].length
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false))
  const prev = Array.from({ length: rows }, () => Array(cols).fill<Coordinate | null>(null))

  const queue: Coordinate[] = [start]
  visited[start.row][start.col] = true

  const dirs = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ]

  while (queue.length > 0) {
    const current = queue.shift()!
    if (current.row === exit.row && current.col === exit.col) break

    for (const d of dirs) {
      const nr = current.row + d.row
      const nc = current.col + d.col

      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        !visited[nr][nc] &&
        maze[nr][nc] !== 1 && // no pared
        maze[nr][nc] !== 2    // no trampa
      ) {
        visited[nr][nc] = true
        prev[nr][nc] = current
        queue.push({ row: nr, col: nc })
      }
    }
  }

  // reconstruir el camino si existe
  const path: Coordinate[] = []
  let curr: Coordinate | null = exit
  while (curr) {
    path.push(curr)
    curr = prev[curr.row][curr.col]
  }

  return path.reverse()
}

function App() {
  const [maze] = useState<MazeCell[][]>(() => {
    return laberinto.laberinto as MazeCell[][]
    //const generated = agregarTrampas(generarLaberintoKruskalSimple(30, 15), 0.4)
    //const exitRow = generated.length - 2
    //const exitCol = generated[0].length - 1
//
    //return generated.map((row, rowIndex) =>
    //  row.map((cell, colIndex) => {
    //    if (
    //      (rowIndex === START_POSITION.row && colIndex === START_POSITION.col) ||
    //      (rowIndex === exitRow && colIndex === exitCol)
    //    ) {
    //      return 0
    //    }
    //    return cell as MazeCell
    //  }),
    //)
  })
  //setMaze()
  console.log(maze)

  const exitPosition = useMemo<Coordinate>(
    () => ({
      row: maze.length > 1 ? maze.length - 2 : 0,
      col: maze.length > 0 ? maze[0].length - 1 : 0,
    }),
    [maze],
  )

  const [playerPosition, setPlayerPosition] = useState<Coordinate>(START_POSITION)
  const solutionPath = useMemo(() => {
    return encontrarCamino(maze, START_POSITION, exitPosition)
  }, [maze, exitPosition])

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
        case 'w':
          delta = { row: -1, col: 0 }
          break
        case 's':
          delta = { row: 1, col: 0 }
          break
        case 'a':
          delta = { row: 0, col: -1 }
          break
        case 'd':
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
        if (solutionPath.some(p => p.row === rowIndex && p.col === colIndex)) {
          return 6
        }
        return cell
      }),
    )
  }, [maze, playerPosition, exitPosition, solutionPath])

  return (
    <main className="app">
      <Maze grid={renderedMaze} />
    </main>
  )
}

export default App
