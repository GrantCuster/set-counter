import React, { Component } from 'react'
import { stateControl } from './stateControl'

class StateCheckbox extends Component {
  handleClick(e) {
    console.log(e.target.checked)
    if (!e.target.checked) {
      this.props.deleteProperty(this.props.state_key)
    } else {
      this.props.handleChange({ [this.props.state_key]: 'y' })
    }
  }

  render() {
    return (
      <span>
        <label style={{ userSelect: 'none' }}>
          <input
            onChange={this.handleClick.bind(this)}
            type="checkbox"
            id={this.props.state_key}
            name={this.props.state_key}
            checked={!!this.props.value}
          />{' '}
          {this.props.label}
        </label>
      </span>
    )
  }
}

export default stateControl(StateCheckbox)
