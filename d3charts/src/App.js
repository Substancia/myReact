import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
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