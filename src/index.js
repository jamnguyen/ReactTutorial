import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  let renderItem;
  if (props.value === 'X') {
    renderItem = (
      <i className={"fas fa-times move-x " + (props.highlight.indexOf(props.pos)>=0 ? 'highlight':'')}></i>
    )
  } else if (props.value === 'O') {
    renderItem = (
      <i className={"fas fa-circle move-o " + (props.highlight.indexOf(props.pos)>=0 ? 'highlight':'')}></i>
    )
  }

  let border = '';
  if (props.drawBorderRight) border += 'border-right ';
  if (props.drawBorderBottom) border += 'border-bottom ';

  return (
    <button className={"square " + border}
            onClick={props.onClick}>
      {renderItem}
    </button>
  );
}
  
class Board extends React.Component {
  renderBoard(rows, cols) {
    let board = [];
    for(let i=0; i<rows; i++){
      let row = [];
      for(let j=0; j<cols; j++){
        row.push(this.renderSquare(i*rows + j));
      }
      board.push(
        <div className="board-row" key={i}>
          {row}
        </div>
      );
    }
    return (
      <div>
        {board}
      </div>
    );

  }

  renderSquare(i) {
    let drawBorderRight = false;
    let drawBorderBottom = false;
    switch(i) {
      case 0:
        drawBorderRight = true;
        drawBorderBottom = true;
        break;
      case 1:
        drawBorderRight = true;
        drawBorderBottom = true;
        break;
      case 2:
        drawBorderBottom = true;
        break;
      case 3:
        drawBorderRight = true;
        drawBorderBottom = true;
        break;
      case 4:
        drawBorderRight = true;
        drawBorderBottom = true;
        break;
      case 5:
        drawBorderBottom = true;
        break;
      case 6:
        drawBorderRight = true;
        break;
      case 7:
        drawBorderRight = true;
        break;
      case 8:
      default:
        break;
    }
    return (
      <Square
        value={this.props.squares[i]}
        pos={i}
        key={i}
        onClick={() => this.props.onClick(i)}
        highlight={this.props.highlight}
        drawBorderRight={drawBorderRight}
        drawBorderBottom={drawBorderBottom}
      />
    );
  }  

  render() {
    return (this.renderBoard(3,3));
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
      xIsNext: true,
      useAscendingHistory: true
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

  handleSortClick(){
    this.setState({
      useAscendingHistory: !this.state.useAscendingHistory
    });    
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  calculateWinner(squares){
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
        return {
          player: squares[a],
          moves: [a, b, c]
        }
      }
    }
    return null;
  }

  render() {
    const history = this.state.history;
    // const history = this.state.useAscendingHistory ? this.state.history : this.state.history.slice().reverse();
    // const tHistory = this.state.useAscendingHistory ? history : history.slice().reverse();
    const currentMove = this.state.history[this.state.stepNumber];
    const winner = this.calculateWinner(currentMove.squares);
    
    const moves = history.map((step, move) => {
      const coord = '(' + (1 + step.pos % 3) + ', ' + (1 + Math.floor((step.pos)/3)) + ')';
      const desc = move ?
        `Move #${move}: ${coord}` :
        'Start';
      return (
        <li key={move}>
          <button
            className={move===this.state.stepNumber ? 'history-highlight' : ''}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });
    const tMoves = this.state.useAscendingHistory ? moves : moves.slice().reverse();

    let status;
    let hlPos;
    if(winner){
      status = winner.player + ' won!';
      hlPos = winner.moves;
    } else if (this.state.stepNumber === 9) {
      status = 'Tied!';
      hlPos = [currentMove.pos];
    } else {
      status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
      hlPos = [currentMove.pos];
    }


    return (
      <div className="game-wrapper">
        <div className="game-header">
          <div className="game-title">React Tic Tac Toe</div>
          <div className="source-div">
            <a href='https://github.com/jamnguyen/ReactTutorial'>View Github</a>
          </div>
          <div className="game-notify">
            {status}
          </div>
        </div>
        <div className="game">
          <div className="game-board">
            <Board
              squares={currentMove.squares}
              onClick={(i) => this.handleClick(i)}
              highlight={hlPos}
            />
          </div>
          <div className="game-info">
            <div className="game-info-left">
              <div className="game-info-title">History</div>
              <button className="game-info-toggle" onClick={() => this.handleSortClick()}>Toggle order</button>
            </div>
            <div className="game-info-right">
              <ol>{tMoves}</ol>
            </div>
          </div>
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
