import React, { Component } from 'react'
import { stateControl } from './stateControl'

class StateAddSubCounter extends Component {
  handleClick() {
    let updated_array = this.props.array.slice()
    updated_array[this.props.update_index].sc = 10
    this.props.handleChange({
      [this.props.array_key]: updated_array,
    })
  }

  render() {
    return <button onClick={this.handleClick.bind(this)}>Add subcounter</button>
  }
}

export default stateControl(StateAddSubCounter)
