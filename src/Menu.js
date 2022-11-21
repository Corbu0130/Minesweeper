import { Component } from "react";

class Menu extends Component {

    constructor (props) {
        super()
        let {row,col,mines} = props
        this.state = { row,col,mines }

        this.changeRow = this.changeRow.bind(this)
        this.changeCol = this.changeCol.bind(this)
        this.changeMines = this.changeMines
        .bind(this)
        this.handleSubmit = this.handleSubmit
        .bind(this)
        this.handleReset = this.handleReset
        .bind(this)
    }

    render () {
        let {row,col,mines} = this.state
        return (
            <div className="Menu"
                onSubmit={this.handleSubmit}
            >
                <h1>Minesweeper</h1>
                <form>
                    Row: <input
                        name="row"
                        type="number"
                        value={row}
                        onChange={this.changeRow}
                    /><br/>
                    Column: <input
                        name="col"
                        type="number"
                        value={col}
                        onChange={this.changeCol}
                    /><br/>
                    Mines: <input
                        name="mines"
                        type="number"
                        value={mines}
                        onChange={this.changeMines}
                    />
                    <br/>
                    <br/>
                    <br/>
                    <button type="submit">
                        New Game
                    </button>
                    <br/>
                    <button onClick={
                        this.handleReset
                    }>Reset</button>
                </form> 
            </div>
        )
    }

    countmines (row,col) {
        let mines = Math.ceil(row*col*0.2)
        return mines
    }

    changeRow (e) {
        e.preventDefault()
        let state = this.state
        state.row = e.target.value
        state.mines = this.countmines(
            state.row,state.col
        )
        this.setState({state})
    }

    changeCol (e) {
        e.preventDefault()
        let state = this.state
        state.col = e.target.value
        state.mines = this.countmines(
            state.row,state.col
        )
        this.setState({state})
    }

    changeMines (e) {
        e.preventDefault()
        let mines = e.target.value
        this.setState({
            mines
        })
    }

    handleSubmit (e) {
        e.preventDefault()
        let row = e.target.row.value
        let col = e.target.col.value
        let mines = e.target.mines.value
        // console.log(mines)
        this.props.newgame({row,col,mines})
    }

    handleReset (e) {
        e.preventDefault()
        // console.log("handleReset")
        this.props.reset()
    }

}

export default Menu