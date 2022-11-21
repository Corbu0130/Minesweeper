import {Component} from "react"

import './App.css';
import Menu from "./Menu"
import Board from "./Board"

class App extends Component {

  state = {
    ingame: false,
    row: 10,
    col: 10,
    gameover: false
  }

  constructor () {
    super()
    let {row,col} = this.state
    this.state.mines = Math.ceil(row*col*0.2)
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
      ingame,gameover,row,col,mines,cells
    } = this.state
    // console.log(cells)
    return (
      <div className="App">
        <Menu row={row} col={col} 
          mines={mines} 
          newgame={this.newgame}
          reset={this.reset}
        />
        <Board ingame={ingame} 
          gameover={gameover}
          row={row} col={col}
          cells={cells} mines={mines}
          openCell={this.openCell}
          flagCell={this.flagCell}
          openCells={this.openCells}
        />
      </div>
    );
  }

  makecells ({row,col,mines}) {
    let cells = []

    let a = Array.from(
      {length: row*col}, 
      () => Math.random()
    )
    let b = [...a].sort()[mines]
    let c = a.map((val) => (val<b) ? 1:0)
    // console.log(c)

    let d = []
    for (let i=0; i<row; i++) {
        d.push(c.slice(i*col,(i+1)*col))
    }
    // console.log(d)

    let e = []
    for (let i=0; i<row; i++) {
        let f = [...d[i]]
        for (let j=0; j<col; j++) {
            f[j] = this.countmine(d,i,j)
        }
        e.push(f)
    }
    // console.log(e)

    for (let i=0; i<row; i++) {
      let arr = []
      for (let j=0; j<col; j++) {
          let key = i*row+j+1
          arr.push({
              key,
              status: "close",
              value: e[i][j],
              posr: i,
              posc: j
          })
      }
      cells.push(arr)
    }
    // console.log(cells)
    return cells
  }

  countmine (d,r,c) {
    let row = d.length
    let col = d[r].length
    let mines = d[r][c]
    if (mines===0) {
      for (let i=r-1; i<r+2; i++) {
        for (let j=c-1; j<c+2; j++) {
          if (
            (i>=0) && (j>=0) &&
            (i<row) && (j<col) &&
            !((i===r) && (j===c))
          ) {
            mines += d[i][j]
          }
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
    let {ingame,cells,gameover} = this.state
    cells.forEach(row => {
      row.forEach(cell => {
        cell.status = "close"
      })
    })
    // console.log(cells)
    ingame = false
    gameover = false
    this.setState({ingame,cells,gameover})
    // console.log(this.state.cells)
  }

  openCell(cellpos) {
      let {ingame,row,col,cells} = this.state
      if (!ingame) {
          this.setState({
              ingame: !ingame
          })
      }
      // console.log(cellpos)
      while(cellpos.length>0) {
          let [r,c] = cellpos[0]
          // console.log([r,c])
          cellpos.shift()
          cells[r][c].status = "open"
          if (cells[r][c].value<0) {
            this.openMines()
            return null
          }
          if (cells[r][c].value===0) {
              for (let i=r-1; i<r+2; i++) {
                  for (let j=c-1; j<c+2; j++) {
                      // console.log([i,j])
                      if (
                          (i>=0) && (j>=0) &&
                          (i<row) && (j<col) &&
                          !((i===r) && (j===c))
                      ) {
                          // console.log("Around")
                          if (
                              cells[i][j]
                              .status==="close"
                          ) {
                              // console.log("Push")
                              cellpos.push([i,j])
                          }
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
    // console.log([r,c])
    for (let i=r-1; i<r+2; i++) {
        for (let j=c-1; j<c+2; j++) {
            // console.log([i,j])
            if (
                (i>=0) && (j>=0) &&
                (i<row) && (j<col) &&
                !((i===r) && (j===c))
            ) {
                // console.log("hey")
                if (cells[i][j].status==="flag") {
                    nflag += 1
                }
                if (cells[i][j].status==="close") {
                    cellpos.push([i,j])
                }
            }
        }
    }
    // console.log(cellpos)
    if (nflag===mines) {
        // console.log("open cells")
        // console.log(cellpos)
        this.openCell(cellpos)
    }
  }

  openMines () {
    let {cells} = this.state
    cells.forEach(row => {
      row.forEach(cell => {
        if (
          (cell.status==="close") &&
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
    let {row,col,mines,cells} = this.state
    let safeClose = row*col-mines
    cells.forEach(row => {
      row.forEach(cell => {
        let {status,value} = cell
        if ((status==="open") && (value>-1)) {
          safeClose -= 1
        }
      })
    })
    if (safeClose===0) {
      this.setState({
        ingame: false,
        gameover: true
      })
    }
  }

}

export default App;
