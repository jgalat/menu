import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  Input,
  CircularProgress,
} from '@material-ui/core';
import Fastfood from '@material-ui/icons/Fastfood';
import { Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import firebase from '../firebase';
import style from '../theme';
import withAuthentication from '../withAuthentication';
import { DISHES, DRINKS, DESSERTS } from '../constants';

function Request(props) {
  const { classes, match } = props;
  const menuId = match.params.menuId;
  const user = firebase.getCurrentUser();

  const [store, setStore] = useState(null);
  const [enableOverview, setEnableOverview] = useState(false);
  const [menu, setMenu] = useState({
    dish: '',
    clarification: '',
    drink: '',
    dessert: '',
  });

  useEffect(() => {
    firebase.getStore(menuId, storeData => {
      if (!storeData) {
        props.history.replace('/');
        return;
      }
      setStore(storeData);
      if (storeData.requests[user.uid]) {
        setMenu({
          ...menu,
          ...storeData.requests[user.uid],
        });
        setEnableOverview(true);
      }
    });
  }, [menuId, user.uid]);

  function handleChange(e) {
    setMenu({
      ...menu,
      [e.target.name]: e.target.value,
    });
  }

  const dishes = store && store.menu ? DISHES(store.menu) : {};

  return (
    <React.Fragment>
      <Fastfood />
      <Typography className={classes.typography} variant="h4">
        Submit request
      </Typography>
      {store ? (
        <form className={classes.form} onSubmit={submit}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="dish">Plato</InputLabel>
            <Select
              native
              className={classes.select}
              value={menu.dish}
              onChange={handleChange}
              inputProps={{
                id: 'dish',
                name: 'dish',
                required: true,
              }}>
              <option value="" />
              {Object.keys(dishes).map((key, i) => {
                return (
                  <option value={key} key={i}>
                    {dishes[key]}
                  </option>
                );
              })}
            </Select>
          </FormControl>
          <FormControl margin="normal" fullWidth>
            <InputLabel htmlFor="clarification">Aclaración</InputLabel>
            <Input
              id="clarification"
              name="clarification"
              autoComplete="off"
              value={menu.clarification}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="drink">Bebida</InputLabel>
            <Select
              native
              className={classes.select}
              value={menu.drink}
              onChange={handleChange}
              inputProps={{
                id: 'drink',
                name: 'drink',
                required: true,
              }}>
              <option value="" />
              {Object.keys(DRINKS).map((key, i) => {
                return (
                  <option value={key} key={i}>
                    {DRINKS[key]}
                  </option>
                );
              })}
            </Select>
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="dessert">Postre</InputLabel>
            <Select
              native
              className={classes.select}
              value={menu.dessert}
              onChange={handleChange}
              inputProps={{
                id: 'dessert',
                name: 'dessert',
                required: true,
              }}>
              <option value="" />
              {Object.keys(DESSERTS).map((key, i) => {
                return (
                  <option value={key} key={i}>
                    {DESSERTS[key]}
                  </option>
                );
              })}
            </Select>
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
      ) : (
        <CircularProgress />
      )}
      {enableOverview && (
        <Button
          type="button"
          fullWidth
          variant="contained"
          color="secondary"
          className={classes.submit}
          onClick={() => props.history.replace(`/${menuId}/overview`)}>
          Order overview
        </Button>
      )}
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
    </React.Fragment>
  );

  async function submit(e) {
    e.preventDefault();
    await firebase.submitRequest(menuId, menu);
    props.history.replace(`/${menuId}/overview`);
  }
}

export default withAuthentication(withStyles(style)(Request));
