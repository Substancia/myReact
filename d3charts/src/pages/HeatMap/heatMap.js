import React from 'react';
import { scaleLinear, select, axisBottom, axisLeft } from 'd3';
// import axios from 'axios';
import '../../App.css';
import data from './data.json';

class App extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  componentDidMount() {
    // axios.get('/data.json').then(res => {
    // const data = res.data;
    console.log(data);

    const legendData = [
      { 'interval': 4, 'color': '#c8fff4' },
      { 'interval': 8, 'color': '#03dac6' },
      { 'interval': 12, 'color': '#00b3a6' },
      { 'interval': 16, 'color': '#018786' },
      { 'interval': 18, 'color': '#005457' }
    ];

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const timeHandling = d => {
      if (d % 6 === 0) {
        if (d % 24 === 0) return "12 AM";
        if (d / 12 < 1) return d + " AM";
        return (d - 1) % 12 + 1 + " PM"
      }
      return "";
    }

    const width = 360,
      height = 105,
      margins = { top: 20, right: 50, bottom: 100, left: 100 };

    const barWidth = width / 24,
      barHeight = height / 7;

    const xScale = scaleLinear()
      .range([0, width])
      .domain([0, 24]);

    const yScale = scaleLinear()
      .range([height, 0])
      .domain([7, 0]);

    const chart = select('.chart')
      .attr('width', width + margins.right + margins.left)
      .attr('height', height + margins.top + margins.bottom)
      .append('g')
      .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

    const colorScale = d => {
      for (let i = 0; i < legendData.length; i++) {
        if (d.value < legendData[i].interval) {
          return legendData[i].color;
        }
      }
      return '#005457';
    };

    chart.selectAll('g')
      .data(data).enter().append('g')
      .append('rect')
      .attr('x', d => { return d.time * barWidth })
      .attr('y', d => { return d.day * barHeight })
      .style('fill', colorScale)
      .attr('width', barWidth / 1.2)
      .attr('height', barHeight / 1.2);
    // .on('mouseover', d => {
    //   tooltip.html(timeParseFormat(d.month) + ' ' + d.year + '<br/>' +
    //     d3.format('.4r')(baseTemperature + d.variance) + ' &degC<br/>' + d.variance + ' &degC' )
    //     .style('left', d3.event.pageX - 35 + 'px')
    //     .style('top', d3.event.pageY - 73 + 'px')
    //     .style('opacity', .9);
    // }).on('mouseout', () => {
    //   tooltip.style('opacity', 0)
    //     .style('left', '0px');
    // });

    chart.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(axisBottom(xScale).tickFormat(timeHandling).tickSize(0))
      .attr('class', 'xAxis');

    chart.append('g')
      .attr('transform', 'translate(0,-' + barHeight / 2 + ')')
      .call(axisLeft(yScale).tickFormat(d => { if (d === 0) return ""; return days[d - 1] }).tickSize(0))
      .attr('class', 'yAxis');

    // });
  }

  render() {
    return (
      <div className='container'>
        <h1>Testing D3 heatmap</h1>
        <svg className='chart'></svg>
      </div>
    );
  }
}

export default App;