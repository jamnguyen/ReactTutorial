import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={"square " + (props.highlight===props.pos ? 'highlight':'')}
            onClick={props.onClick}>
      {props.value}
    </button>
  );
}
  
class Board extends React.Component {
  
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        pos={i}
        onClick={() => this.props.onClick(i)}
        highlight={this.props.highlight}
      />
    );
  }  

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        pos: null
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const currentMove = history[history.length - 1];
    const squares = currentMove.squares.slice();
    if(squares[i] || this.calculateWinner(squares)) return;

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        pos: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  calculateWinner(squares){
    console.log(squares);
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for(let i=0; i<lines.length; i++){
      const [a, b, c] = lines[i];
      if(squares[a] && squares[a]===squares[b] && squares[a]===squares[c]){
        return squares[a];
      }
    }
    return null;
  }

  render() {
    const history = this.state.history;
    const currentMove = history[this.state.stepNumber];
    const winner = this.calculateWinner(currentMove.squares);
    
    const moves = history.map((step, move) => {
      const coord = '(' + (1 + step.pos % 3) + ', ' + (1 + Math.floor((step.pos)/3)) + ')';
      const desc = move ?
        `Go to move #${move}: ${coord}` :
        'Go to start';
      return (
        <li key={move}>
          <button
            className={move===this.state.stepNumber ? 'highlight' : ''}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if(winner){
      status = winner + ' won!';
    }
    else {
      status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    let hlPos = currentMove.pos;

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={currentMove.squares}
            onClick={(i) => this.handleClick(i)}
            highlight={hlPos}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);