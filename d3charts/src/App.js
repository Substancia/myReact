import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import LandHeatMap from './landHeatMap';
import HeatMap from './pages/HeatMap/heatMap';
import BarVertical from './pages/BarChartVertical/barChartVertical';
import BarHorizontal from './pages/BarChartHorizontal';
import BarHorizontalPercent from './pages/BarChartHorizontalPercent';
import BarChartCombined from './pages/BarChartCombined';
import ScatterPlot from './pages/LinearScatterPlot';

class App extends React.Component {
  render() {
    return (
      <div className="App-container">
        <BrowserRouter>
          <ul>
            <li><Link to='/landHeatMap'>Land heat map</Link></li>
            <li><Link to='/heatMap'>Heat map</Link></li>
            <li><Link to='/barVertical'>Bar vertical</Link></li>
            <li><Link to='/barHorizontal'>Bar Horizontal</Link></li>
            <li><Link to='/barHorizontalPercent'>Bar horizontal Percent</Link></li>
            <li><Link to='/combined'>Combined</Link></li>
            <li><Link to='/scatterplot'>Scatter plot</Link></li>
          </ul>
          <Switch>
            <Route path="/landHeatMap">
              <LandHeatMap />
            </Route>
            <Route path="/heatMap">
              <HeatMap />
            </Route>
            <Route path="/barVertical">
              <BarVertical />
            </Route>
            <Route path="/barHorizontal">
              <BarHorizontal />
            </Route>
            <Route path="/barHorizontalPercent">
              <BarHorizontalPercent />
            </Route>
            <Route path="/combined">
              <BarChartCombined />
            </Route>
            <Route path="/scatterplot">
              <ScatterPlot />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
