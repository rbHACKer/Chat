import React, { Component } from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Login from './Login'
import Signup from './Signup'
import Chat from './Chat'

export default class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/chat" exact component={Chat} />
        </Switch>
      </Router>
    )
  }
}
