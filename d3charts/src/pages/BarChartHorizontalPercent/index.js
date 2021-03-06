import React from 'react';
import { scaleLinear, select, axisBottom, axisLeft } from 'd3';
import './index.css';
import data from './data.json';

class App extends React.Component {
  componentDidMount() {

    const height = 300,
      width = 280,
      margins = {top:20, right: 50, bottom: 100, left: 100};

    const barWidth = width / 100,
      barHeight = height / 7;

    const xScale = scaleLinear()
      .range([0, width])
      .domain([0, 100]);
  
    const yScale = scaleLinear()
      .range([height, 0])
      .domain([7, 0]);

    const xScalePseudo = scaleLinear()
      .range([0, width])
      .domain([0, 100]);
  
    const yScalePseudo = scaleLinear()
      .range([height + 10, 0])
      .domain([250, 0]);

    const chart = select('.chart')
      .attr('width', width + margins.right + margins.left)
      .attr('height', height + margins.top + margins.bottom)
      .append('g')
      .attr('transform','translate(' + margins.left + ',' + margins.top + ')');

    select('.chart')
      .attr('width', width + margins.right + margins.left)
      .attr('height', height + margins.top + margins.bottom)
      .append('g')
      .attr('transform','translate(' + margins.left + ',' + margins.top + ')')
      .selectAll('g')
      .data(data).enter().append('g')
      .append('rect')
      .attr('y', (d, i) => {return i * barHeight})
      .attr('x', d => {return 0})
      .style('fill', '#ffeaa0')
      .attr('height', barHeight/1.2)
      .attr('width', d => { return width});

    select('.chart')
      .attr('width', width + margins.right + margins.left)
      .attr('height', height + margins.top + margins.bottom)
      .append('g')
      .attr('transform','translate(' + margins.left + ',' + margins.top + ')')
      .selectAll('g')
      .data(data).enter().append('g')
      .append('rect')
      .attr('y', (d, i) => {return i * barHeight})
      .attr('x', d => {return 0})
      .style('fill', '#e8f2fb')
      .attr('height', barHeight/1.2)
      .attr('width', d => { return d.percent * barWidth });
      
    chart.append('g')
      .attr('transform', 'translate(' + barWidth / 2 + ',' + (height + 5) + ')')
      .call(axisBottom(xScale).ticks(11).tickFormat(d => {return d}).tickSize(0))
      .attr('class', 'xAxis');

    chart.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(axisBottom(xScalePseudo).tickFormat('').tickSize(0))
      .attr('class', 'xAxis-grey');

    // for (var i = 1; i < 6; i += 1) {
    //   chart.append('g')
    //     .attr('transform', 'translate(-15,' + (height - (50 * i)) + ')')
    //     .call(axisBottom(xScalePseudo).tickFormat('').tickSize(0))
    //     .attr('class', 'xAxis-grey');
    //   }

    chart.append('g')
      .attr('transform', 'translate(-20, ' + barHeight / 2 + ')')
      .call(axisLeft(yScale).ticks(7).tickFormat(d => {if (d === 7) return ''; return data[d].date}).tickSize(0))
      .attr('class', 'yAxis');

    chart.append('g')
      .attr('transform', 'translate(-1, -10)')
      .call(axisLeft(yScalePseudo).tickFormat('').tickSize(0))
      .attr('class', 'yAxis-grey');

    chart.append('g')
      .attr('transform', 'translate(' + width + ', -10)')
      .call(axisLeft(yScalePseudo).tickFormat('').tickSize(0))
      .attr('class', 'yAxis-grey');
  }
  
  render() {
    return(
      <div className='container'>
        <h1>Testing D3 Horizontal Barchart</h1>
        <svg className='chart'></svg>
      </div>
    );
  }
}

export default App;