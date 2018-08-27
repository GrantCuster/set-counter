import React, { Component } from 'react'
import { stateControl } from './stateControl'

class StateRange extends Component {
  render() {
    let me = this
    return (
      <span>
        <input
          type="range"
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
          value={this.props.value}
          onChange={e => {
            me.props.handleChange({ [me.props.prop_key]: e.target.value })
          }}
        />{' '}
        {this.props.value}
      </span>
    )
  }
}

export default stateControl(StateRange)
