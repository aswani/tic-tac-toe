describe('Game controllers', function() {

	describe('GameCtrl', function() {

		it('should create An empty bpard', function() {
			var scope = {},
			ctrl = new GameCtrl(scope);
			expect(scope.board).toBeDefined();
		});

		it('should create An empty bpard', function() {
			var scope = {},
			ctrl = new GameCtrl(scope);
			expect(scope.board).toBeDefined();
		});
	});
	describe('Board', function() {
		var board = new Board();

		it('should create An empty bpard', function() {
			expect(board.isEmpty()).toBe(true);
		});

		it('isfull() retuns false for non full boards', function() {
			fillBoard(board.board, [1, 4, 6], ['X', 'O', 'X']);
			expect(board.isEmpty()).not.toBe(true);
		});


		it('isfull() retuns true on full boards', function() {
			fillBoard(board.board, [0, 1, 2, 3, 4, 5, 6, 7, 8], ['X', 'O', 'X', 'X', 'O', 'X', 'X', 'O', 'X']);
			expect(board.isFull()).toBe(true);
		});
		it('We have winner retuns the winning Mark', function() {
			fillBoard(board.board, [0, 1, 2, 3, 4, 5, 6, 7, 8], ['X', 'X', 'X', 'X', 'O', 'X', 'X', 'O', 'X']);
			expect(board.weHaveWinner()).toBe('X');
		});

		it('We have winner retuns undefined when no winner', function() {
			fillBoard(board.board, [0, 1, 2, 3, 4, 5, 6, 7, 8], ['X', 'O', 'X', 'O', 'X', 'X', 'O', 'X', 'O']);
			expect(board.weHaveWinner()).toBeUndefined();
		});

		it('getSquare should return the Mark', function() {
			// var b=new Board();
			fillBoard(board.board, [0, 1, 2], ['X', 'X', 'X']);
			expect(board.getSquare(0)).toBe('X');
		});

		it('getPosibleMoves should return empty clls', function() {
			// var b=new Board();
			fillBoard(board.board, [0, 1, 2, 3, 5, 6, 8], ['X', 'O', 'X', 'O', 'X', 'X', 'O', 'X', 'O']);
			expect(board.getPossibleMoves()).toContain(4);
		});

		//tear down
		afterEach(function() {
			board.board = [
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				""];
		});
	});
	describe('WhiteQueenPlayer', function() {
		var machine;
		var board
		beforeEach(function(argument) {
			board = new Board();
			machine = new WhiteQueenPlayer('X', board);
		});
		it('should return cell #8 on empty bpard', function() {

			expect(machine.play()).toBe(4);
		});
		it('should block opponent action ', function() {
			fillBoard(board.board, [2, 4, 8], ['O', 'X', 'O']);
			expect(machine.play()).toBe(5);
		});
		it('should move to the winning position ', function() {
			fillBoard(board.board, [2, 4, 8], ['X', 'O', 'X']);
			expect(machine.play()).toBe(5);
		});
		it('evaluete return 100 when board announce winning for me ', function() {
			fillBoard(board.board, [2, 5, 8], ['X', 'X', 'X']);
			expect(machine.evaluate(board)).toBe(100);
		});
		it('evaluete return -100 when board announce winning for opponent', function() {
			fillBoard(board.board, [2, 5, 8], ['O', 'O', 'O']);
			expect(machine.evaluate(board)).toBe(-100);
		});
	});
	/*
		TODO Game class specs
	*/

});

function fillBoard(board, indces, values) {
	for (var i = indces.length - 1; i >= 0; i--) {
		board[indces[i]] = values[i];
	};
	return board;
}