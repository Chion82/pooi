import React from 'react';
import ReactDOM from 'react-dom';
import Login from '../views/login';

export default {
  render() {
    ReactDOM.render(<Login />, document.querySelector('app'));
  }
};
