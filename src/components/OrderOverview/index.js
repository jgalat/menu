import React, { useState, useEffect } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Typography } from '@material-ui/core'
import { Fastfood, CheckCircle, Error } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import firebase from '../firebase';
import style from '../theme';
import withAuthentication from '../withAuthentication';
import { DISHES, DRINKS, DESSERTS, BE_GREEN_PHONE } from '../constants';

function DialogRequests(props) {
  const { requestsUsers, users, ...rest } = props;
  return (
    <Dialog aria-labelledby="dialog-title" {...rest}>
      <DialogTitle id="dialog-title">Total requests</DialogTitle>
      <List>
        { users.map((user, i) => (
            <ListItem key={i}>
              <ListItemIcon>
                { requestsUsers.indexOf(user.userId) < 0 ?
                  <Error fontSize="large" />
                  : <CheckCircle fontSize="large" color="primary" /> }
              </ListItemIcon>
              <ListItemText primary={user.displayName} />
            </ListItem>
          ))
        }
      </List>
    </Dialog>
  );
}

function FoodTable(props) {
  const { classes, title, data } = props;

  return (
    <React.Fragment>
      <Typography variant="h6">
        {title}
      </Typography>
      <Table className={classes.foodTable}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { Object.keys(data).map((key, i) => (
            <TableRow key={i}>
              <TableCell component="th" scope="row">
                {data[key].name}
              </TableCell>
              <TableCell align="right">{data[key].total}</TableCell>
            </TableRow>
          ))
          }
        </TableBody>
      </Table>
    </React.Fragment>
  );
}

function OrderOverview(props) {
  const { classes, match } = props;
  const menuId = match.params.menuId;

  const [openDialog, setOpenDialog] = useState(false);
  const [store, setStore] = useState(null);
  const [users, setUsers] = useState(null);
  useEffect(() => {
    firebase.getStore(menuId, setStore);
    firebase.retrieveAllUsers(setUsers);
    return firebase.subscribeToSnapshot(menuId, setStore);
  }, []);

  const dishesNames = store && store.menu ? DISHES(store.menu) : {};
  const requests = store && store.requests ? store.requests : {};
  Object.keys(requests).forEach(key => {
    if (requests[key].clarification) {
      requests[key].dish = `${requests[key].dish} (${requests[key].clarification})`;
      delete requests[key].clarification;
    }
  });

  function collect(key) {
    return Object.keys(requests).map(uid => {
      return requests[uid][key];
    });
  }

  function countEach(list) {
    const group = {};
    list.forEach(key => {
      if (!group[key])
        group[key] = 0;
      group[key] += 1;
    });
    return group;
  }

  function getRow(obj, dict) {
    return Object.keys(obj).map(key => {
      let name = dict[key];
      if (key.indexOf(' ') > 0) {
        const realKey = key.substring(0, key.indexOf(' '));
        const value = dict[realKey];
        name = key.replace(realKey, value);
      }
      return {
        name: name,
        total: obj[key],
      };
    });
  }

  const [dishCounts, drinkCounts, dessertCounts] = requests ? [
    collect('dish'),
    collect('drink'),
    collect('dessert'),
  ].map(countEach) : [{}, {}, {}];

  const [dishRows, drinkRows, dessertRows] = [
    getRow(dishCounts, dishesNames),
    getRow(drinkCounts, DRINKS),
    getRow(dessertCounts, DESSERTS),
  ];

  return (
    <React.Fragment>
      <Fastfood />
      <Typography className={classes.typography} variant="h4">
        Order overview
      </Typography>
      { store ? (
        <React.Fragment>
          <Button
            className={classes.typography}
            variant="outlined"
            color="secondary"
            onClick={() => setOpenDialog(true)}>
            Total requests: {Object.keys(requests).length}
          </Button>
          { users &&
            store.requests &&
            <DialogRequests
              className={classes.dialog}
              open={openDialog}
              onClose={() => setOpenDialog(false)}
              users={users}
              requestsUsers={Object.keys(store.requests)} />
          }
          <FoodTable title='Food' data={dishRows} {...props} />
          <FoodTable title='Drink' data={drinkRows} {...props} />
          <FoodTable title='Dessert' data={dessertRows} {...props} />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={sendRequest}>
            Submit order
          </Button>
        </React.Fragment>
        ) : (<CircularProgress />)
      }

      <Button
        type="button"
        fullWidth
        variant="contained"
        color="secondary"
        className={classes.submit}
        component={Link}
        to={`/${menuId}`}>
        Edit my request
      </Button>
    </React.Fragment>
  );

  function sendRequest(e) {
    e.preventDefault();

    function data(rows) {
      return Object.keys(rows).map(key => {
        return `${rows[key].total} ${rows[key].name}`;
      }).join('\n');
    }

    let msg = "Hola, cómo estás?\nEl pedido de hoy es:\n\n";
    msg += "Comida:\n";
    msg += data(dishRows);
    msg += "\n\nBebida:\n";
    msg += data(drinkRows);
    msg += "\n\nPostres:\n";
    msg += data(dessertRows);
    msg += "\n\nEnvialo ni bien lo tengas listo. Gracias!";

    let url = "https://web.whatsapp.com/send?";
    url += `phone=${BE_GREEN_PHONE}`;
    url += `&text=${encodeURI(msg)}`;

    window.open(url, '_blank');
  }
}

export default withAuthentication(withStyles(style)(OrderOverview));
