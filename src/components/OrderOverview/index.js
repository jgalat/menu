import React, { useState, useEffect } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Tooltip,
  Typography } from '@material-ui/core'
import { Fastfood, CheckCircle, Error } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import firebase from '../firebase';
import style from '../theme';
import withAuthentication from '../withAuthentication';
import { DISHES, DRINKS, DESSERTS, BE_GREEN_PHONE } from '../constants';

function DialogRequests(props) {
  const { requestsUsers, users, classes, ...rest } = props;
  return (
    <Dialog aria-labelledby="dialog-title" scroll="paper" {...rest}>
      <DialogTitle className={classes.dialogTitle} id="dialog-title">Requests</DialogTitle>
      <DialogContent>
        <List>
          { Object.keys(users).map((userId, i) => (
              users[userId] &&
              <ListItem key={i}>
                <ListItemIcon>
                  { requestsUsers.indexOf(userId) < 0 ?
                    <Error fontSize="large" />
                    : <CheckCircle className={classes.okCheck} fontSize="large" color="primary" />
                  }
                </ListItemIcon>
                <ListItemText primary={users[userId].displayName} />
              </ListItem>
            ))
          }
        </List>
      </DialogContent>
    </Dialog>
  );
}

function FoodTable(props) {
  const { classes, title, data, users } = props;
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
              <Tooltip
                key={i}
                title={
                  <List>
                    { data[key].by.map((uid, i) =>
                        users[uid] &&
                        <ListItem key={i}>
                          {users[uid].displayName}
                        </ListItem>
                      )
                    }
                  </List>
                }
                placement="right">
                <TableRow hover={true}>
                  <TableCell component="th" scope="row">
                    {data[key].name}
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="inherit">
                      {data[key].total}
                    </Typography>
                  </TableCell>
                </TableRow>
              </Tooltip>
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
      return {
        value: requests[uid][key],
        by: uid,
      };
    });
  }

  function countEach(list) {
    const group = {};
    list.forEach(({ value, by }) => {
      if (!group[value]) {
        group[value] = { count: 0, by: [] };
      }
      group[value].count += 1;
      group[value].by.push(by);
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
        total: obj[key].count,
        by: obj[key].by,
      };
    });
  }

  const [dishCounts, drinkCounts, dessertCounts] = [
    collect('dish'),
    collect('drink'),
    collect('dessert'),
  ].map(countEach);

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
      { store && users ? (
        <React.Fragment>
          <Button
            className={classes.typography}
            variant="outlined"
            color="secondary"
            onClick={() => setOpenDialog(true)}>
            Total requests: {Object.keys(requests).length}
          </Button>
          { requests &&
            <DialogRequests
              className={classes.dialog}
              classes={classes}
              open={openDialog}
              onClose={() => setOpenDialog(false)}
              users={users}
              requestsUsers={Object.keys(requests)} />
          }
          <FoodTable title='Food' data={dishRows} users={users} classes={classes} />
          <FoodTable title='Drink' data={drinkRows} users={users} classes={classes} />
          <FoodTable title='Dessert' data={dessertRows} users={users} classes={classes} />
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
