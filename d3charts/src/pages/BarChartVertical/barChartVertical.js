import React from 'react';
import { scaleLinear, select, axisBottom, axisLeft } from 'd3';
import '../../App.css';
import data from './data.json';

class App extends React.Component {
  componentDidMount() {

    const width = 800,
      height = 200,
      margins = {top:20, right: 50, bottom: 100, left: 100};

    const barWidth = width / 16,
      barHeight = 1;

    const xScale = scaleLinear()
      .range([0, width])
      .domain([0, 16]);
  
    const yScale = scaleLinear()
      .range([height, 0])
      .domain([250, 0]);

    const xScalePseudo = scaleLinear()
      .range([0, width + 15])
      .domain([0, 16]);
  
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
      .attr('x', (d, i) => {return i * barWidth})
      .attr('y', d => {return (height - (d.value.auto + d.value.manual + d.value.calls + d.value.others) * barHeight)})
      .style('fill', '#cdcdcd')
      .attr('width', barWidth/1.2)
      .attr('height', d => { return (d.value.auto + d.value.manual + d.value.calls + d.value.others) * barHeight });

    select('.chart')
      .attr('width', width + margins.right + margins.left)
      .attr('height', height + margins.top + margins.bottom)
      .append('g')
      .attr('transform','translate(' + margins.left + ',' + margins.top + ')')
      .selectAll('g')
      .data(data).enter().append('g')
      .append('rect')
      .attr('x', (d, i) => {return i * barWidth})
      .attr('y', d => {return (height - (d.value.auto + d.value.manual + d.value.calls) * barHeight)})
      .style('fill', '#f1b4c3')
      .attr('width', barWidth/1.2)
      .attr('height', d => { return (d.value.auto + d.value.manual + d.value.calls) * barHeight });
      
    select('.chart')
      .attr('width', width + margins.right + margins.left)
      .attr('height', height + margins.top + margins.bottom)
      .append('g')
      .attr('transform','translate(' + margins.left + ',' + margins.top + ')')
      .selectAll('g')
      .data(data).enter().append('g')
      .append('rect')
      .attr('x', (d, i) => {return i * barWidth})
      .attr('y', d => {return (height - (d.value.auto + d.value.manual) * barHeight)})
      .style('fill', '#ffeaa0')
      .attr('width', barWidth/1.2)
      .attr('height', d => { return (d.value.auto + d.value.manual) * barHeight });
      
    select('.chart')
      .attr('width', width + margins.right + margins.left)
      .attr('height', height + margins.top + margins.bottom)
      .append('g')
      .attr('transform','translate(' + margins.left + ',' + margins.top + ')')
      .selectAll('g')
      .data(data).enter().append('g')
      .append('rect')
      .attr('x', (d, i) => {return i * barWidth})
      .attr('y', d => {return (height - d.value.auto * barHeight)})
      .style('fill', '#e8f2fb')
      .attr('width', barWidth/1.2)
      .attr('height', d => { return d.value.auto * barHeight });
      
    chart.append('g')
      .attr('transform', 'translate(' + barWidth / 2 + ',' + (height + 5) + ')')
      .call(axisBottom(xScale).ticks(16).tickFormat(d => {if (d === 16) return ''; return data[d].date}).tickSize(0))
      .attr('class', 'xAxis');

    chart.append('g')
      .attr('transform', 'translate(-15,' + height + ')')
      .call(axisBottom(xScalePseudo).tickFormat('').tickSize(0))
      .attr('class', 'xAxis-grey');

    for (var i = 1; i < 6; i += 1) {
      chart.append('g')
        .attr('transform', 'translate(-15,' + (height - (50 * i)) + ')')
        .call(axisBottom(xScalePseudo).tickFormat('').tickSize(0))
        .attr('class', 'xAxis-grey');
      }

    chart.append('g')
      .attr('transform', 'translate(-20, 0)')
      .call(axisLeft(yScale).ticks(6).tickFormat(d => {return 250 - d}).tickSize(0))
      .attr('class', 'yAxis');

    chart.append('g')
      .attr('transform', 'translate(-15, -10)')
      .call(axisLeft(yScalePseudo).tickFormat('').tickSize(0))
      .attr('class', 'yAxis-grey');
  }
  
  render() {
    return(
      <div className='container'>
        <h1>Testing D3 Vertical Barchart</h1>
        <svg className='chart'></svg>
      </div>
    );
  }
}

export default App;