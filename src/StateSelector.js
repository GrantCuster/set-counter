import React, { Component } from 'react'
import { stateControl } from './stateControl'

class StateSelector extends Component {
  handleChange(e) {
    this.props.handleChange({ [this.props.state_key]: e.target.value })
  }

  render() {
    return (
      <select onChange={this.handleChange.bind(this)} value={this.props.value}>
        {this.props.options.map(o => {
          return <option value={o.value}>{o.label}</option>
        })}
      </select>
    )
  }
}

export default stateControl(StateSelector)
