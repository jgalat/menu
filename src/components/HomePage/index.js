import React from 'react';
import { Typography, Button } from '@material-ui/core';
import Fastfood from '@material-ui/icons/Fastfood';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import style from '../theme';
import firebase from '../firebase';

function HomePage(props) {
  const { classes } = props;
  const user = firebase.getCurrentUser();

  return (
    <React.Fragment>
      <Typography className={classes.typography} component="h1" variant="h3">
        <Fastfood fontSize="inherit" color="secondary" />
      </Typography>
      <Typography className={classes.typography} component="h1" variant="h6">
        Welcome { user ? user.displayName : 'guest' }
      </Typography>
      { user &&
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
      }
      <Button
        type="button"
        fullWidth
        variant="contained"
        color="secondary"
        onClick={user ? logout : login}
        className={classes.submit}>
        { user ? "Logout" : "Login with Google" }
      </Button>
    </React.Fragment>
  );

  async function login() {
    await firebase.login();
    props.history.push('/');
  }

  async function logout() {
    await firebase.logout();
    props.history.push('/');
  }
}

export default withStyles(style)(HomePage);
