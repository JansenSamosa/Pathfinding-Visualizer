import React, { Component } from 'react'
import { Switch, Route, Redirect, Link } from 'react-router-dom'

import AstarConfig from './config/AstarConfig'
import DjisktrasConfig from './config/DjisktrasConfig'
import GreedyBFSConfig from './config/GreedyBFSConfig'
import PerlinNoiseConfig from './config/PerlinNoiseConfig'
import MazeConfig from './config/MazeConfig'

import './settings.css'

import closeIcon from '../../icons/closeicon.png'

export class Settings extends Component {
    constructor(props) {
        super(props)
        let redirectTo = ''
        let redirect = false
        if(localStorage.getItem('selectedOption') !== null) {
            redirectTo = localStorage.getItem('selectedOption')
            redirect = true
        }
        this.state = {
            redirectTo,
            redirect
        }
        console.log(redirectTo)
    }
    exitSettings = () => {
        this.setState({redirectTo: `/`, redirect: true})
    }
    setRedirect = redirectTo => {
        localStorage.setItem('selectedOption', redirectTo)
        this.setState({redirectTo: `/settings/${redirectTo}`, redirect: true})
    }
    redirect = () => {
        if(this.state.redirect) {
            this.setState({...this.state, redirect: false})
            return <Redirect to={this.state.redirectTo}/>
        }
    }
    render() {
        return (
            <div className='settings-container'>
                <div className='settings-menu'>
                    <div className='settings-menu-header'> <h1>Visualizer Settings</h1> </div>
                    <div className='settings-menu-selection'>
                        <button className='settings-menu-selection-btn' onClick={this.setRedirect.bind(this, 'astar')}> A* </button>
                        <button className='settings-menu-selection-btn' onClick={this.setRedirect.bind(this, 'djisktras')}> Djisktras </button>
                        <button className='settings-menu-selection-btn' onClick={this.setRedirect.bind(this, 'greedy')}> Greedy BFS</button>
                        <button className='settings-menu-selection-btn' onClick={this.setRedirect.bind(this, 'perlinnoise')}> Noise Map </button>
                        <button className='settings-menu-selection-btn' onClick={this.setRedirect.bind(this, 'maze')}> Maze </button>
                    </div>
                    <div className='settings-menu-config'>
                        <Switch>
                            <Route path='/settings/astar'>
                                <AstarConfig config={this.props.config} setConfig={this.props.setConfig}/>
                            </Route>
                            <Route path='/settings/djisktras'>
                                <DjisktrasConfig config={this.props.config} setConfig={this.props.setConfig}/>
                            </Route>
                            <Route path='/settings/greedy'>
                                <GreedyBFSConfig config={this.props.config} setConfig={this.props.setConfig}/>
                            </Route>
                            <Route path='/settings/perlinnoise'>
                                <PerlinNoiseConfig config={this.props.config} setConfig={this.props.setConfig}/>
                            </Route>
                            <Route path='/settings/maze'>
                                <MazeConfig />
                            </Route>
                        </Switch>
                    </div>
                    <img className='settings-close' src={closeIcon} alt='' onClick={this.exitSettings}/>
                </div>
                {this.redirect()}
            </div>
        )
    }
}

export default Settings
