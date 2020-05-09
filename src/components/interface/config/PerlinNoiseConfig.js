import React, { Component } from 'react'

import './config.css'

export class PerlinNoiseConfig extends Component {
    state = {
        ...this.props.config
    }
    
    updateConfig = () => {
        setTimeout(() => {
            this.props.setConfig(this.state)
        }, 100)
    }
    
    setDensity = e => {
        this.setState({...this.state, perlinNoise:{...this.state.perlinNoise, density: e.target.value/40}})
    }
    setThresh = e => {
        this.setState({...this.state, perlinNoise:{...this.state.perlinNoise, threshhold: e.target.value/200}})
    }
    render() {
        return (
            <div className='settings-menu-config-container perlinNoise' onMouseUp={this.updateConfig}>
                <h1>Perlin Noise Map Options</h1>
                <div className='settings-menu-config-options'>

                    <label>{`Noise Density - ${this.state.perlinNoise.density}`}</label>
                    <input type='range' value={this.state.perlinNoise.density * 40}onChange={this.setDensity.bind(this)}/>

                    <label>{`Generation Threshhold - ${this.state.perlinNoise.threshhold}`}</label>
                    <input type='range' value={this.state.perlinNoise.threshhold * 200}onChange={this.setThresh.bind(this)}/>

                    <p style={{position:'absolute', bottom:'10%'}}>Note: A higher noise density will generally need a higher generation threshhold and vice-versa</p>
                </div>
            </div>
        )
    }
}

export default PerlinNoiseConfig
