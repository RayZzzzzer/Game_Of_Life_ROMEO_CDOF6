import chalk from 'chalk';

const ALIVE = "O"; // Cellule vivante
const DEAD = ".";  // Cellule morte

// Génère une grille initiale avec une configuration par défaut (Glider)
function createGrid(rows, cols, pattern = 'random') {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(DEAD));

  if (pattern === 'glider') {
    // Placer un Glider à une position par défaut (coordonnées 1,1)
    const gliderPattern = [
      [0, 1], [1, 2], [2, 0], [2, 1], [2, 2]
    ];
    gliderPattern.forEach(([x, y]) => {
      grid[x + 1][y + 1] = ALIVE; // Décalage pour centrer le Glider
    });
  } else if (pattern === 'random') {
    // Génère une grille aléatoire
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j] = Math.random() > 0.5 ? ALIVE : DEAD;
      }
    }
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
function gameOfLife(rows, cols, generations, interval = 500, pattern = 'random') {
  let grid = createGrid(rows, cols, pattern);

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
const pattern = 'glider'; // Utilise le Glider comme configuration par défaut

gameOfLife(rows, cols, generations, 500, pattern);
