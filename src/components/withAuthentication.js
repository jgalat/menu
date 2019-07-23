import React from 'react';
import { Redirect } from 'react-router-dom';
import firebase from './firebase';

function withAuthentication(WrappedComponent) {
  return function(props) {
    if (!firebase.getCurrentUser()) {
      return (
        <Redirect to={`/?redirect=${encodeURI(props.location.pathname)}`} />
      );
    }

    return <WrappedComponent {...props} />;
  };
}

export default withAuthentication;
