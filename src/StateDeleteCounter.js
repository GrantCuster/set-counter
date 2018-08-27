import React, { Component } from 'react'
import { stateControl } from './stateControl'

class StateDeleteCounter extends Component {
  handleClick() {
    let updated_array = this.props.update_array
      .slice(0, this.props.update_index)
      .concat(this.props.update_array.slice(this.props.update_index + 1))
    this.props.handleChange({
      [this.props.array_key]: updated_array,
    })
  }

  render() {
    return <button onClick={this.handleClick.bind(this)}>Delete</button>
  }
}

export default stateControl(StateDeleteCounter)
