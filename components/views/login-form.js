import React from 'react';
import { Input } from 'react-bootstrap';
import SubmitButton from './submit-button';
import __ from 'counterpart';
import qwest from 'qwest';

class LoginFormComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  handleSubmit = async (e) => {
    try {
      this.refs.submit.asWaiting();
      let res = await qwest.post('/api/auth', {
        username: this.refs.username.getValue(),
        password: this.refs.password.getValue()
      });
      this.refs.submit.asSuccess();
    } catch (err) {
      this.refs.submit.asError();
    }
  }
  render() {
    return (
      <form>
        <Input type="text"
               ref="username"
               label={ __('login.username.label') }
               placeholder={ __('login.username.placeholder') } />
        <Input type="password"
               ref="password"
               label={ __('login.password.label') }
               placeholder={ __('login.password.placeholder') } />
        <SubmitButton ref="submit"
                      onClick={ this.handleSubmit }>
          { __('login.submit') }
        </SubmitButton>
      </form>
    );
  }
}

export default LoginFormComponent;
