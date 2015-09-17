import React from 'react';
import Translate from 'react-translate-component';
import io from 'socket.io-client';

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
        <Translate { ...this.props } content='example.greeting' />
      </h1>
    );
  }
}

export default ExampleComponent;
