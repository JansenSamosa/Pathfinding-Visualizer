import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import './interface.css'

export class Interface extends Component {
    state = {
        show: true,
        redirectTo: '',
        redirect: false
    }
    setRedirect = redirectTo => {
        this.setState({redirectTo, redirect: true})
    }
    redirect = () => {
        if(this.state.redirect) {
            this.setState({...this.state, redirect: false})
            return <Redirect to={this.state.redirectTo}/>
        }
    }
    getShow = (show) => {
        if(show) return 'Show'
        else return 'Hide'
    }
    showHideUI = () => {
        this.setState({...this.state, show: !this.state.show})
    }
    render() {
        return (
            <div className={`interface ${this.getShow(this.state.show)}`}>
                <div className='interface-header'>
                    <h1>Pathfinding Visualizer</h1>
                    <div className='interface-btns' >          
                        <button className={`interface-btn pathfinding Greedy button`} onClick={this.props.runAlgorithm.bind(this, 'Greedy')}> Visualize Greedy BFS</button>
                        <button className={`interface-btn pathfinding Djisktras button`} onClick={this.props.runAlgorithm.bind(this, 'Djisktras')}>Visualize Djisktras</button>
                        <button className={`interface-btn pathfinding AStar button`} onClick={this.props.runAlgorithm.bind(this, 'A*')}> Visualize A*</button>
                        <button className={`interface-btn generator button`} onClick={this.props.generateMap.bind(this, 'maze')}> Generate Maze</button>    
                        <button className={`interface-btn generator button`} onClick={this.props.generateMap.bind(this, 'perlin')}> Generate Noise Map</button>
                        <button className={`interface-btn generator button`} onClick={this.props.clearGrid}> Clear Grid</button> 
                    </div>
                </div>
                <div className='interface-stats'>
                    <p>{`Path Length: ${window.stats.pathLength.toString().substring(0,6)}`}</p>
                    <p>{`Time Elapsed: ${window.stats.timeElapsed.toString().substring(0,4)}s`}</p>
                </div>
                <button className='interface-hideuibtn' onClick={this.showHideUI}>{`${this.getShow(!this.state.show)} UI`}</button>
                <button className='interface-settingsbtn' onClick={this.setRedirect.bind(this, '/settings/astar')}>Settings</button>
                {this.redirect()}
            </div>
        )
    }
}

export default Interface
