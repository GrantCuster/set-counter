import React, { Component } from 'react'
import { stateControl } from './stateControl'

class StateAddCounter extends Component {
  handleClick() {
    let updated_array = this.props.array.slice()
    updated_array.push({ to: 10 })
    this.props.handleChange({
      [this.props.array_key]: updated_array,
    })
  }

  render() {
    return <button onClick={this.handleClick.bind(this)}>Add counter</button>
  }
}

export default stateControl(StateAddCounter)
