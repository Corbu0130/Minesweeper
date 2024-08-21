import {Component} from "react"

import './App.css';
import Menu from "./Menu"
import Board from "./Board"

class App extends Component {

  state = {
    ingame: false,
    row: 10,
    col: 10,
    gameover: false,
  }

  constructor () {
    super()
    let {row, col} = this.state
    this.state.mines = Math.ceil(row * col  *0.2)
    this.state.cells = this.makecells(this.state)
    
    this.newgame = this.newgame.bind(this)
    this.reset = this.reset.bind(this)
    this.openCell = this.openCell.bind(this)
    this.flagCell = this.flagCell.bind(this)
    this.openCells = this.openCells.bind(this)
    this.openMines = this.openMines.bind(this)
  }

  render () {
    let {
      ingame, gameover, row, col, mines, cells
    } = this.state
    return (
      <div className="App">
        <Menu row={row} col={col} 
          mines = {mines} 
          newgame = {this.newgame}
          reset = {this.reset}
        />
        <Board ingame={ingame} 
          gameover = {gameover}
          row = {row}
          col={col}
          cells = {cells}
          mines={mines}
          openCell = {this.openCell}
          flagCell = {this.flagCell}
          openCells = {this.openCells}
        />
      </div>
    );
  }

  makecells ({row, col, mines}) {
    let cells = []

    let randomArray = Array.from(
      {length: row*col}, 
      () => Math.random()
    )
    let mineValue = [...randomArray].sort()[mines]
    let binaryArray = randomArray.map((val) => (val < mineValue) ? 1:0)

    let binaryMatrix = []
    for (let i=0; i<row; i++) {
        binaryMatrix.push(binaryArray.slice(i * col, (i+1) * col))
    }

    let mineField = []
    for (let i = 0; i < row; i++) { 
        let mineFieldRow = [...binaryMatrix[i]]
        for (let j = 0; j < col; j++) {
          mineFieldRow[j] = this.countmine(binaryMatrix, i, j)
        }
        mineField.push(mineFieldRow)
    }

    for (let i = 0; i < row; i++) {
      let cellRow = []
      for (let j = 0; j < col; j++) {
          let key = i*row+j+1
          cellRow.push({
              key,
              status: "close",
              value: mineField[i][j],
              posr: i,
              posc: j
          })
      }
      cells.push(cellRow)
    }
    return cells
  }

  countmine (binaryMatrix, rIndex, cIndex) {
    let row = binaryMatrix.length
    let col = binaryMatrix[rIndex].length
    let mines = binaryMatrix[rIndex][cIndex]
    if (mines === 0) {
      for (let i = Math.max(rIndex - 1, 0); i < Math.min(rIndex + 2, row); i++) {
        for (let j = Math.max(cIndex - 1, 0); j < Math.min(cIndex + 2, col); j++) {
          mines += binaryMatrix[i][j]
        }
      }
    } else {
        mines = -1
    }
    return mines
  }

  newgame (state) {
    state.cells = this.makecells(state)
    state.ingame = false
    state.gameover = false
    this.setState(state)
  }

  reset () {
    let {ingame, cells, gameover} = this.state
    cells.forEach(row => {
      row.forEach(cell => {
        cell.status = "close"
      })
    })

    ingame = false
    gameover = false
    this.setState({ingame, cells, gameover})
  }

  openCell(cellpos) {
      let {ingame, row, col, cells} = this.state
      if (!ingame) {
          this.setState({
              ingame: !ingame
          })
      }

      while(cellpos.length > 0) {
          let [r, c] = cellpos[0]
          cellpos.shift()
          cells[r][c].status = "open"

          if (cells[r][c].value<0) {
            this.openMines()
            return null
          }

          if (cells[r][c].value === 0) {
              for (let i = Math.max(r-1, 0); i < Math.min(r+2, row); i++) {
                  for (let j = Math.max(c-1, 0); j < Math.min(c+2, col); j++) {
                    if (
                        cells[i][j]
                        .status==="close"
                    ) {
                        cellpos.push([i,j])
                    }
                  }
              }
          }
      }

      this.setState({cells})
  }

  flagCell (r,c) {
      let {cells} = this.state
      let status = cells[r][c].status
      if (status==="close") {
          cells[r][c].status = "flag"
      }
      if (status==="flag") {
          cells[r][c].status = "close"
      }
      this.setState({cells})
  }

  openCells (r,c) {
    let {row,col,cells} = this.state
    let mines = cells[r][c].value
    let nflag = 0
    let cellpos = []

    for (let i = Math.max(r-1, 0); i < Math.min(r+2, row); i++) {
        for (let j = Math.max(c-1, 0); j < Math.min(c+2, col); j++) {
          if (cells[i][j].status === "flag") {
            nflag += 1
          }
          if (cells[i][j].status === "close") {
              cellpos.push([i,j])
          }
        }
    }

    if (nflag === mines) {
        this.openCell(cellpos)
    }
  }

  openMines () {
    let {cells} = this.state
    cells.forEach(row => {
      row.forEach(cell => {
        if (
          (cell.status === "close") &&
          (cell.value<0)
        ) {
          cell.status = "open"
        }
      })
    })
    let state = {
      ingame: false,
      gameover: true,
      cells
    }
    this.setState(state)
    this.checkCells()
  }

  checkCells () {
    let {row, col, mines, cells} = this.state
    let safeClose = row*col-mines
    cells.forEach(row => {
      row.forEach(cell => {
        let {status,value} = cell
        if ((status==="open") && (value>-1)) {
          safeClose -= 1
        }
      })
    })
    if (safeClose === 0) {
      this.setState({
        ingame: false,
        gameover: true
      })
    }
  }

}

export default App;
