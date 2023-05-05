import Cell from "./cell.js";

var canvas = document.getElementById("mazeCanvas");

var ctx = canvas.getContext("2d");

class MazeBuilder {
  constructor(size, rows, cols) {
    this.size = size;
    this.rows = rows;
    this.cols = cols;
    this.grid = [];
    this.stack = [];
    this.setup();
  }

  setup() {
    canvas.height = this.size;
    canvas.width = this.size;
    for (let r = 0; r < this.rows; r++) {
      let row = [];
      for (let c = 0; c < this.cols; c++) {
        let cell = new Cell(
          r,
          c,
          this.size,
          this.rows,
          this.cols
        );
        row.push(cell);
        cell.buildCell();
      }
      this.grid.push(row);
    }

    this.grid[0][0].visited = true;
  }

  render() {
    console.log("RENDERING");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, this.size, this.size);

    for (let r = 0; r < this.rows; r++)
      for (let c = 0; c < this.cols; c++)
        this.grid[r][c].buildCell();
  }

  buildMaze() {
    let current = this.grid[0][0];
    current.highlight();
  }
}

let mz = new MazeBuilder(800, 12, 10);
mz.buildMaze();
