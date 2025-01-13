import chalk from 'chalk';

const ALIVE = "O"; // Cellule vivante
const DEAD = ".";  // Cellule morte

// Génère une grille initiale aléatoire
function createGrid(rows, cols) {
  const grid = [];
  for (let i = 0; i < rows; i++) {
    grid.push(Array.from({ length: cols }, () => (Math.random() > 0.5 ? ALIVE : DEAD)));
  }
  return grid;
}

// Affiche la grille
function printGrid(grid) {
  console.clear();
  console.log(grid.map(row => row.map(cell => (cell === ALIVE ? chalk.green(cell) : chalk.gray(cell))).join(" ")).join("\n"));
}

// Compte les cellules vivantes autour d'une cellule donnée
function countAliveNeighbors(grid, x, y) {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [ 0, -1],          [ 0, 1],
    [ 1, -1], [ 1, 0], [ 1, 1]
  ];
  let aliveNeighbors = 0;

  directions.forEach(([dx, dy]) => {
    const newX = x + dx;
    const newY = y + dy;
    if (newX >= 0 && newX < grid.length && newY >= 0 && newY < grid[0].length) {
      if (grid[newX][newY] === ALIVE) aliveNeighbors++;
    }
  });

  return aliveNeighbors;
}

// Génère une nouvelle génération
function nextGeneration(grid) {
  return grid.map((row, x) =>
    row.map((cell, y) => {
      const aliveNeighbors = countAliveNeighbors(grid, x, y);
      if (cell === ALIVE && (aliveNeighbors === 2 || aliveNeighbors === 3)) {
        return ALIVE; // Survit
      } else if (cell === DEAD && aliveNeighbors === 3) {
        return ALIVE; // Naît
      } else {
        return DEAD;  // Meurt
      }
    })
  );
}

// Boucle principale
function gameOfLife(rows, cols, generations, interval = 500) {
  let grid = createGrid(rows, cols);

  let generation = 0;
  const intervalId = setInterval(() => {
    console.log(chalk.blue(`Generation: ${generation}`));
    printGrid(grid);
    grid = nextGeneration(grid);
    generation++;
    if (generation >= generations) clearInterval(intervalId);
  }, interval);
}

// Paramètres du jeu
const rows = 20; // Nombre de lignes
const cols = 40; // Nombre de colonnes
const generations = 100; // Nombre de générations
gameOfLife(rows, cols, generations);
