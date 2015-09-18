import React from 'react';
import { Button } from 'react-bootstrap';
import Icon from 'react-fontawesome';

class SubmitButton extends React.Component {
  state = {
    icon: 'link',
    style: 'default'
  };
  constructor(props, context) {
    super(props, context);
  }
  asWaiting = () => {
    this.setState({
      icon: 'spinner',
      style: 'info'
    });
  }
  asError = () => {
    this.setState({
      icon: 'times',
      style: 'danger'
    });
  }
  asSuccess = () => {
    this.setState({
      icon: 'check',
      style: 'success'
    });
  }
  render() {
    return (
      <Button bsStyle={ this.state.style }
              { ...this.props }>
        <Icon name={ this.state.icon } />
        <span> </span>
        { this.props.children }
      </Button>
    );
  }
}

export default SubmitButton;
