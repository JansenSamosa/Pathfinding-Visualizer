import React, { Component } from 'react'
import tumult from 'tumult'

import Cell from './components/Cell'
import Algorithm from './components/algorithms/Algorithm'

import './App.css'
import './grid.css'

export class App extends Component {
    constructor(props) {
        super(props)

        const rows = Math.floor(window.innerHeight/25 - (window.innerHeight/25*2)/25)
        const columns = Math.floor(window.innerWidth/25 - (window.innerWidth/25*2)/25)
        console.log(window.innerWidth/25)
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
                algorithm: 'a*',
                overdrive: 1,
                perlinDensity: 1,
                perlinThresh: .22
            },
            grid,
            startCell: `CELL${Math.floor(rows/2)}-0`,
            finishCell: `CELL${Math.floor(rows/2)}-${columns-1}`,
            startAlgorithm: false,
        }
        window.updateApp = this.forceUpdate.bind(this)
        window.drawType = 'NORMAL'
        window.stats = {
            pathLength: 0,
            timeElapsed: 0
        }
    }
    componentDidMount() {
        document.addEventListener('keydown', this.handKeyEvents.bind(this))
        document.addEventListener('mousedown', this.handleMouseEvents.bind(this))
        document.addEventListener('mouseup', this.handleMouseEvents.bind(this))
    }
    handKeyEvents = e => {
        if(e.key === 'n') this.perlinNoiseMap()
        if(e.key === 'p') {
            this.resetAlgorithm()
        }
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
    perlinNoiseMap = () => {
        this.stopAlgorithm()
        const perlin = new tumult.PerlinN()
        for(let r = 0; r < this.state.config.rows; r++) {
            for(let c = 0; c < this.state.config.columns; c++) {
                if(this.state.grid[r][c].type !== 'START' && this.state.grid[r][c].type !== 'FINISH') {
                    const val = Math.abs(perlin.gen(c/10*this.state.config.perlinDensity, r/10*this.state.config.perlinDensity))
                    if(this.state.grid[r][c].type === 'WALL') window.cellRefs[r][c].changeType('NORMAL')
                    if(val > this.state.config.perlinThresh) {
                        window.cellRefs[r][c].changeType('WALL')
                    }
                }
            }
        }
    }
    resetAlgorithm = () => {
        this.setState({...this.state, startAlgorithm: false}, () => {
            this.setState({...this.state, startAlgorithm: true})
        })
    }
    stopAlgorithm = () => {
        this.setState({...this.state, startAlgorithm: false})
    }
    updateCell = (r, c, newCell) => {
        let newGrid = Object.assign([], this.state.grid)
        let startCell = this.state.startCell
        let finishCell = this.state.finishCell

        newGrid[r][c] = newCell

        if(newCell.type === 'START' && newCell.id !== startCell) {
            const indices = startCell.replace('CELL', '').replace('-', ' ').split(' ')
            window.cellRefs[indices[0]][indices[1]].changeType('NORMAL')
            startCell = newCell.id
        }
        if(newCell.type === 'FINISH' && newCell.id !== finishCell) {
            const indices = finishCell.replace('CELL', '').replace('-', ' ').split(' ')
            window.cellRefs[indices[0]][indices[1]].changeType('NORMAL')
            finishCell = newCell.id
        }
        this.setState({...this.state, grid: newGrid, startCell, finishCell})
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
                                changeDrawWallType={this.changeDrawWallType}
                                config={this.state.config}
                                startCell={this.state.startCell}
                                finishCell={this.state.finishCell}
                                />
                        )
                    })}
                </div>
            )
        })
    }
    render() {
        return (
            <div className='app'>
                <div style={{position:'fixed', zIndex: 5}}>
                    <input type='text' value={this.state.config.algorithm} onChange={e => this.setState({...this.state, config: {...this.state.config, algorithm: e.target.value}})}/>
                    <input type='number' value={this.state.config.overdrive} onChange={e => this.setState({...this.state, config: {...this.state.config, overdrive: e.target.value}})}/>
                    <input type='number' value={this.state.config.perlinDensity} onChange={e => this.setState({...this.state, config: {...this.state.config, perlinDensity: e.target.value}})}/>
                    <input type='number' value={this.state.config.perlinThresh} onChange={e => this.setState({...this.state, config: {...this.state.config, perlinThresh: e.target.value}})}/>
                    <p style={{float:'right', position:'relative', left:'20px'}}>Timer: {` ${window.stats.timeElapsed}s`}</p>
                    <p style={{float:'right'}}>Path Length: {` ${window.stats.pathLength}`}</p>
                </div>
                <div className='grid' style={{width: `${this.state.config.columns * 25 + (this.state.config.columns * 2 * 1)}px`}}>
                    {this.renderGrid()}
                </div>
                <Algorithm grid={this.state.grid} config={this.state.config} startAlgorithm={this.state.startAlgorithm}/>
                
            </div>
        )
    }
}

export default App
