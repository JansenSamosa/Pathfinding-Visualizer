import React, { Component } from 'react'
import tumult from 'tumult'

export class Generator extends Component {

    // PERLIN NOISE
    genPerlinNoise = () => {
        const { config, grid } = this.props
        const perlin = new tumult.PerlinN()
        for(let r = 0; r < config.rows; r++) {
            for(let c = 0; c < config.columns; c++) {
                if(grid[r][c].type !== 'START' && grid[r][c].type !== 'FINISH') {
                    const val = Math.abs(perlin.gen(c/10*config.perlinDensity, r/10*config.perlinDensity))
                    if(grid[r][c].type === 'WALL') window.cellRefs[r][c].changeType('NORMAL')
                    if(val > config.perlinThresh) {
                        window.cellRefs[r][c].changeType('WALL')
                    }
                }
            }
        }
    }
    // RECURSIVE BACKTRACKER MAZE
    initializeMaze = () => {
        const { config, grid } = this.props
        let mazeGrid = []

        let mazeRow = 0
        let mazeColumn = 0
        for(let r = 0; r < config.rows; r++) {
            if(r%2 !== 0) {
                mazeGrid[mazeRow] = []
                for(let c = 0; c < config.columns; c++) {
                    if(c%2 !== 0) {
                        mazeGrid[mazeRow].push({
                            mazeRow, mazeColumn, //the cells row and column in the maze
                            status:'UNVISITED', //other status' are 'VISITED' and 'INSTACK'
                            ...grid[r][c],
                        })
                        mazeColumn++
                    }
                    else window.cellRefs[r][c].changeType('WALL')
                }
                mazeRow++
                mazeColumn = 0
            } else {
                for(let c = 0; c < config.columns; c++) {
                    window.cellRefs[r][c].changeType('WALL')
                }
            }
        }
        return mazeGrid
    }
    getMazeNeighbors = (cell, mazeGrid) => {
        const {mazeRow, mazeColumn} = cell
        const mazeRows = mazeGrid.length
        const mazeColumns = mazeGrid[0].length
        let neighbors = []
        //console.log(cell, mazeGrid)

        const top = mazeRow - 1 >= 0 ? true : false
        const bottom = mazeRow + 1 <= mazeRows - 1 ? true : false
        const left = mazeColumn - 1 >= 0 ? true : false
        const right = mazeColumn + 1 <= mazeColumns - 1 ? true : false
        
        if(top) neighbors.push(mazeGrid[mazeRow-1][mazeColumn])
        if(bottom) neighbors.push(mazeGrid[mazeRow+1][mazeColumn])
        if(left) neighbors.push(mazeGrid[mazeRow][mazeColumn-1])
        if(right) neighbors.push(mazeGrid[mazeRow][mazeColumn+1])
        
        if(neighbors.length > 0) neighbors = neighbors.filter(c => c.status === 'UNVISITED')
        console.log(neighbors)
        return neighbors
    }
    openMazeWall = (fromCell, toCell) => {
        const row = (fromCell.row + toCell.row)/2
        const column = (fromCell.column + toCell.column)/2
        window.cellRefs[row][column].changeType('NORMAL')  
    }
    genRecursiveBacktrackerMaze = () => {
        let mazeGrid = this.initializeMaze()
        let stack = [mazeGrid[0][0]]
        let visited = []
        console.log(mazeGrid)
        let num = 0
        this.mazeAlg = setInterval(() => { 
            const current = stack[stack.length-1] //gets last cell in stack
            const neighbors = this.getMazeNeighbors(current, mazeGrid)
            //window.cellRefs[current.row][current.column].changeType('WALL')

            if(neighbors.length !== 0) {
                const randNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)]
                stack.push(randNeighbor)
                mazeGrid[current.mazeRow][current.mazeColumn].status = 'INSTACK'
                this.openMazeWall(current, randNeighbor)
            } else {
                stack.pop()
                visited.push(current)
                mazeGrid[current.mazeRow][current.mazeColumn].status = 'VISITED'
            }
            //if(num === 100) clearInterval(this.mazeAlg)
            console.log(num)
            num++
            if(stack.length === 0) clearInterval(this.mazeAlg)
        }, 1)
    }
    render() {
        return (
            <div>
                
            </div>
        )
    }
}

export default Generator
