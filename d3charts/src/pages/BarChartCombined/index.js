import React from 'react';
import { scaleLinear, select, axisBottom, axisLeft } from 'd3';
import './index.css';
import data from './data.json';

class App extends React.Component {
  componentDidMount() {

    const chartType = "vertical";

    var maxWidth = 0, maxHeight = 0;
    if (chartType === 'horizontal') {
      for (const item in data[0].value) {
        maxWidth += 10 * data[1].value[item];
      }
      maxWidth += 50;
      data.forEach(() => maxHeight += 40);
    } else if (chartType === 'vertical') {
      data.forEach(() => maxWidth += 40);
      for (const item in data[0].value) {
        maxHeight += 10 * data[0].value[item];
      }
      maxHeight += 50;
    }

    const height = maxHeight,
      width = maxWidth,
      margins = {top:20, right: 50, bottom: 100, left: 100};

    const barWidth = chartType === 'horizontal' ? 10 : 40,
      barHeight = chartType === 'horizontal' ? 40 : 10;

    const xScale = scaleLinear()
      .range([0, width])
      .domain([0, width / barWidth]);
  
    const yScale = scaleLinear()
      .range([height, 0])
      .domain([height / barHeight, 0]);

    const xScalePseudo = scaleLinear()
      .range([0, width + 100])
      .domain([0, width / barWidth]);
  
    const yScalePseudo = scaleLinear()
      .range([height + 10, 0])
      .domain([height / barHeight, 0]);

    const chart = select('.chart')
      .attr('width', width + margins.right + margins.left + 100)
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
      .attr('y', chartType === 'horizontal' ? (d, i) => {return i * barHeight} : d => {return (height - (d.value.auto + d.value.manual + d.value.calls + d.value.others) * barHeight)})
      .attr('x', chartType === 'horizontal' ? d => {return 0} : (d, i) => {return i * barWidth})
      .style('fill', '#cdcdcd')
      .attr('height', chartType === 'horizontal' ? barHeight/1.2 : d => { return (d.value.auto + d.value.manual + d.value.calls + d.value.others) * barHeight })
      .attr('width', chartType === 'horizontal' ? d => { return (d.value.auto + d.value.manual + d.value.calls + d.value.others) * barWidth } : barWidth/1.2);

    select('.chart')
      .attr('width', width + margins.right + margins.left)
      .attr('height', height + margins.top + margins.bottom)
      .append('g')
      .attr('transform','translate(' + margins.left + ',' + margins.top + ')')
      .selectAll('g')
      .data(data).enter().append('g')
      .append('rect')
      .attr('y', chartType === 'horizontal' ? (d, i) => {return i * barHeight} : d => {return (height - (d.value.auto + d.value.manual + d.value.calls) * barHeight)})
      .attr('x', chartType === 'horizontal' ? d => {return 0} : (d, i) => {return i * barWidth})
      .style('fill', '#f1b4c3')
      .attr('height', chartType === 'horizontal' ? barHeight/1.2 : d => { return (d.value.auto + d.value.manual + d.value.calls) * barHeight })
      .attr('width', chartType === 'horizontal' ? d => { return (d.value.auto + d.value.manual + d.value.calls) * barWidth } : barWidth/1.2);

    select('.chart')
      .attr('width', width + margins.right + margins.left)
      .attr('height', height + margins.top + margins.bottom)
      .append('g')
      .attr('transform','translate(' + margins.left + ',' + margins.top + ')')
      .selectAll('g')
      .data(data).enter().append('g')
      .append('rect')
      .attr('y', chartType === 'horizontal' ? (d, i) => {return i * barHeight} : d => {return (height - (d.value.auto + d.value.manual) * barHeight)})
      .attr('x', chartType === 'horizontal' ? d => {return 0} : (d, i) => {return i * barWidth})
      .style('fill', '#ffeaa0')
      .attr('height', chartType === 'horizontal' ? barHeight/1.2 : d => { return (d.value.auto + d.value.manual) * barHeight })
      .attr('width', chartType === 'horizontal' ? d => { return (d.value.auto + d.value.manual) * barWidth } : barWidth/1.2);
      
    select('.chart')
      .attr('width', width + margins.right + margins.left)
      .attr('height', height + margins.top + margins.bottom)
      .append('g')
      .attr('transform','translate(' + margins.left + ',' + margins.top + ')')
      .selectAll('g')
      .data(data).enter().append('g')
      .append('rect')
      .attr('y', chartType === 'horizontal' ? (d, i) => {return i * barHeight} : d => {return (height - (d.value.auto) * barHeight)})
      .attr('x', chartType === 'horizontal' ? d => {return 0} : (d, i) => {return i * barWidth})
      .style('fill', '#e8f2fb')
      .attr('height', chartType === 'horizontal' ? barHeight/1.2 : d => { return (d.value.auto) * barHeight })
      .attr('width', chartType === 'horizontal' ? d => { return (d.value.auto) * barWidth } : barWidth/1.2);
      
    chart.append('g')
      .attr('transform', 'translate(' + barWidth / 2 + ',' + (height + 5) + ')')
      .call(axisBottom(xScale).ticks(5).tickFormat(chartType === 'horizontal' ? d => {return d} : d => {if (d === data.length) return ''; return data[d].date}).tickSize(0))
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
      .call(axisLeft(yScale).ticks(7).tickFormat(chartType === 'horizontal' ? d => {if (d === data.length) return ''; return data[d].date} : d => {return 250 - d}).tickSize(0))
      .attr('class', 'yAxis');

    chart.append('g')
      .attr('transform', 'translate(-1, -10)')
      .call(axisLeft(yScalePseudo).tickFormat('').tickSize(0))
      .attr('class', 'yAxis-grey');

    // chart.append('text')
    //   .style('font-size', '10px')
    //   .attr('transform', 'translate(' + (width / 2) + ',' + (height + 40) + ')')
    //   .style('text-anchor', 'middle')
    //   .text('NUMBER OF CALLS ATTEMPTED');
  }
  
  render() {
    return(
      <div className='container'>
        <h1>Testing D3 Combined Barchart</h1>
        <svg className='chart'></svg>
      </div>
    );
  }
}

export default App;