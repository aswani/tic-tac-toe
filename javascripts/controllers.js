'use strict';

/* Controllers */

function GameCtrl($scope, $q, $timeout) {

	$scope.gameType = "hvh";
	//capture cell click event
	$scope.mark = function(index) {
		if ($scope.board.board[index][1] != "") return;
		$scope.game.markSquare(index)
	}

	$scope.play = function() {
		$scope.board = new Board();
		switch ($scope.gameType) {
			case 'cvc':
				//two computers 
				$scope.xPlayer = new WhiteQueenPlayer("X", $scope.board);
				$scope.oPlayer = new WhiteQueenPlayer("O", $scope.board);
				break;
			case 'hvc':
				//human vs computer
				$scope.xPlayer = new HumanPlayer("X", $scope.board);
				$scope.oPlayer = new WhiteQueenPlayer("O", $scope.board);
				break;
			default:
				//two human
				$scope.xPlayer = new HumanPlayer("X", $scope.board);
				$scope.oPlayer = new HumanPlayer("O", $scope.board);
		}

		$scope.game = new Game($scope.xPlayer, $scope.oPlayer, $scope.board, $timeout);
		//start the Game
		$scope.game.start(function(result) {
			// game result IS sent!!
			if (result != undefined) {
				alert(result);
				$scope.gameType = 'hvh' // rset the game
				$scope.play();
			};
		});
	}
	//stat the default game on page load 
	$scope.play();

}

var HumanPlayer = function(mark, board) {
	this.mark = mark;
	this.playerType = "Human";
}

/**
	WhiteQueen Player Impleminting Minimax Algo.

*/
var WhiteQueenPlayer = function(mark, board) {
	this.mark = mark;
	this.playerType = "Machine";
	this.opp = (this.mark == 'X') ? 'O' : 'X';
	// this.callBack;
	//return the best move
	this.play = function() {
		return this.getBestMove();
	}
	this.getBestMove = function() {
		console.info(board.prettyPrint());
		var best = this.minimax(board, mark, 6);
		console.info(best);
		return best[1];
		// console.info(score);
		// this.callBack(score[1]);
	}
	//Evaluation function
	this.evaluate = function(clone) {
		if (clone.weHaveWinner() == mark) {
			return 100 //best for me
		} else if (clone.weHaveWinner() == this.opp) {
			return -100 //bad for me
		} else if (clone.isFull()) {
			return 0 //tie
		}
		return undefined;
	}
	///recursive function
	this.minimax = function(board, player, depth) {
		var bestScore = (player == mark) ? -99999 : 99999;
		var bestMove = -1;
		var clone = board.copy();
		var moves = board.getPossibleMoves();

		var value = 0;
		//recursion
		for (var i = moves.length - 1; i >= 0; i--) {
			var move = moves[i];
			clone.board[move][1] = player;
			// console.info(clone.prettyPrint());
			var evaluation = this.evaluate(clone);
			//stopping condetion
			if (evaluation != undefined || depth == 0) {
				bestScore = evaluation;
				bestMove = move;
				break;
				//return [bestScore, bestMove];
			};
			if (player == mark) {
				var current = this.minimax(clone, this.opp, depth - 1)[0]
				if (current > bestScore) {
					bestScore = current;
					bestMove = move;

				}
			} else {
				var current = this.minimax(clone, mark, depth - 1)[0]
				if (current < bestScore) {
					bestScore = current;
					bestMove = move;
				}
			}
			clone.board[move][1] = '';

		}
		return [bestScore, bestMove]
	}
}

var Game = function(xPlayer, oPlayer, board, timeOut) {
	var _this = this;
	this.currPlayer = xPlayer;
	var callBack;
	this.start = function(callBack) {
		//callback function to announce the result
		this.callBack = callBack;
		//the cas of two machines
		if (oPlayer.playerType === 'Machine' && xPlayer.playerType === 'Machine') {
			while (board.weHaveWinner() == undefined && !board.isFull()) {
				board.board[this.currPlayer.play()][1] = this.currPlayer.mark;
				this.currPlayer = (this.currPlayer == xPlayer) ? oPlayer : xPlayer;
			}
			timeOut(function() {
				_this.callBack("The titans are Equal!!");
			}, 500);
		}

	}
	//intercept cell click with a mark
	this.markSquare = function(index) {
		//human vs Human
		if (oPlayer.playerType === 'Human' && xPlayer.playerType === 'Human') {
			board.board[index][1] = this.currPlayer.mark;
			var winner = board.weHaveWinner();
			if (winner != undefined) {
				announceWinner(winner);
			}
			//no more space
			if (board.isFull()) {
				tie();

			}
			this.currPlayer = (this.currPlayer == xPlayer) ? oPlayer : xPlayer;
		} else if (oPlayer.playerType != xPlayer.playerType) {
			board.board[index][1] = this.currPlayer.mark;
			if (board.isFull()) {
				if (board.isFull()) {
					tie();
					return;//break the loop
				}
			}
			this.currPlayer = (this.currPlayer == xPlayer) ? oPlayer : xPlayer;
			timeOut(function() {
				board.board[_this.currPlayer.play()][1] = _this.currPlayer.mark;
				var winner = board.weHaveWinner();
				if (winner != undefined) {
					announceWinner(winner);
				}
				//wont need here cause human plays first
				// if (board.isFull()) {
				// 	_this.callBack(this.callBack("Winner IS: ALL of US :D"));

				// }
				_this.currPlayer = (_this.currPlayer == xPlayer) ? oPlayer : xPlayer;
			}, 50);


		}
	}
	//some usefull methods

	function tie() {
		timeOut(function() {
			_this.callBack("Winner IS: ALL of US :D");
		}, 500);
	}

	function announceWinner(winner) {
		timeOut(function() {
			_this.callBack("Winner IS:" + winner)
		}, 500);
	}
}
// The BOARD Class
var Board = function() {
	this.board = [
		[0, ""],
		[0, ""],
		[0, ""],
		[0, ""],
		[0, ""],
		[0, ""],
		[0, ""],
		[0, ""],
		[0, ""]
	];
	this.wins = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];

	this.EMPTY = "";
	this.X = 1;
	this.O = 2;
}
Board.prototype = {
	getPossibleMoves: function() {
		var moves = [];
		for (var i = 0; i < 9; i++) {
			if (this.board[i][1] === this.EMPTY) {
				moves.push(i);
			}
		}
		return moves;
	},
	isFull: function() {
		for (var i = 0; i < 9; i++) {
			if (this.board[i][1] === this.EMPTY) {
				return false;
			}
		}
		this.callBack(undefined)
		return true;
	},
	isEmpty: function() {
		for (var i = 0; i < 9; i++) {
			if (this.board[i][1] != this.EMPTY) {
				return false;
			}
		}
		return true;
	},
	getSquare: function(index) {
		return this.board[index][1];
	},
	callBack: function() {},
	weHaveWinner: function() {

		this.w = this.wins;
		this.s = this.getSquare;
		for (var i = 0; i < 8; i++) {
			if (this.s(this.w[i][0]) === this.s(this.w[i][1]) && this.s(this.w[i][0]) === this.s(this.w[i][2]) && this.s(this.w[i][0]) != this.EMPTY) {
				this.callBack(this.s(this.w[i][0]));
				return this.s(this.w[i][0])
			}
		}
	},
	getWinner: function(callBack) {
		this.callBack = callBack;
	},
	copy: function() {
		var clone = new Board();
		angular.copy(this.board, clone.board);
		return clone;
	},
	prettyPrint: function() {
		var str = "";
		for (var i = 0; i < 9; i++) {
			str += ((i + 1) % 3 == 0) ? this.board[i][1] + "\n" : this.board[i][1];
		}
		return str;
	}

}