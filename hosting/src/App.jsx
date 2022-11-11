import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom'

import AdminComponent from './components/AdminComponent';
import Dashboard from './components/Dashboard';

import './App.css';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/admin">
              <AdminComponent />
          </Route>
          <Route path="/">
            <Dashboard />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
