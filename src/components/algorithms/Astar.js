import React, { Component } from 'react'

export class Astar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ...this.defineGrid(),
            open: [],
            closed: [],
            D: 10,
            done: false,
        }
    }
    defineGrid = (oldGrid) => {
        let startCell = null
        let finishCell = null
        let grid = []

        for(let r = 0; r < this.props.grid.length; r++) {
            grid[r] = []
            for(let c = 0; c < this.props.grid[r].length; c++) {
                const cell = this.props.grid[r][c]
                const gCost = oldGrid === undefined ? 99999 : oldGrid[r][c].gCost
                const prevCell = oldGrid === undefined ? null : oldGrid[r][c].prevCell
                grid[r][c] = {
                    ...cell,
                    gCost, //h and f are determined during the algorithm
                    prevCell
                }
                if(cell.type === 'START') {
                    grid[r][c].gCost = 0
                    startCell = grid[r][c].id
                }
                if(cell.type === 'FINISH') finishCell = grid[r][c].id
            }
        }
        return {startCell, finishCell, grid}
    }
    componentDidMount() {
        for(let r = 0; r < this.props.grid.length; r++) {
            for(let c = 0; c < this.props.grid[r].length; c++) {
                const cell = this.props.grid[r][c]
                if(cell.type === 'CLOSE' || cell.type === 'OPEN' || cell.type === 'PATH') {
                    window.cellRefs[r][c].changeType('NORMAL')
                }
            }
        }
        setTimeout(() => {
            this.setState({...this.state, ...this.defineGrid()})
            this.algorithm()
        }, 100)
    }
    componentDidUpdate(nextProps) {
        const { grid } = this.props
        if(nextProps.grid !== grid) {
            this.setState({...this.state, ...this.defineGrid(this.state.grid)})
        }
    }
    setGCost = (cell, newG) => {
        cell.gCost = newG
        let grid = Object.assign([], this.state.grid)
        grid[cell.row][cell.column] = Object.assign({}, cell)
        this.setState({...this.state, grid})
    }
    hCost = cell => {
        try {
            const finishCell = this.getCellByID(this.state.finishCell)
            const D = this.state.D
            const D2 = D * Math.sqrt(2)
            const x1 = cell.column; const y1 = cell.row; const x2 = finishCell.column; const y2 = finishCell.row
            const dx = Math.abs(x1 - x2)
            const dy = Math.abs(y1 - y2)
            //const h = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * D //EUCLIDIAN DISTANCE
            //const h = D * (dx + dy) //MANHATTAN DISTANCE
            const h = D * (dx + dy) + (D2 - 2*D) * Math.min(dx, dy) //OCTILE DISTANCE
            return h
        } catch(e) {return 99999}
    }
    fCost = cell => {
        if(this.props.config.algorithm === 'a*') return cell.gCost + this.hCost(cell)
        if(this.props.config.algorithm === 'djisktras') return cell.gCost
        if(this.props.config.algorithm === 'greedy') return this.hCost(cell)
        //console.log(cell.gCost, this.hCost(cell))
    }
    getCellByID = id => {
        id = id.replace('CELL', '')
        id = id.replace('-', ' ')
        const nums = id.split(' ')
        const cell = this.state.grid[parseInt(nums[0])][parseInt(nums[1])]
        return cell
    }
    getNeighbors = cell => {
        const grid = this.state.grid
        const closed = this.state.closed
        const config = this.props.config

        const row = cell.row
        const column = cell.column

        let neighbors = []
        const top = row === 0 ? false : true
        const bottom = row === config.rows-1 ? false : true
        const left = column === 0 ? false : true
        const right = column === config.columns-1 ? false : true
        
        if(top) neighbors.push(grid[row-1][column])
        if(bottom) neighbors.push(grid[row+1][column])
        if(left) neighbors.push(grid[row][column-1])
        if(right) neighbors.push(grid[row][column+1])
        
        if(top && right) {
            if(grid[row-1][column].type !== 'WALL' && grid[row][column+1] !== 'WALL') neighbors.push(grid[row-1][column+1])
        }
        if(top && left){
            if(grid[row-1][column].type !== 'WALL' && grid[row][column-1] !== 'WALL') neighbors.push(grid[row-1][column-1])
        } 
        if(bottom && right){
            if(grid[row+1][column].type !== 'WALL' && grid[row][column+1] !== 'WALL') neighbors.push(grid[row+1][column+1])
        } 
        if(bottom && left){
            if(grid[row+1][column].type !== 'WALL' && grid[row][column-1] !== 'WALL') neighbors.push(grid[row+1][column-1])
        } 
        
        neighbors = neighbors.filter(n => n.type !== 'WALL')
        
        for(let i = 0; i< closed.length; i++) {
            neighbors = neighbors.filter(n => n.id !== closed[i].id)
        }

        return neighbors
    }
    setPrevCell = (cell, prevCell) => {
        let grid = Object.assign([], this.state.grid)
        grid[cell.row][cell.column] = Object.assign({}, grid[cell.row][cell.column], {prevCell: prevCell.id})
        this.setState({...this.state, grid})
    }
    openCell = cell => {
        let open = Object.assign([], this.state.open)
        open.push(cell)
        this.setState({...this.state, open})
        if(cell.id !== this.state.startCell && cell.id !== this.state.finishCell) {
            window.cellRefs[cell.row][cell.column].changeType('OPEN')
        }
    }
    closeCell = cell => {
        let open = Object.assign([], this.state.open)
        let closed = Object.assign([], this.state.closed)
        closed.push(cell)
        open = open.filter(c => c.id !== cell.id)
        if(cell.id !== this.state.startCell && cell.id !== this.state.finishCell) {
            window.cellRefs[cell.row][cell.column].changeType('CLOSE')
        }
        this.setState({...this.state, closed, open})
    }
    algorithm = () => {
        window.lock = true
        const startDate = new Date()
        const startTime = startDate.getTime()
        this.openCell(this.getCellByID(this.state.startCell))
        const speed = this.props.config.overdrive < 1 ? (1 - this.props.config.overdrive) * 100 : 1
        console.log(speed)
        this.astar = setInterval(() => {
            for(let j = 0; j < this.props.config.overdrive; j++) {
                let current = this.getCellByID(this.state.open[0].id)
                for(let i = 0; i < this.state.open.length; i++) {
                    const cell = this.getCellByID(this.state.open[i].id)
                    if(this.fCost(cell) < this.fCost(current)) {
                        current = cell
                    } else if(this.fCost(cell) === this.fCost(current)) {
                        if(this.hCost(cell) < this.hCost(current)) {
                            current = cell
                        }
                    }
                }
                
                this.closeCell(current)
                
 
                if(current.id === this.state.finishCell) {
                    this.setState({...this.state, done: true})
                    this.showPath()
                    const finishDate = new Date()
                    window.stats.timeElapsed = (finishDate.getTime() - startTime)/1000
                    window.updateApp()
                    clearInterval(this.astar)
                    //path found 
                }
                const neighbors = this.getNeighbors(current)
                for(let i = 0; i < neighbors.length; i++) {
                    const diag = current.row !== neighbors[i].row && current.column !== neighbors[i].column ? true : false
                    const plusG = diag ? this.state.D * Math.sqrt(2) : this.state.D
                    if(current.gCost + plusG < neighbors[i].gCost) {
                        this.setGCost(neighbors[i], current.gCost + plusG)
                        this.setPrevCell(neighbors[i], current)
                        //console.log(this.state.open.forEach(c => console.log(c)))
                        if(this.state.open.filter(c => c.id === neighbors[i].id).length === 0) {
                            this.openCell(neighbors[i]) 
                        } 
                    }
                }
                if(this.state.open.length === 0) {
                    const finishDate = new Date()
                    window.stats.timeElapsed = (finishDate.getTime() - startTime)/1000
                    window.lock = false
                    window.updateApp()
                    clearInterval(this.astar)
                }
            }
        }, speed)
    }
    showPath = () => {
        let path = []
        let current = this.getCellByID(this.state.finishCell)
        window.stats.pathLength = current.gCost
        window.updateApp()
        while(current.id !== this.state.startCell) {
            const prevCell = this.getCellByID(current.prevCell)
            path.push(prevCell)
            current = prevCell
        }
        path.reverse()
        
        let index = 0
        this.spAlg = setInterval(() => {
            const cell = path[index]
            if(cell.id !== this.state.startCell && cell.id !== this.state.finishCell) {
                window.cellRefs[cell.row][cell.column].changeType('PATH')
            }
            if(index === path.length - 1) {
                clearInterval(this.spAlg)
                window.lock = false
            }
            index++
        }, 20)
    }
    componentWillUnmount() {
        clearInterval(this.spAlg)
        clearInterval(this.astar)
    }
    render() {
        return <div></div>
    } 
}

export default Astar
