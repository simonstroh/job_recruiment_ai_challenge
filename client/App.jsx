import React from 'react'
import Main from './Main.jsx'
import Portal from './Portal.jsx'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

const App = (props) => (
  <div>
    <Router>
      <Switch>
        <Route path="/portal" component={Portal} />
        <Route path="/" component={Main} />
      </Switch>
    </Router>
  </div>
)

export default App
