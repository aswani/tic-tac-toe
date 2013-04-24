'use strict';

/* Controllers */

function GameCtrl($scope,$q,$timeout) {
	$scope.board = new Board();
	$scope.xPlayer = new HumanPlayer("O", $scope.board);
	$scope.oPlayer = new WhiteQueenPlayer("X", $scope.board);

	$scope.game = new Game($scope.xPlayer, $scope.oPlayer, $scope.board,$q,$timeout);
	$scope.mark = function(index) {
		if ($scope.board.board[index][1] != "") return;
		if ($scope.xPlayer.playerType=='Human') {;$scope.xPlayer.markSquare(index);}
		if ($scope.oPlayer.playerType=='Human') {;$scope.oPlayer.markSquare(index);}
		// $scope.oPlayer.markSquare(index)
	};
	$scope.game.start();
	$scope.gameType = "hvh";
	$scope.board.getWinner(function(win) {
		var winner=(win==undefined)? "Game Is Tie":"Winner Is "+win;
		alert(winner);
	$scope.board=new Board();
	})
}

var HumanPlayer = function(mark, board) {
	this.mark = mark;
	this.playerType = "Human";
	this.callBack;
	this.markSquare = function(index) {
		this.callBack(index);
	}
	this.play = function(callBack) {
		this.callBack = callBack;
	}

}
/**
	WhiteQueen Player Impleminting Minimax Algo.

*/
var WhiteQueenPlayer = function(mark, board) {
	this.mark = mark;
	this.playerType = "Machine";
	this.opp = (this.mark == 'X') ? 'O' : 'X';
	this.callBack;
	//return the best move
	this.play = function(callBack) {
		this.callBack = callBack;
		this.getBestMove();
	}
	this.getBestMove = function() {
		console.info(board.prettyPrint());
		if (board.isEmpty()) {this.callBack(4);return}
		var bestMove = null;
		var score = this.minimax(board, mark, 6);
		console.info(score);
		this.callBack(score[1]);
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
			console.info(clone.prettyPrint());
			var evaluation = this.evaluate(clone);
			//stopping condetion
			if (evaluation != undefined || depth == 0) {
				bestScore = evaluation;
				bestMove = move;
				break;
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

var Game = function(xPlayer, oPlayer, board,q,timeOut) {
	// board.board[0][1] = 'O';
	// board.board[1][1] = 'X';
	// board.board[2][1] = 'X';
	// board.board[3][1] = '-';
	// board.board[4][1] = '-';
	// board.board[5][1] = '-';
	// board.board[6][1] = 'O';
	// board.board[7][1] = 'O';
	// board.board[8][1] = 'X';
	this.currPlayer = xPlayer;
	this.start = function() {
		play(xPlayer, oPlayer);
	}
	var play = function(player, opp) {
		var index;
		player.play(function(move) {
			index = move;
			board.board[index][1] = player.mark;
			if (board.weHaveWinner()==undefined||!board.isFull()) {
				play(opp,player);
			}
		});
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
		 angular.copy(this.board,clone.board);
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