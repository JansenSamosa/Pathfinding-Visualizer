import React, { Component } from 'react'

import './config.css'

export class DjisktrasConfig extends Component {
    state = {
        ...this.props.config
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
            <div className='settings-menu-config-container djisktras' onMouseUp={this.updateConfig}>
                <h1>Djisktras Options</h1>
                <div className='settings-menu-config-options'>

                    <label>{`Speed - ${this.state.speed}`}</label>
                    <input type='range' value={this.speedToLinear().toString()}onChange={this.setSpeed.bind(this)}/>

                    <label>Diagonal Movement</label>
                    <label className='checkbox'>
                        .
                        <input type='checkbox' checked={this.state.canDiag} onChange={this.toggleCanDiag.bind(this)} />
                        <span className='checkbox-custom' />
                    </label>
                </div>
            </div>
        )
    }
}

export default DjisktrasConfig
