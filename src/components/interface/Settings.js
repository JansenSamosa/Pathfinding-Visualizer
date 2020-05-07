import React, { Component } from 'react'
import { Switch, Route, Redirect, Link } from 'react-router-dom'

import './settings.css'

import closeIcon from '../../icons/closeicon.png'

export class Settings extends Component {
    state = {
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
    render() {
        return (
            <div className='settings-container'>
                <div className='settings-menu'>
                    <div className='settings-menu-header'> <h1>Visualizer Settings</h1> </div>
                    <div className='settings-menu-selection'>
                        <button className='settings-menu-selection-btn' onClick={this.setRedirect.bind(this, '/settings/astar')}> A* </button>
                        <button className='settings-menu-selection-btn' onClick={this.setRedirect.bind(this, '/settings/djisktras')}> Djisktras </button>
                        <button className='settings-menu-selection-btn' onClick={this.setRedirect.bind(this, '/settings/greedy')}> Greedy BFS</button>
                        <button className='settings-menu-selection-btn' onClick={this.setRedirect.bind(this, '/settings/perlinnoise')}> Noise Map </button>
                        <button className='settings-menu-selection-btn' onClick={this.setRedirect.bind(this, '/settings/maze')}> Maze </button>
                    </div>
                    <div className='settings-menu-options'>
                        <Switch>
                            <Route path='/settings/astar'>
                            </Route>
                            <Route path='/settings/djisktras'>
                            </Route>
                            <Route path='/settings/greedy'>
                            </Route>
                            <Route path='/settings/perlinnoise'>
                            </Route>
                            <Route path='/settings/maze'>
                            </Route>
                        </Switch>
                    </div>
                    <img className='settings-close' src={closeIcon} alt='' onClick={this.setRedirect.bind(this, '/')}/>
                </div>
                {this.redirect()}
            </div>
        )
    }
}

export default Settings
