import React from 'react';
import { Switch, Route, Link, Redirect } from 'react-router-dom';
import PlayView from './views/playView';
import InputView from './views/inputView';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fixed: [],
      redirect: null,
    }
  }
  
  updateFixed(fixed) {
    console.log("onSubmit called!");
    const arr = [];
    fixed.map((row, i) => {
      row.map((square, j) => {
        if (square !== null) arr.push([i, j, square]);
      });
    });
    this.setState({ fixed: arr, redirect: "/play" });
  }

  render() {
    console.log(this.state.redirect);
    return (
      <div className="App">
        <Switch>
          <Route path="/play">
            <PlayView 
              fixed={this.state.fixed}
            />
          </Route>
          <Route path="/input">
            <InputView 
              redirect={this.state.redirect}
              onSubmit={(fixed) => this.updateFixed(fixed)}
            />
          </Route>
          <Route path="/">
            <ul>
              <li>
                <Link to="/input">inputView</Link>
              </li>
              <li>
                <Link to="/play">playView</Link>
              </li>
            </ul>
          </Route>
        </Switch>
      </div>
    );
  }
}

export default App;