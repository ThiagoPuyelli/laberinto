type MazeCell = 0 | 1 | 2 | 3 | 4 | 5

type MazeProps = {
  grid: MazeCell[][]
}

const CELL_CODE_TO_CLASS: Record<MazeCell, string> = {
  0: 'maze-cell--empty',
  1: 'maze-cell--wall',
  2: 'maze-cell--trap',
  3: 'maze-cell--player',
  4: 'maze-cell--exit',
  5: 'maze-cell--index',
}

export default function Maze({ grid }: MazeProps) {
  if (grid.length === 0) {
    return <div className="maze">No hay celdas para mostrar</div>
  }

  const rows = grid.length
  const columns = grid[0].length
  const totalColumns = columns + 1
  let i = 0

  return (
    <div
      className="maze"
      style={{
        gridTemplateColumns: `repeat(${totalColumns}, 1fr)`,
      }}
    >
      {Array.from({ length: rows + 1 }).flatMap((_, rowIndex) =>
        Array.from({ length: totalColumns }).map((_, columnIndex) => {
          const realRow = rowIndex - 1
          const realColumn = columnIndex - 1

          if (rowIndex === 0 && columnIndex === 0) {
            return (
              <div
                key="index-corner"
                className={`maze-cell ${CELL_CODE_TO_CLASS[5]}`}
                aria-hidden="true"
              />
            )
          }

          if (rowIndex === 0) {
            const label = `Índice columna ${realColumn}`
            return (
              <div
                key={`col-index-${columnIndex}`}
                className={`maze-cell ${CELL_CODE_TO_CLASS[5]}`}
                aria-label={label}
                title={label}
              >
                {realColumn}
              </div>
            )
          }

          if (columnIndex === 0) {
            const label = `Índice fila ${realRow}`
            return (
              <div
                key={`row-index-${rowIndex}`}
                className={`maze-cell ${CELL_CODE_TO_CLASS[5]}`}
                aria-label={label}
                title={label}
              >
                {realRow}
              </div>
            )
          }

          const cell = grid[realRow][realColumn]
          if (cell !== 1) i++
          return (
            <div
              key={`${realRow}-${realColumn}`}
              className={`maze-cell ${CELL_CODE_TO_CLASS[cell]}`}
              aria-label={`Celda ${realRow}-${realColumn}`}
            >{cell !== 1 ? i - 1 : ""}</div>
          )
        }),
      )}
    </div>
  )
}
