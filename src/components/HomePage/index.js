import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@material-ui/core';
import Fastfood from '@material-ui/icons/Fastfood';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import { parse } from 'query-string';
import style from '../theme';
import firebase from '../firebase';

function HomePage(props) {
  const { classes } = props;

  const [user, setUser] = useState(firebase.getCurrentUser());
  const [errorMessage, setErrorMessage] = useState('');
  const redirectTo = parse(props.location.search).redirect;
  useEffect(() => {
    if (user && redirectTo) {
      props.history.replace(redirectTo);
    }

    if (!user && redirectTo) {
      setErrorMessage('Please login first.');
    }
  }, [user, errorMessage, redirectTo]);

  return (
    <React.Fragment>
      <Typography className={classes.typography} variant="h2">
        <Fastfood fontSize="inherit" color="secondary" />
      </Typography>
      <Typography className={classes.typography} variant="h5">
        Welcome {user ? user.displayName : 'guest'}
      </Typography>
      {errorMessage && (
        <Typography color="error" variant="body1">
          {errorMessage}
        </Typography>
      )}
      {user && (
        <Button
          type="button"
          fullWidth
          variant="contained"
          color="primary"
          component={Link}
          to="/new"
          className={classes.submit}>
          New order
        </Button>
      )}
      <Button
        type="button"
        fullWidth
        variant="contained"
        color="secondary"
        onClick={user ? logout : login}
        className={classes.submit}>
        {user ? 'Logout' : 'Login with Google'}
      </Button>
    </React.Fragment>
  );

  async function login() {
    const { error, user } = await firebase.login();
    if (error) {
      setErrorMessage(error);
    } else {
      setUser(user);
    }
  }

  async function logout() {
    await firebase.logout();
    setUser(null);
  }
}

export default withStyles(style)(HomePage);
