import React, { Component } from 'react'

import Astar from './Astar'

export class Algorithm extends Component {
    shouldComponentUpdate() {
        if(window.lock) return false //if locked, dont pass new props
        else return true
    }
    startAlgorithm = alg => {
        if(this.props.startAlgorithm) {
            if(alg === 'a*' || alg === 'djisktras' || alg === 'greedy') {
                return <Astar grid={this.props.grid} config={this.props.config}/>
            }
        } else return null
    }
    render() {
        return (
            <div>
                {this.startAlgorithm(this.props.config.algorithm)}
            </div>
        )
    }
}

export default Algorithm
