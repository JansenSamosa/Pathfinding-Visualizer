import React, { Component } from 'react'

import Cell from './components/Cell'
import Algorithm from './components/algorithms/Algorithm'
import Generator from './components/generators/Generator'
import Interface from './components/interface/Interface'

import './css/App.css'
import './css/grid.css'

export class App extends Component {
    constructor(props) {
        super(props)

        let rows = Math.floor(window.innerHeight/25 - (window.innerHeight/25*2)/25)
        let columns = Math.floor(window.innerWidth/25 - (window.innerWidth/25*2)/25)
        console.log(rows, columns)
        if(rows%2 === 0) rows++
        if(columns%2 === 0) columns++
        console.log(rows, columns)
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
                overdrive: 1,
                perlinDensity: 1,
                perlinThresh: .22
            },
            grid,
            startCell: `CELL${Math.floor(rows/2)}-1`,
            finishCell: `CELL${Math.floor(rows/2)}-${columns-2}`,
            startAlgorithm: false,
        }
        this.genRef = React.createRef()
        window.updateApp = this.forceUpdate.bind(this)
        window.algorithm = 'A*'
        window.drawType = 'NORMAL'
        window.stats = {
            pathLength: 0,
            timeElapsed: 0
        }
        window.lock = false
        window.mousehold = false
    }
    componentDidMount() {
        document.addEventListener('keydown', this.handKeyEvents.bind(this))
        document.addEventListener('mousedown', this.handleMouseEvents.bind(this))
        document.addEventListener('mouseup', this.handleMouseEvents.bind(this))
        document.addEventListener('touchstart', this.handleMouseEvents.bind(this))
        document.addEventListener('touchend', this.handleMouseEvents.bind(this))
    }
    handKeyEvents = e => {
        if(e.key === 'c') this.clearGrid()
        if(!window.lock) {
            if(e.key === 'p') this.resetAlgorithm()
            if(e.key === 'n') this.generateMap('perlin')
            if(e.key === 'm') this.generateMap('maze')
        }  
    }
    handleMouseEvents = e => {
        if(!window.lock) {
            if(e.type === 'mousedown' || e.type === 'touchstart') {window.mousehold = true; this.forceUpdate()}
            if(e.type === 'mouseup' || e.type === 'touchend') {window.mousehold = false; this.forceUpdate()}
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.grid !== nextState.grid) return false
        else if(this.state.config !== nextState.config) return true
        else return true
    }
    componentDidUpdate() {
        console.log("HI")
    }
    setConfig = newConfig => {
        this.setState({...this.state, config: newConfig})
    }
    generateMap = mapType => {
        if(!window.lock) {
            this.stopAlgorithm()
            this.clearGrid()
            window.lock = true
            if(mapType === 'perlin') this.genRef.current.genPerlinNoise()
            if(mapType === 'maze') this.genRef.current.genRecursiveBacktrackerMaze()
        }
    }
    runAlgorithm = (algorithm) => {
        if(!window.lock) {
            window.lock = false
            window.algorithm = algorithm
            console.log(window.algorithm)
            this.setState({...this.state, startAlgorithm: false}, () => {
                this.setState({...this.state, startAlgorithm: true})
            })
        }
    }
    stopAlgorithm = () => {
        window.lock = false
        this.setState({...this.state, startAlgorithm: false})
    }
    clearGrid = () => {
        window.lock = false
        this.stopAlgorithm()
        for(let r = 0; r < this.state.grid.length; r++) {
            for(let c = 0; c < this.state.grid[r].length; c++) {
                const cell = this.state.grid[r][c]
                if(cell.type === 'WALL' || cell.type === 'PATH' 
                    || cell.type === 'OPEN' || cell.type === 'CLOSE') window.cellRefs[r][c].changeType('NORMAL')
            }
        }
    }
    updateCell = (r, c, newCell) => {
        console.log("ASD")
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
    renderInterface = () => {
        if(!window.lock && !window.mousehold) {
            return <Interface 
                        config={this.state.config} 
                        setConfig={this.setConfig}
                        runAlgorithm={this.runAlgorithm}
                        generateMap={this.generateMap}
                        clearGrid={this.clearGrid}
                    />
        }
    }
    render() {
        return (
            <div className='app'>
                <div className='grid' style={{width: `${this.state.config.columns * 25 + (this.state.config.columns * 2 * 1)}px`}}>
                    {this.renderGrid()}
                </div>
                <Algorithm grid={this.state.grid} config={this.state.config} startAlgorithm={this.state.startAlgorithm}/>
                <Generator grid={this.state.grid} config={this.state.config} ref={this.genRef}/>
                {this.renderInterface()}
            </div>
        )
    }
}

export default App
