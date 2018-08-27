import React, { Component } from 'react'
import { stateControl } from './stateControl'

class StateDeleteSubCounter extends Component {
  handleClick() {
    let updated_array = this.props.array.slice()
    delete updated_array[this.props.update_index].sc
    this.props.handleChange({
      [this.props.array_key]: updated_array,
    })
  }

  render() {
    return (
      <button onClick={this.handleClick.bind(this)}>Delete subcounter</button>
    )
  }
}

export default stateControl(StateDeleteSubCounter)
