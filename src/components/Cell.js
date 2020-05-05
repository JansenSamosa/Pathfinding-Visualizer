import React, { Component } from 'react'

export class Cell extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cell: this.props.cell,
        }
    }
    componentDidMount() {
        const rows = this.props.config.rows
        const columns = this.props.config.columns
        const cell = this.state.cell
        //if(this.state.cell.id === `CELL${Math.floor(rows/2)}-0`) this.setState({...this.state, cell: {...cell, type: 'START'}})
        //if(this.state.cell.id === `CELL${Math.floor(rows/2)}-${columns-1}`) this.setState({...this.state, cell: {...cell, type: 'FINISH'}})
        if(this.state.cell.id === this.props.startCell) this.setState({...this.state, cell: {...cell, type: 'START'}})
        if(this.state.cell.id === this.props.finishCell) this.setState({...this.state, cell: {...cell, type: 'FINISH'}})
    }
    shouldComponentUpdate(nextProps, nextState) {
        if(this.state !== nextState) return true
        else return false
    }
    componentDidUpdate() {
        const cell = this.state.cell
        this.props.updateCell(cell.row, cell.column, cell)
    }
    changeType = (type) => {
        const cell = this.state.cell
        if(type === 'WALL') {
            if(cell.type === 'START' || cell.type === 'FINISH') return null
        }
        this.setState({...this.state, cell: {...cell, type}})
    }
    draw = () => {
        if(this.state.cell.type === 'WALL') {
            if(window.drawType === 'START' || window.drawType === 'FINISH') return null
        }
        if(window.mousehold && this.state.cell.type !== 'START' && this.state.cell.type !== 'FINISH') {
            const cell = this.state.cell
            this.setState({...this.state, cell: {...cell, type: window.drawType}})
        }
    }
    mouseDown = (e) => {
        if(!window.lock) {
            e.preventDefault()
            const cellType = this.state.cell.type
            if(cellType === 'WALL') {
                window.drawType='NORMAL'
                this.changeType('NORMAL')
            }else if(cellType === 'START') {
                window.drawType='START'
            }else if(cellType === 'FINISH') {
                window.drawType='FINISH'
            }else {
                window.drawType='WALL'
                this.changeType('WALL')
            }
            this.draw()
        }
    }
    render() {
        return (
            <div 
                className={`grid-cell ${this.state.cell.type}`} 
                onMouseEnter={this.draw}
                onMouseDown={e => this.mouseDown(e)}
            >
                <div className='grid-cell-background'></div>
            </div>
        )
    }
}

export default Cell
