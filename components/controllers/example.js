import React from 'react';
import ReactDOM from 'react-dom';
import Example from '../views/example';

export default {
  render() {
    ReactDOM.render(<Example />, document.querySelector('app'));
  }
};
