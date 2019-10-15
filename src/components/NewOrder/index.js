import React, { useState } from 'react';
import {
  Typography,
  Button,
  FormControl,
  Input,
  InputLabel,
  Snackbar,
} from '@material-ui/core';
import Fastfood from '@material-ui/icons/Fastfood';
import { Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import firebase from '../firebase';
import style from '../theme';
import withAuthentication from '../withAuthentication';

function NewOrder(props) {
  const { classes } = props;

  const [orderLink, setOrderLink] = useState('');
  const [form, setForm] = useState({
    menu1: '',
    menu2: '',
    menu3: '',
    daySalad: '',
    dayPie: '',
    dayVeggie: ''
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <React.Fragment>
      <Fastfood />
      <Typography className={classes.typography} variant="h4">
        Create a new order
      </Typography>
      <form className={classes.form} onSubmit={submit}>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="menu1">Menu 1</InputLabel>
          <Input
            id="menu1"
            name="menu1"
            autoComplete="off"
            value={form.menu1}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="menu2">Menu 2</InputLabel>
          <Input
            id="menu2"
            name="menu2"
            autoComplete="off"
            value={form.menu2}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="menu3">Menu 3</InputLabel>
          <Input
            id="menu3"
            name="menu3"
            autoComplete="off"
            value={form.menu3}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="daySalad">Ensalada del día</InputLabel>
          <Input
            id="daySalad"
            name="daySalad"
            autoComplete="off"
            value={form.daySalad}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="dayPie">Tarta del día</InputLabel>
          <Input
            id="dayPie"
            name="dayPie"
            autoComplete="off"
            value={form.dayPie}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="dayVeggie">Vegetariano del día</InputLabel>
          <Input
            id="dayVeggie"
            name="dayVeggie"
            autoComplete="off"
            value={form.dayVeggie}
            onChange={handleChange}
          />
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
      {orderLink && (
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          className={classes.snackbar}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={
            <Typography color="inherit">
              Share this link:{' '}
              <em>{`${window.location.origin}/${orderLink}`}</em>
            </Typography>
          }
          open={orderLink ? true : false}
          action={
            <React.Fragment>
              <Button color="secondary" size="small" onClick={copyUrl}>
                Copy
              </Button>
              <Button
                color="secondary"
                size="small"
                onClick={() => props.history.replace(orderLink)}>
                Redirect me
              </Button>
            </React.Fragment>
          }
        />
      )}
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
    } catch (err) {}

    document.body.removeChild(textArea);
  }

  async function submit(e) {
    e.preventDefault();

    const uid = await firebase.createNewOrder(form);

    if (!uid) {
      props.history.replace('/');
      return;
    }

    setOrderLink(uid);
  }
}

export default withAuthentication(withStyles(style)(NewOrder));
