import React, { Component } from 'react'

import Astar from './Astar'

export class Algorithm extends Component {
    startAlgorithm = alg => {
        if(this.props.startAlgorithm) {
            if(alg === 'a*') {
                return <Astar grid={this.props.grid} config={this.props.config} djisktras={false}/>
            }
            else if(alg === 'djisktras') {
                return <Astar grid={this.props.grid} config={this.props.config} djisktras={true}/>
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
