import React, { useState } from 'react';
import { Typography,
  Button,
  FormControl,
  Input,
  InputLabel,
   Snackbar } from '@material-ui/core';
import Fastfood from '@material-ui/icons/Fastfood';
import { Link, withRouter } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import firebase from '../firebase';
import style from '../theme';
import { redirectOnUnauthorized } from '../util';

function NewOrder(props) {
  const { classes } = props;

  const redirect = redirectOnUnauthorized(props.location.pathname);
  if (redirect) {
    props.history.replace(redirect);
    return null;
  }

  const [orderLink, setOrderLink] = useState('');
  const [form, setForm] = useState({
    dayMenu: '',
    pie1: '',
    pie2: '',
    pie3: '',
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <React.Fragment>
      <Fastfood />
      <Typography className={classes.typography} variant="h4">
        Create a new order
      </Typography>
      <form className={classes.form} onSubmit={submit}>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="dayMenu">Menú del día</InputLabel>
          <Input id="dayMenu" name="dayMenu" autoComplete="off" value={form.dayMenu} onChange={handleChange} />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="pie1">Tarta del día 1</InputLabel>
          <Input id="pie1" name="pie1" autoComplete="off" value={form.pie1} onChange={handleChange} />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="pie2">Tarta del día 2</InputLabel>
          <Input id="pie2" name="pie2" autoComplete="off" value={form.pie2} onChange={handleChange} />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="pie3">Tarta del día 3</InputLabel>
          <Input id="pie3" name="pie3" autoComplete="off" value={form.pie3} onChange={handleChange} />
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}>
          Submit
        </Button>
      </form>
      <Button
        type="button"
        fullWidth
        variant="contained"
        color="secondary"
        className={classes.submit}
        component={Link}
        to="/">
        Go back
      </Button>
      { orderLink &&
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          className={classes.snackbar}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={
            <Typography color="inherit">
              Share this link: <em>{`${window.location.origin}/${orderLink}`}</em>
            </Typography>
          }
          open={orderLink ? true : false}
          action={
            <React.Fragment>
              <Button color="secondary" size="small" onClick={copyUrl}>
                Copy
              </Button>
              <Button color="secondary" size="small" onClick={() => props.history.replace(orderLink)}>
                Redirect me
              </Button>
            </React.Fragment>
          }/>
      }
    </React.Fragment>
  );

  function copyUrl(e) {
    e.preventDefault();

    const textArea = document.createElement('textarea');
    textArea.value = `${window.location.origin}/${orderLink}`;
    document.body.prepend(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
    } catch (err) { }

    document.body.removeChild(textArea);
  }

  async function submit(e) {
    e.preventDefault();

    const uid = await firebase.createNewOrder(form);

    if (!uid) {
      props.history.replace('/');
      return null;
    }

    setOrderLink(uid);
  }
}

export default withRouter(withStyles(style)(NewOrder));
