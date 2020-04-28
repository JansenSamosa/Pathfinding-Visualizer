import React, { Component } from 'react'

import Cell from './components/Cell'
import Algorithm from './components/algorithms/Algorithm'

import './App.css'
import './grid.css'

export class App extends Component {
    constructor(props) {
        super(props)

        const rows = 30
        const columns = 70  

        let grid = []
        window.cellRefs = []
        for(let r = 0; r < rows; r++) {
            grid[r] = []
            for(let c = 0; c < columns; c++) {
                grid[r][c] = {
                    id: `CELL${r}-${c}`,
                    row: r,
                    column: c,
                    type: 'NORMAL'
                }
            }
        }

        this.state = {
            config: {
                rows,
                columns,
                mousehold: false,
                drawType: 'WALL',
                algorithm: 'a',
                overdrive: 1
            },
            grid,
            startAlgorithm: true,
        }
    }
    componentDidMount() {
        document.addEventListener('mousedown', this.handleMouseEvents.bind(this))
        document.addEventListener('mouseup', this.handleMouseEvents.bind(this))
    }
    handleMouseEvents = e => {
        if(e.type === 'mousedown') this.setState({...this.state, config: {...this.state.config, mousehold: true}})
        if(e.type === 'mouseup') this.setState({...this.state, config: {...this.state.config, mousehold: false}})
    }
    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.grid !== nextState.grid) return false
        else if(this.state.config !== nextState.config) return true
        else return true
    }
    componentDidUpdate() {
        console.log(this.state)
    }
    updateCell = (r, c, newCell) => {
        let newGrid = Object.assign([], this.state.grid)
        newGrid[r][c] = []
        newGrid[r][c] = newCell
        this.setState({...this.state, grid: newGrid})
    }
    renderGrid = () => {
        return this.state.grid.map((row, index1) => {
            window.cellRefs[index1] = []
            return ( 
                <div style={{clear:'both'}} key={`row${index1}`}>
                    {row.map((cell, index2) =>{ 
                        return (
                            <Cell 
                                ref={Cell => window.cellRefs[index1][index2] = Cell}
                                key={cell.id} 
                                cell={cell} 
                                updateCell={this.updateCell} 
                                config={this.state.config}/>
                        )
                    })}
                </div>
            )
        })
    }
    render() {
        return (
            <div className='app'>
                <input type='text' value={this.state.config.drawType} onChange={e => this.setState({...this.state, config: {...this.state.config, drawType: e.target.value}})}/>
                <input type='text' value={this.state.config.algorithm} onChange={e => this.setState({...this.state, config: {...this.state.config, algorithm: e.target.value}})}/>
                <input type='number' value={this.state.config.overdrive} onChange={e => this.setState({...this.state, config: {...this.state.config, overdrive: e.target.value}})}/>
                <div className='grid' style={{width: `${this.state.config.columns * 25 + (this.state.config.columns * 2 * 1)}px`}}>
                    {this.renderGrid()}
                </div>
                <Algorithm grid={this.state.grid} config={this.state.config} startAlgorithm={this.state.startAlgorithm}/>
                
            </div>
        )
    }
}

export default App
