import React, { Component } from 'react'

import './interface.css'

export class Interface extends Component {


    render() {
        return (
            <div className='interface'>
                <button className='interface-pathfindbtn button' onClick={this.props.resetAlgorithm}> Pathfind A*! </button>
            </div>
        )
    }
}

export default Interface
