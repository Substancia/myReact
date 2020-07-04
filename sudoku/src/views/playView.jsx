import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import "./playView.css";

class Square extends React.Component {
  render() {
    const centermarks = (this.props.value === null && this.props.centermarks.length) ? this.props.centermarks.map((value, index) => {
      if (this.props.centermarks[index]) {
        return <div className="inside centermarks" key={index} onClick={() => this.props.onClick()} >{value}</div>
      }
    }) : null;
    const pencilmarks = (this.props.value === null && centermarks === null) ? Array(9).fill(null).map((corner, index) => {
      let classList = "inside pencilmarks";
      if (this.props.pencilmarks[index]) classList = classList.concat(" visible");
      return <div className={classList} key={index} onClick={() => this.props.onClick()} >{index+1}</div>
    }) : null;
    return (
      <Col className={this.props.class} onClick={() => this.props.onClick()} >
        <div className="centermarks-holder">
          {centermarks}
        </div>
        {pencilmarks}
        {this.props.value}
      </Col>
    );
  }
}

class Board extends React.Component {
  renderSquare(i, j) {
    let classlist = "inside square";
    if (i===2 || i===5 || i===8) classlist=classlist.concat(" border-bottom");
    if (i===0 || i===3 || i===6) classlist=classlist.concat(" border-top");
    if (j===2 || j===5 || j===8) classlist=classlist.concat(" border-right");
    if (j===0 || j===3 || j===6) classlist=classlist.concat(" border-left");
    this.props.fixed.map(index => {if (index[0] === i && index[1] === j) classlist = classlist.concat(" fixed")});
    let error = false;
    let highlighted = false;
    for (let k = 0; k < 9; ++k) {
      if (this.props.squares[i][j] === this.props.squares[i][k]) if (j !== k) if (this.props.squares[i][j]) {error = true; break;}
      if (this.props.squares[i][j] === this.props.squares[k][j]) if (i !== k) if (this.props.squares[i][j]) {error = true; break;}
      if (this.props.selectedSquare[0] === i || this.props.selectedSquare[1] ===j) highlighted = true;
    }
    for (let k = 3*Math.floor(i/3); k < 3*(Math.floor(i/3)+1); ++k) {
      for (let l = 3*Math.floor(j/3); l < 3*(Math.floor(j/3)+1); ++l) {
        if (this.props.squares[i][j] === this.props.squares[k][l]) if (i !== k && j !== l) if (this.props.squares[i][j]) {
          error = true;
        }
        if (this.props.selectedSquare[0] === k && this.props.selectedSquare[1] ===l) highlighted = true;
      }
      if (error) break;
    }
    if (error) classlist = classlist.concat(" error");
    if (highlighted) classlist = classlist.concat(" highlighted");
    classlist = classlist.concat((this.props.selectedSquare[0] === i && this.props.selectedSquare[1] ===j) ? " focused" : "");
    return (
      <Square 
        key={9*i+j} 
        value={this.props.squares[i][j]} 
        onClick={() => this.props.selectSquare(i, j)} 
        class={classlist} 
        focus={(this.props.selectedSquare[0] === i && this.props.selectedSquare[1] === j) ? true : false} 
        pencilmarks={this.props.pencilmarks[i][j]} 
        centermarks={this.props.centermarks[i][j]} 
      />
    );
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
      this.props.selectSquare(null, null);
      this.props.handleOutside();
    }

    return (
      <Container>
        <KeyboardEventHandler 
          handleKeys={['all']} 
          handleFocusableElements 
          onKeyEvent={(key) => {
            if (this.props.selectedSquare[0] !== null && this.props.selectedSquare[1] !== null) {
              switch(key) {
                case 'left': this.props.selectSquare(this.props.selectedSquare[0]%9, ((this.props.selectedSquare[1]-1)+9)%9);
                break;
                case 'up': this.props.selectSquare(((this.props.selectedSquare[0]-1)+9)%9, this.props.selectedSquare[1]);
                break;
                case 'right': this.props.selectSquare(this.props.selectedSquare[0], (this.props.selectedSquare[1]+1)%9);
                break;
                case 'down': this.props.selectSquare((this.props.selectedSquare[0]+1)%9, this.props.selectedSquare[1]);
                break;
                case 'backspace': this.props.onChange(this.props.selectedSquare[0], this.props.selectedSquare[1], null);
                break;
                case 'del': this.props.onChange(this.props.selectedSquare[0], this.props.selectedSquare[1], null);
                break;
                default:
              }
              if (!isNaN(key) && key!==0) this.props.onChange(this.props.selectedSquare[0], this.props.selectedSquare[1], parseInt(key));
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
        pencilmarks: Array(9).fill(Array(9).fill(Array(9).fill(null))),
        centermarks: Array(9).fill(Array(9).fill(Array(0))),
      }],
      fixed: [],  // stores fixed value positions
      stepNumber: 0,
      inside: false,
      inputType: 'normal',
      selectedSquare: [null, null],
    };
  }
  
  componentDidMount() {
    this.handleReset();
  }
  
  handleReset() {
//    let fixed = [[2, 1, 4], [3, 5, 2]];
    const history = this.state.history.slice();
    const squares = history[0].squares.map(row => {return row.slice()});
    this.props.fixed.map(index => squares[index[0]][index[1]] = index[2]);
    this.setState({
      fixed: this.props.fixed.map(index => [index[0], index[1]]),
      history: [{
        squares: squares,
        pencilmarks: Array(9).fill(Array(9).fill(Array(9).fill(null))),
        centermarks: Array(9).fill(Array(9).fill(Array(0))),
      }],
      stepNumber: 0,
    });
  }

  handleClick(i, j, e) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = this.state.history[history.length - 1];
    const squares = current.squares.map((row) => {return row.slice()});
    const pencilmarks = current.pencilmarks.map(row => row.map(col => {return col.slice()}));
    const centermarks = current.centermarks.map(row => row.map(col => {return col.slice()}));
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
    if (!found) {
      if (this.state.inputType === 'normal') {
        squares[i][j] = e;
        pencilmarks.map((corner, index) => pencilmarks[i][j][index] = null);
        centermarks[i][j] = [];
      } else if (this.state.inputType === 'corner') {
        pencilmarks[i][j][e-1] = (pencilmarks[i][j][e-1] === e) ? null : e;
      } else if (this.state.inputType === 'center') {
        if (centermarks[i][j].includes(e)) {
          centermarks[i][j] = centermarks[i][j].filter((value) => {return value !== e});
        } else {
          centermarks[i][j].push(e);
          centermarks[i][j].sort();
        }
      }
    }
//    squares[i][j] = (isNaN(e.target.value)) ? squares[i][j] : (squares[i][j] === e.target.value%10) ? Math.floor(e.target.value/10) : e.target.value%10;
//    console.log(isNaN(e.target.value));
    this.setState({
      history: history.concat([{
        squares: squares,
        pencilmarks: pencilmarks,
        centermarks: centermarks,
      }]),
      stepNumber: history.length,
    });
  }
  
  selectSquare(i, j) {
    this.setState({selectedSquare: [i, j]});
    console.log(i, j);
    this.handleOutside();
  }

  handleOutside() {
    this.setState({inside: true});
  }

  buttonControls(type) {
    this.setState({inputType: type});
  }
  
  handleUndo() {
    if (this.state.stepNumber !== 0) this.setState({stepNumber: this.state.stepNumber-1});
  }
  
  handleCheck () {
    const squares = this.state.history[this.state.stepNumber].squares;
    let error = false;
    for (let i = 0; i < 8; ++i) {   // selects row
      for (let j = 0; j < 8; ++j) {   // selects col
        for (let k = i + 1; k < 9; ++k) {   // loops through rest of the selected row
          if (squares[i][j] === squares[k][j]) {
            error = true;
            break;
          }
        }
        for (let k = j + 1; k < 9; ++k) {   // loops through rest of the selected col
          if (squares[i][j] === squares[i][k]) {
            error = true;
            break;
          }
        }
        for (let k = 3*Math.floor(i/3); k < 3*(Math.floor(i/3)+1); ++k) {
          for (let l = 3*Math.floor(j/3); l < 3*(Math.floor(j/3)+1); ++l) {
            if (squares[i][j] === squares[k][l]) if (i !== k && j !== l) error = true;
            break;
          }
          if (error) break;
        }
        if (error) break;
      }
      if (error) break;
    }
    if (error) {
      alert("Doesn't look good to me!");
    } else {
      alert("Looks good to me!");
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const pencilmarks = current.pencilmarks;
    const centermarks = current.centermarks;
//    console.log(history.length);
//    console.log(current.squares);

    return (
      <div className="game">
        <KeyboardEventHandler
          handleKeys={['ctrl+z']}
          onKeyEvent={key => this.handleUndo()}
        />
        <div className="game-board-play">
          <div className="game-background" onClick={() => this.setState({inside: false})}></div>
          <Board 
            squares={current.squares} 
            onChange={(i, j, e) => this.handleClick(i, j, e)}
            inside={this.state.inside}
            handleOutside={() => this.handleOutside()}
            fixed={this.state.fixed}
            pencilmarks={pencilmarks}
            centermarks={centermarks}
            selectedSquare={this.state.selectedSquare}
            selectSquare={(i, j) => this.selectSquare(i, j)}
          />
          <div className="controls">
            <button className={(this.state.inputType === 'normal') ? "inside active" : "inside"} onClick={() => this.buttonControls('normal')}>Normal</button>
            <button className={(this.state.inputType === 'corner') ? "inside active" : "inside"} onClick={() => this.buttonControls('corner')}>Corner</button>
            <button className={(this.state.inputType === 'center') ? "inside active" : "inside"} onClick={() => this.buttonControls('center')}>Center</button>
            <button onClick={() => this.handleUndo()}>Undo</button>
            <button onClick={() => this.handleCheck()}>Check</button>
            <button onClick={() => this.handleReset()}>Reset</button>
          </div>
          <div className="numpad">
            {Array(3).fill(null).map((i, index) => {
              return <div className="numpad-row">
                {Array(3).fill(null).map((j,jndex) => {
                  return <button className="inside" onClick={() => this.handleClick(this.state.selectedSquare[0], this.state.selectedSquare[1], parseInt(3*index+jndex+1))}>{3*index+jndex+1}</button>
                })}
              </div>
            })}
          </div>
        </div>
      </div>
    );
  }
}

window.onclick = function(event) {
  if (!event.target.matches('.inside')) {
    var square = document.getElementsByClassName("focused");
    if (square.length) square[0].classList.remove('focused');
  }
}

export default Game;
