import React, { Component } from 'react';
import debounce from 'lodash/debounce';

export default function debouncedInput(WrappedComponent, config = { timeout: 400 }) {
  return class DebouncedTextField extends Component {
    constructor(props) {
      super(props);
      this.state = {
        name: this.props.name,
        value: this.props.value,
        type: this.props.type,
        checked: this.props.checked,
      };
      this.sendTextChange = debounce(this.sendTextChange, config.timeout);
    }

    handleTextChange = (e) => {
      this.setState({
        name: e.target.name,
        value: e.target.value,
        type: e.target.type,
        checked: e.target.checked,
      });
      this.sendTextChange({
        target: {
          name: e.target.name,
          value: e.target.value,
          type: e.target.type,
          checked: e.target.checked,
        },
      });
    };

    sendTextChange = (e) => {
      this.props.onChange(e);
    };

    render() {
      return (
        <WrappedComponent {...this.props} value={this.state.value} onChange={this.handleTextChange.bind(this)} />
      );
    }
  };
}