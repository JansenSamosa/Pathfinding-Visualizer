import React, { Component } from 'react'

import './config.css'

export class GreedyBFSConfig extends Component {
    state = {
        ...this.props.config
    }
    changeHType = hType => {
        this.setState({...this.state, astar:{...this.state.astar, hType}})
    }
    getHTypeStyle = hType => {
        if(this.state.astar.hType === hType) return 'selected'
        else return 'notselected'
    }
    setHMult = e => {
        console.log(e.target.value/100)
        this.setState({...this.state, astar:{...this.state.astar, hMultiplier: parseInt(e.target.value)/100}})
    }
    setSpeed = e => {
        let speed = 1
        if(e.target.value < 50) speed = e.target.value/50
        else if(e.target.value > 50) speed = e.target.value - 50 + 1
        this.setState({...this.state, speed})
    }
    speedToLinear = () => {
        const speed = this.state.speed
        if(speed < 1) return speed*50
        else if(speed > 1) return speed + 50 - 1
        else if(speed === 1) return 50 
    }
    updateConfig = () => {
        setTimeout(() => {
            this.props.setConfig(this.state)
        }, 100)
    }
    toggleCanDiag = e => {
        this.setState({...this.state, canDiag:e.target.checked})
    }
    render() {
        return (
            <div className='settings-menu-config-container greedy' onMouseUp={this.updateConfig}>
                <h1>Greedy Best First Search Options</h1>
                <div className='settings-menu-config-options'>

                    <label>{`Speed - ${this.state.speed}`}</label>
                    <input type='range' value={this.speedToLinear().toString()}onChange={this.setSpeed.bind(this)}/>

                    <label>Diagonal Movement</label>
                    <label className='checkbox'>
                        .
                        <input type='checkbox' checked={this.state.canDiag} onChange={this.toggleCanDiag.bind(this)} />
                        <span className='checkbox-custom' />
                    </label>
                    <label style={{position:'relative', top:'7%'}}>Hueristic Type</label>
                    <div className='settings-menu-config-container greedy htypeSelect'>
                        <button 
                            className={`${this.getHTypeStyle('manhatten')} button`}
                            onClick={this.changeHType.bind(this, 'manhatten')}>Manhatten</button>
                        <button 
                            className={`${this.getHTypeStyle('octile')} button`}
                            onClick={this.changeHType.bind(this, 'octile')}>Octile</button>
                        <button 
                            className={`${this.getHTypeStyle('euclidian')} button`}
                            onClick={this.changeHType.bind(this, 'euclidian')}>Euclidian</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default GreedyBFSConfig
