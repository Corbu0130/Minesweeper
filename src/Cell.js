import { Component } from "react";

class Cell extends Component {

    constructor (props) {
        super()

        this.handleClick = this.handleClick
        .bind(this) 
        this.handleRClick = this.handleRClick
        .bind(this)
        this.handleDBClick = this.handleDBClick
        .bind(this)
    }

    render () {
        let {status,value,gameover} = this.props
        let style = {}
        let text = null
        // console.log(status)
        if (status==="open") {
            style.backgroundColor = "white"
            if (value<0) {
                text = "X"
            }
            if (value>0) {
                text = value
            }
            if (gameover && value<0) {
                style.backgroundColor = "red"
            }
        }
        if (status==="flag") {
            text = "🚩"
            if (gameover && value>0) {
                style.backgroundColor = "gray"
            }
        }

        return (
            <button 
                className="Cell"
                style={style}
                onClick={this.handleClick}
                onContextMenu={this.handleRClick}
                onDoubleClick={this.handleDBClick}
                disabled={gameover}
            >
                {text}
            </button>
        )
    }

    handleClick (e) {
        e.preventDefault()
        let {
            status,posr,posc,
            openCell
        } = this.props
        // console.log([posr,posc])
        if (status==="close") {
            openCell([[posr,posc]])
        }
    }

    handleRClick (e) {
        e.preventDefault()
        let {posr,posc,flagCell} = this.props
        flagCell(posr,posc)
    }

    handleDBClick (e) {
        e.preventDefault()
        let {
            status,posr,posc,
            openCells
        } = this.props
        // console.log([posr,posc])
        if (status==="open") {
            // console.log("open cells")
            openCells(posr,posc)
        }
    }

}

export default Cell