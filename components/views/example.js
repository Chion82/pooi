import React from 'react';
import Translate from 'react-translate-component';

class ExampleComponent extends React.Component {
  render() {
    return (
      <h1>
        <Translate { ...this.props } content='example.greeting' />
      </h1>
    );
  }
}

export default ExampleComponent;
