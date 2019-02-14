import React, { useState, useEffect } from 'react';
import './styles.css';
import PaperLayout from '../PaperLayout';
import HomePage from '../HomePage';
import NewOrder from '../NewOrder';
import Request from '../Request';
import OrderOverview from '../OrderOverview';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { CssBaseline, CircularProgress } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import firebase from '../firebase';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

function App(props) {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  useEffect(() => {
    firebase.isInitialized().then(setFirebaseInitialized);
  });

  return firebaseInitialized !== false ? (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <PaperLayout>
        <Router>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/new" component={NewOrder} />
            <Route exact path="/:menuId" component={Request} />
            <Route exact path="/:menuId/overview" component={OrderOverview} />
            <Route component={() => <Redirect to="/" />} />
          </Switch>
        </Router>
      </PaperLayout>
    </MuiThemeProvider>
  ) : (<div id="loader"><CircularProgress /></div>);
}

export default App;
