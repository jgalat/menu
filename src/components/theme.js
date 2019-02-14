export default theme => ({
  main: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(500 + theme.spacing.unit * 3 * 2)]: {
      width: 500,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 3}px`,
  },
  footer: {
    marginBottom: theme.spacing.unit * 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  form: {
    width: '100%',
  },
  typography: {
    marginBottom: theme.spacing.unit * 2,
  },
  foodTable: {
    marginBottom: theme.spacing.unit * 3,
  },
  snackbar: {
    margin: theme.spacing.unit,
  },
});
