import { Component } from "react";

import Cell from "./Cell"

class Board extends Component {

    render () {
        let {
            gameover,mines,cells,
            openCell,flagCell,openCells
        } = this.props
        let counter = mines
        // console.log(ingame)
        let rows = []
        cells.forEach(rc => {
            let row = []
            rc.forEach(cell => {
                let {
                    key,status,value,
                    posr,posc
                } = cell
                row.push(
                    <Cell
                        key = {"cell"+key}
                        gameover = {gameover}
                        status = {status}
                        value = {value}
                        posr = {posr}
                        posc = {posc} 
                        openCell = {openCell}
                        openCells = {openCells}
                        flagCell = {flagCell}
                    />
                )
                if (status==="flag") {
                    counter -= 1
                }
            })
            rows.push(
                <div className="row"
                    key={"row"+rows.length}
                >
                    {row}
                </div>
            )            
        });

        return (
            <div className="Board">
                <header>
                    <div>🚩 = {counter}</div>
                    <div>00:00</div>
                </header>
                {rows}
            </div>
        )
    }

}

export default Board