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
        if(this.state.cell.id === `CELL${Math.floor(rows/2)}-0`) this.setState({...this.state, cell: {...cell, type: 'START'}})
        if(this.state.cell.id === `CELL${Math.floor(rows/2)}-${columns-1}`) this.setState({...this.state, cell: {...cell, type: 'FINISH'}})
        //if(this.state.cell.id === `CELL${0}-0`) this.setState({...this.state, cell: {...cell, type: 'START'}})
        //if(this.state.cell.id === `CELL${rows-1}-${columns-1}`) this.setState({...this.state, cell: {...cell, type: 'FINISH'}})
    }
    shouldComponentUpdate(nextProps, nextState) {
        if(this.state !== nextState) return true
        if(this.props.config.drawType !== nextProps.config.drawType) return true
        else return false
    }
    componentDidUpdate() {
        const cell = this.state.cell
        //console.log(cell.id)
        this.props.updateCell(cell.row, cell.column, cell)
    }
    changeType = (type, downReq) => {
        if(downReq){
            if(this.props.config.mousehold) {
                //console.log(this.props.config.drawType)
                const cell = this.state.cell
                this.setState({...this.state, cell: {...cell, type}})
            }
        } else {
            //console.log(this.props.config.drawType)
                const cell = this.state.cell
                this.setState({...this.state, cell: {...cell, type}})
        }
    }
    mouseDown = (e, type) => {
        e.preventDefault()
        const cell = this.state.cell
        this.setState({...this.state, cell: {...cell, type}})
    }
    render() {
        return (
            <div 
                className={`grid-cell ${this.state.cell.type}`} 
                onMouseOver={this.changeType.bind(this, this.props.config.drawType, true)}
                onMouseLeave={this.changeType.bind(this, this.props.config.drawType, true)}
                onMouseDown={e => this.mouseDown(e, this.props.config.drawType)}
            >
                <div className='grid-cell-background'></div>
            </div>
        )
    }
}

export default Cell
