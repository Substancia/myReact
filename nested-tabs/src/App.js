import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const Profile = () => <div>You're on the Profile Tab</div>;
const Comments = () => <div>You're on the Comments Tab</div>;
const Contact = () => <div>You're on the Contact Tab</div>;

class App extends Component {
  render() {
    const { path } = this.props.match || '';
   
    return (
      <div>
        <Router>
        <h1>Hey welcome home!</h1>
        <div className="links">
          <ul>
            <li><Link to={`${path}`} className="link">Profile</Link></li>
            <li><Link to={`${path}/comments`} className="link">Comments</Link></li>
            <li><Link to={`${path}/contact`} className="link">Contact</Link></li>
          </ul>
        </div>
        <div className="tabs">
          <Switch>
            <Route path={`${path}`} exact component={Profile} />
            <Route path={`${path}/comments`} component={Comments} />
            <Route path={`${path}/contact`} component={Contact} />
          </Switch>
        </div>
        </Router>
      </div>
    );
  }
}

export default App;
