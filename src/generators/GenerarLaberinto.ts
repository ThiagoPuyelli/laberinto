class UnionFind {
  parent: any
  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i);
  }
  find(x: number) {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }
  union(x: number, y: number) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return false;
    this.parent[rootY] = rootX;
    return true;
  }
}

export function generarLaberintoKruskalSimple(ancho: number, alto: number) {
      if (ancho % 2 === 0) ancho++;
      if (alto % 2 === 0) alto++;
      const grid = Array.from({ length: alto }, () => Array(ancho).fill(1));
      const anchoCeldas = Math.floor(ancho / 2);
      const altoCeldas = Math.floor(alto / 2);
      const totalCeldas = anchoCeldas * altoCeldas;
      const uf = new UnionFind(totalCeldas);
      const edges = [];

      for (let y = 0; y < altoCeldas; y++) {
        for (let x = 0; x < anchoCeldas; x++) {
          const cell = y * anchoCeldas + x;
          if (x < anchoCeldas - 1) edges.push([cell, cell + 1]);
          if (y < altoCeldas - 1) edges.push([cell, cell + anchoCeldas]);
        }
      }

      edges.sort(() => Math.random() - 0.5);

      // marcar celdas base
      for (let y = 0; y < altoCeldas; y++) {
        for (let x = 0; x < anchoCeldas; x++) {
          grid[y * 2 + 1][x * 2 + 1] = 0;
        }
      }

      for (const [a, b] of edges) {
        if (uf.union(a, b)) {
          const ax = (a % anchoCeldas) * 2 + 1;
          const ay = Math.floor(a / anchoCeldas) * 2 + 1;
          const bx = (b % anchoCeldas) * 2 + 1;
          const by = Math.floor(b / anchoCeldas) * 2 + 1;
          grid[(ay + by) / 2][(ax + bx) / 2] = 0;
        }
      }

      return grid;
    }

export function agregarTrampas(laberinto: any[][], proporcion = 0.1, inicio = [1,1], meta: number[]|null = null) {
  const alto = laberinto.length;
  const ancho = laberinto[0].length;
  if (!meta) meta = [alto - 2, ancho - 2];

  // Candidatos válidos: paredes internas, no adyacentes a trampas ni en borde
  const candidatas = [];

  for (let y = 1; y < alto - 1; y++) {
    for (let x = 1; x < ancho - 1; x++) {
      if (
        laberinto[y][x] === 1 && // debe ser pared
        !(y === inicio[0] && x === inicio[1]) &&
        !(y === meta[0] && x === meta[1])
      ) {
        candidatas.push([y, x]);
      }
    }
  }

  const cantidad = Math.floor(candidatas.length * proporcion);
  const trampas: any[] = [];

  // Mezclamos para elegir aleatoriamente
  const mezcla = candidatas.sort(() => Math.random() - 0.5);

  // Función auxiliar para verificar si una celda está adyacente a otra trampa
  const adyacenteATrampa = (y: number, x: number) => {
    return trampas.some(([ty, tx]) =>
      Math.abs(ty - y) + Math.abs(tx - x) === 1
    );
  };

  // Seleccionamos sin adyacencia
  for (const [y, x] of mezcla) {
    if (trampas.length >= cantidad) break;
    if (!adyacenteATrampa(y, x)) {
      trampas.push([y, x]);
      laberinto[y][x] = 2; // colocar trampa
    }
  }

  return laberinto;
}