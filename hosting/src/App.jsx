import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom'

import AdminComponent from './components/AdminComponent';
import Dashboard from './components/Dashboard';

import './App.css';

const App = () => {
  return (
    <div className="App">
      
      <header className="App-header">
        <h1>Scott Logic Newcastle's World Cup 2022 Sweepstake</h1>
      </header>

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
