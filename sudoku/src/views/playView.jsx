import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import "./playView.css";

class Square extends React.Component {
  render() {
    return (
      <Col className={this.props.class} onClick={() => this.props.onClick()} >
        {/* <p className={this.props.class} onClick={() => this.props.onClick()} ref={(input) => {this.textInput = input;}} >{this.props.value}</p> */}
        {this.props.value}
      </Col>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSquare: [null, null],
    };
  }

  renderSquare(i, j) {
    let classlist = "square";
    if (i===2 || i===5 || i===8) classlist=classlist.concat(" border-bottom");
    if (i===0 || i===3 || i===6) classlist=classlist.concat(" border-top");
    if (j===2 || j===5 || j===8) classlist=classlist.concat(" border-right");
    if (j===0 || j===3 || j===6) classlist=classlist.concat(" border-left");
    this.props.fixed.map(index => {if (index[0] === i && index[1] === j) classlist = classlist.concat(" fixed")});
    classlist = classlist.concat((this.state.selectedSquare[0] === i && this.state.selectedSquare[1] ===j) ? " focused" : "");
    return (
      <Square 
        key={9*i+j} 
        value={this.props.squares[i][j]} 
        onClick={() => this.selectSquare(i, j)} 
        class={classlist} 
        focus={(this.state.selectedSquare[0] === i && this.state.selectedSquare[1] === j) ? true : false} 
      />
    );
  }

  selectSquare(i, j) {
    this.setState({selectedSquare: [i, j]});
    console.log(i, j);
    this.props.handleOutside();
  }

  render() {
    const container = Array(9).fill(0).map((item, i) => 
      <Row key={i}>
        {Array(9).fill(0).map((jtem, j) => 
          this.renderSquare(i, j)
        )}
      </Row>
    );

    if (!this.props.inside) {
      this.setState({selectedSquare: [null, null]});
      this.props.handleOutside();
    }

    return (
      <Container>
        <KeyboardEventHandler 
          handleKeys={['all']} 
          handleFocusableElements 
          onKeyEvent={(key) => {
            if (this.state.selectedSquare[0] !== null && this.state.selectedSquare[1] !== null) {
              switch(key) {
                case 'left': this.selectSquare(this.state.selectedSquare[0]%9, ((this.state.selectedSquare[1]-1)+9)%9);
                break;
                case 'up': this.selectSquare(((this.state.selectedSquare[0]-1)+9)%9, this.state.selectedSquare[1]);
                break;
                case 'right': this.selectSquare(this.state.selectedSquare[0], (this.state.selectedSquare[1]+1)%9);
                break;
                case 'down': this.selectSquare((this.state.selectedSquare[0]+1)%9, this.state.selectedSquare[1]);
                break;
                case 'backspace': this.props.onChange(this.state.selectedSquare[0], this.state.selectedSquare[1], null);
                break;
                case 'del': this.props.onChange(this.state.selectedSquare[0], this.state.selectedSquare[1], null);
                break;
                default:
              }
              if (!isNaN(key) && key!==0) this.props.onChange(this.state.selectedSquare[0], this.state.selectedSquare[1], key);
            }
          }} 
        />
        {container}
      </Container>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(Array(9).fill(null)),
      }],
      fixed: [],  // stores fixed value positions
      stepNumber: 0,
      inside: false,
    };
  }
  
  componentDidMount() {
//    let fixed = [[2, 1, 4], [3, 5, 2]];
    const history = this.state.history.slice();
    const squares = history[0].squares.map(row => {return row.slice()});
    this.props.fixed.map(index => squares[index[0]][index[1]] = index[2]);
    this.setState({
      fixed: this.props.fixed.map(index => [index[0], index[1]]),
      history: [{
        squares: squares,
      }],
    });
  }

  handleClick(i, j, e) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = this.state.history[history.length - 1];
    const squares = current.squares.map((row) => {return row.slice()});
    console.log(e);
    // if (e.target.value.length === 0) {
    //   squares[i][j] = "";
    // } else if (!isNaN(e.target.value) && !isNaN(parseInt(e.target.value))) {
    //   squares[i][j] = (squares[i][j] === e.target.value%10) ? Math.floor(e.target.value/10) : e.target.value%10;
    //   if (squares[i][j] === 0) squares[i][j] = "";
    // }
    let found = false;
    this.state.fixed.map(index => {
      if (index[0] === i && index[1] === j) found = true;
    });
    if (!found) squares[i][j] = e;
//    squares[i][j] = (isNaN(e.target.value)) ? squares[i][j] : (squares[i][j] === e.target.value%10) ? Math.floor(e.target.value/10) : e.target.value%10;
//    console.log(isNaN(e.target.value));
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
    });
  }
  
  handleOutside() {
    this.setState({inside: true});
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
//    console.log(history.length);
//    console.log(current.squares);

    return (
      <div className="game">
        <div className="game-board">
          <div className="game-background" onClick={() => this.setState({inside: false})}></div>
          <Board 
            squares={current.squares} 
            onChange={(i, j, e) => this.handleClick(i, j, e)}
            inside={this.state.inside}
            handleOutside={() => this.handleOutside()}
            fixed={this.state.fixed}
          />
        </div>
      </div>
    );
  }
}

window.onclick = function(event) {
  if (!event.target.matches('.col')) {
    var square = document.getElementsByClassName("focused");
    if (square.length) square[0].classList.remove('focused');
  }
}

export default Game;
