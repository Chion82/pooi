import React from 'react';
import io from 'socket.io-client';
import __ from 'counterpart';

class ExampleComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    let socket = io();
    socket.on('session', (session) => {
      console.log(session);
    });
    socket.emit('foo', 'bar');
  }
  render() {
    return (
      <h1>
        { __ ('example.greeting') }
      </h1>
    );
  }
}

export default ExampleComponent;
