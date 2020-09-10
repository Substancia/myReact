import React from 'react';
import { scaleLinear, max, select, axisBottom, axisLeft } from 'd3';

class ScatterPlot extends React.Component {

  data = {
    moved: [[0, 20], [1, 15], [2, 18], [3, 23], [4, 19], [5, 14], [6, 30]],
    finished: [[0, 5], [1, 6], [2, 3], [3, 4], [4, 6], [5, 4], [6, 4]],
    optedOut: [[0, 4], [1, 5], [2, 3], [3, 2], [4, 5], [5, 7], [6, 6]],
  };

  render() {
    const margin = { top: 20, right: 15, bottom: 60, left: 60 }
    const width = 800 - margin.left - margin.right
    const height = 500 - margin.top - margin.bottom
    const data = this.data
    const dataTotal = ObjectSum(data);

    const x = scaleLinear()
      .domain([
        0,
        max(dataTotal, function (d) {
          return d[0]
        })
      ])
      .range([0, width])

    const y = scaleLinear()
      .domain([
        0,
        max(dataTotal, function (d) {
          return d[1]
        })
      ])
      .range([height, 0])

    return (
      <div style={{ margin: '50px' }}>
        <h3> Scatter Plot with Trend Line </h3>
        <svg
          width={width + margin.right + margin.left}
          height={height + margin.top + margin.bottom}
          className="chart"
        >
          <g
            transform={"translate(" + margin.left + "," + margin.top + ")"}
            width={width}
            height={height}
            className="main"
          >
            <Shaded data={ObjectSum({ moved: data.moved, finished: data.finished, optedOut: data.optedOut })} scale={{ x, y }} fill="#fff" />
            <Shaded data={ObjectSum({ moved: data.moved, finished: data.finished })} scale={{ x, y }} fill="#fff" />
            <Shaded data={data.moved} scale={{ x, y }} fill='#e8f2fb' />
            <Axis
              axis="x"
              transform={"translate(0," + height + ")"}
              scale={axisBottom(x).tickFormat('').tickSize(0)}
            />
            <Axis
              axis="y"
              transform="translate(0,0)"
              scale={axisLeft(y).tickFormat('').tickSize(0)}
            />
            <ShadedBar data={[ObjectSum({ moved: data.moved, finished: data.finished, optedOut: data.optedOut }), ObjectSum({ moved: data.moved, finished: data.finished })]} scale={{ x, y }} fill="#ffbd80" />
            <ShadedBar data={[ObjectSum({ moved: data.moved, finished: data.finished }), data.moved]} scale={{ x, y }} fill="#89c5cc" />
            <LinkLine data={ObjectSum({ moved: data.moved, finished: data.finished, optedOut: data.optedOut })} scale={{ x, y }} stroke="#c4c4c4" />
            <LinkLine data={ObjectSum({ moved: data.moved, finished: data.finished })} scale={{ x, y }} stroke="#ff7a00" strokeDasharray="10,10" />
            <LinkLine data={data.moved} scale={{ x, y }} stroke="#1976d2" />
            <RenderCircles data={ObjectSum({ moved: data.moved, finished: data.finished, optedOut: data.optedOut })} scale={{ x, y }} stroke="#000" />
            <RenderCircles data={ObjectSum({ moved: data.moved, finished: data.finished })} scale={{ x, y }} stroke="#ff7a00" />
            <RenderCircles data={data.moved} scale={{ x, y }} stroke="#1976d2" />
          </g>
        </svg>
      </div>
    );
  }
}

class RenderCircles extends React.Component {
  render() {
    const { data, scale, stroke } = this.props
    let renderCircles = data.map((coords, i) => (
      <circle
        cx={scale.x(coords[0])}
        cy={scale.y(coords[1])}
        r="5"
        style={{ stroke: stroke, strokeWidth: "2", fill: "#fff" }}
        key={i}
      />
    ))
    return <g>{renderCircles}</g>
  }
}

class LinkLine extends React.Component {
  render() {
    const { data, scale, stroke, strokeDasharray } = this.props
    let renderLine = data.slice(0, data.length - 1).map((coords, i) =>
      <line
        x1={scale.x(coords[0])}
        y1={scale.y(coords[1])}
        x2={scale.x(data[i + 1][0])}
        y2={scale.y(data[i + 1][1])}
        style={{ stroke: stroke, strokeWidth: "2", strokeDasharray: strokeDasharray }}
      />
    )
    return renderLine
  }
}

class Shaded extends React.Component {
  render() {
    const { data, scale, fill } = this.props
    let renderShade = data.slice(0, data.length - 1).map((coords, i) =>
      <polygon
        points={`${scale.x(coords[0])}, ${scale.y(coords[1])} ${scale.x(data[i + 1][0])}, ${scale.y(data[i + 1][1])} ${scale.x(data[i + 1][0])}, ${scale.y(0)} ${scale.x(coords[0])}, ${scale.y(0)}`}
        style={{ fill: fill }}
      />
    )
    return renderShade
  }
}

class ShadedBar extends React.Component {
  render() {
    const { data, scale, fill } = this.props
    console.log(data[1])
    let shadedBar = data[0].map((coords, i) =>
      <rect
        width="12"
        height={scale.y(data[1][i][1]) - scale.y(coords[1])}
        style={{ fill: fill, transform: "translate(" + (scale.x(coords[0]) - 6) + "px, " + (scale.y(coords[1])) + "px)" }}
      />
    )
    return shadedBar
  }
}

class Axis extends React.Component {
  componentDidMount() {
    const node = this.refs[this.props.axis]
    select(node).call(this.props.scale)
  }

  render() {
    return (
      <g
        transform={this.props.transform}
        ref={this.props.axis}
      />
    )
  }
}

function ObjectSum(obj) {
  var total = []
  for (const property in obj) {
    obj[property].map((d, i) => {
      if (total.length === i) {
        total.push(d)
      } else {
        total[i] = [total[i][0], total[i][1] + d[1]]
      }
    })
  }
  return total
}

export default ScatterPlot;