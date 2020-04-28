import React, { Component } from 'react'

export class Astar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ...this.defineGrid(),
            open: [],
            closed: [],
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
            const x1 = cell.column; const y1 = cell.row; const x2 = finishCell.column; const y2 = finishCell.row
            //const h = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2)) * 10
            const h = 10 * (Math.abs(x1 - x2) + Math.abs(y1 - y2))
            return h
        } catch(e) {return 99999}
    }
    fCost = cell => {
        //console.log(cell.gCost, this.hCost(cell))
        return cell.gCost + this.hCost(cell)
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

        //if(top && right) neighbors.push(grid[row-1][column+1])
        //if(top && left) neighbors.push(grid[row-1][column-1])
        //if(bottom && right) neighbors.push(grid[row+1][column+1])
        //if(bottom && left) neighbors.push(grid[row+1][column-1])

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
            window.cellRefs[cell.row][cell.column].changeType('OPEN', false)
        }
    }
    closeCell = cell => {
        let open = Object.assign([], this.state.open)
        let closed = Object.assign([], this.state.closed)
        open = open.filter(c => c !== cell)
        closed.push(cell)
        this.setState({...this.state, closed, open})
        if(cell.id !== this.state.startCell && cell.id !== this.state.finishCell) {
            window.cellRefs[cell.row][cell.column].changeType('CLOSE', false)
        }
    }
    algorithm = () => {
        let n = 0
        this.openCell(this.getCellByID(this.state.startCell))
        this.astar = setInterval(() => {
            let current = this.state.open[0]
            console.log(this.hCost(current))
            for(let i = 0; i < this.state.open.length; i++) {
                if(this.fCost(this.state.open[i]) < this.fCost(current)) {
                    current = this.state.open[i]
                } else if(this.fCost(this.state.open[i]) === this.fCost(current)) {
                    if(this.hCost(this.state.open[i]) < this.hCost(current)) {
                        current = this.state.open[i]
                    }
                }
            }
            this.closeCell(current)
            
            if(current.id === this.state.finishCell) {
                this.showPath()
                clearInterval(this.astar)
                //path found 
            }
            const neighbors = this.getNeighbors(current)
            for(let i = 0; i < neighbors.length; i++) {
                const diag = current.row !== neighbors[i].row && current.column !== neighbors[i].column ? true : false
                const plusG = diag ? 10 * Math.sqrt(2) : 10
                if(current.gCost + plusG < neighbors[i].gCost) {
                    this.setGCost(neighbors[i], current.gCost + plusG)
                    this.setPrevCell(neighbors[i], current)
                    if(this.state.open.filter(c => c === neighbors[i]).length === 0) {
                        this.openCell(neighbors[i]) 
                    }
                }
            }
            //console.log(n)
            n++
        }, 1)
    }
    showPath = () => {
        let path = []
        let current = this.getCellByID(this.state.finishCell)
        while(current.id !== this.state.startCell) {
            const prevCell = this.getCellByID(current.prevCell)
            path.push(prevCell)
            current = prevCell
        }
        path.reverse()
        console.log(path)
        
        let index = 0
        this.spAlg = setInterval(() => {
            const cell = path[index]
            if(cell.id !== this.state.startCell && cell.id !== this.state.finishCell) {
                window.cellRefs[cell.row][cell.column].changeType('PATH', false)
            }
            if(index === path.length - 1) {
                clearInterval(this.spAlg)
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