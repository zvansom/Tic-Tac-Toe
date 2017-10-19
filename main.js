$(document).ready(function() {

  var singlePlayer;
  var easyMode;
  var endOfGame = false;

  var board;
  var currentPlayer;

  var playerOne = new Object();
    playerOne.symbol = 'X';
    playerOne.record = 0;

  var playerTwo = new Object();
    playerTwo.symbol = 'O';
    playerTwo.record = 0;

  var movesRemaining = [];
  var scores = [];

  function endGame(message) {
    // Display Game Over screen with message of game outcome.
    $('#oTurnFlag').hide();
    $('#xTurnFlag').hide();
    $('#gamePage').css('display', 'none');
    $('#endScreen').css('display', 'block');
    $('#endMessage').text(message);
    $('#playerOneWins').text(playerOne.record);
    $('#playerTwoWins').text(playerTwo.record);
  }

  function validMovesRemaining(){
    // Look at all of the positions on the board
    movesRemaining = board.filter(function(position) {
      // If the position is a number, it is still available.
      if(Number.isInteger(position)){
        return position || position == 0;
      }
    });
    return movesRemaining;
  }

  function checkForVictory() {
    /* Each time this function is called, it looks for all winning combinations
    (it will look for more than one way to win). If there is a win, it adds 10
    points to the score which is returned at the end of the function.  If there
    are no moves left, it returns 1 (to avoid falsy values). */
    var victoryScore = 0;
    // Check rows for winning conditions.
    for(var row = 0; row < 8; row += 3){
      if(board[row] == board[row + 1] && board[row + 1] == board[row + 2]){
        victoryScore += 10;
      }
    }
    // Check columns for winning conditions.
    for(var col = 0; col < 3; col++){
      if(board[col] == board[col + 3] && board[col + 3] == board[col + 6]){
        victoryScore += 10;
      }
    }
    //Check diagonals for winning conditions.
    if((board[0] == board[4] && board[4] == board[8]) ||
       (board[2] == board[4] && board[4] == board[6])) {
        victoryScore += 10;
    }
    // Check what moves are available.
    movesRemaining = validMovesRemaining();
    /* If there are no moves left the game is a draw. */
    if(!movesRemaining.length){
      victoryScore += 1;
    }
    return victoryScore;
  }

  function assignSpace(spaceLocation) {
    // Check to see if space is already occupied.
    if(Number.isInteger(board[spaceLocation])) {
      /*Assign the space to the current player, remove from available and
      print to screen.*/
      board[spaceLocation] = currentPlayer.symbol;
      $('#space' + spaceLocation).text(currentPlayer.symbol);
    } else {
      // If the space is in either player's array, ignore the input.
      return false;
    }
    // Check if current player has won.
    var boardScore = checkForVictory();
    // If the score is 10 or more, the current player has won the game.
    if(boardScore >= 10){
      // Increment the winning player's record and end the game.
      endOfGame = true;
      currentPlayer.record++;
      endGame(currentPlayer.symbol + " Wins!");
    } else if(boardScore == 1){
      // If the score is 1 the game is a tie.
      endOfGame = true;
      endGame("It's a draw.");
    }
    // If the game is not over, switch the active player.
    if(!endOfGame){
      switchPlayer();
    }
  }

  function minimax(availableMoves, depth) {
    /* This function will return an array of scores with corresponding indexes
    with the moves available. */
    scores = availableMoves.map(function(position) {
      var score;
      /* If depth of recursion is an odd number, it represents potential moves
      for the computer player ('O'), and should return the minmum of the
      recursed array. */
      if(depth % 2 > 0) {
        // Assign the current position to 'O'.
        board[position] = 'O';
        // Check if this is a winning move.
        score = checkForVictory();
        // If this is a winning move, return the score.
        if(score) {
          board[position] = position;
          return score - depth;
        } else {
          /* Otherwise, update the array of available moves and recurse while
          incrementing depth.  Return the minimum value from the recursion.
          Return the board to it's previous condition. */
          var best;
          var newAvailMoves = validMovesRemaining();
          best = minimax(newAvailMoves, depth + 1).reduce(function(a, b){
            return Math.min(a, b);
          });
            board[position] = position;
            return best;
        }
        // Always reset the board to it's previous condition.
        board[position] = position;

      } else if(depth % 2 == 0) {
        board[position] = 'X';
        // Check if this is a winning move.
        score = checkForVictory();
        /* If this is a winning move, return the score and return the board to
        it's previous condition. */
        if(score) {
          board[position] = position;
          return depth - score;
        } else {
          /* Otherwise, update the array of available moves and recurse while
          incrementing depth.  Return the maximum value from the recursion.
          Return the board to it's previous condition. */
          var best;
          var newAvailMoves = validMovesRemaining();
          best = minimax(newAvailMoves, depth + 1).reduce(function(a, b){
            return Math.max(a, b);
          });
          board[position] = position;
          return best;
        }
        // Always reset the board to it's previous condition.
        board[position] = position;
      }
    });
    return scores;
  }

  function computerPlayer() {
    // Check what moves are available.
    movesRemaining = validMovesRemaining();
    /* If game is on easy mode OR the computer is the first to go,
    pick a random spot from the remaining moves.  This helps ensure variety in
    games on hard mode. */
    if(easyMode || movesRemaining.length == 9) {
    var computerMoveIndex = Math.floor(Math.random() * (movesRemaining.length));
      /* If hard mode, disallow moves to 1, 3, 5 or 7. (Starting moves in these
      spaces could allow the player to win.) */
      if(!easyMode && computerMoveIndex % 2 > 0) {
        computerMoveIndex--;
      }
      assignSpace(movesRemaining[computerMoveIndex]);
    } else {
      // Collect scores based on the available moves.
      scores = minimax(movesRemaining, 1);
      // console.log("Score array from minimax: " + scores);
      movesRemaining = validMovesRemaining();
      // Get the best score.
      var maxScore = scores.reduce(function(a, b) {
        return Math.max(a, b);
      });
      // Find the index of the best score.
      var maxScoreIndex = scores.indexOf(maxScore);
      // Assign the move at the max score index.
      assignSpace(movesRemaining[maxScoreIndex]);
    }
  }

  function switchPlayer() {
    // Switch the active player and switch which player's flag is displayed.
    if(currentPlayer == playerOne) {
      currentPlayer = playerTwo;
      $('#xTurnFlag').css({'display': 'none'});
      $('#oTurnFlag').css({'display': 'inline-block'});
      $('#oTurnFlag').animate({
        bottom: '5px'
      }, 'slow');
      if(singlePlayer) {
        // If one player game, tell the computer player to act.
        var timeoutID = setTimeout(computerPlayer, 500);
      }
    } else {
      currentPlayer = playerOne;
      $('#xTurnFlag').css({'display': 'inline-block'});
      $('#oTurnFlag').css({'display': 'none'});
      $('#xTurnFlag').animate({
        bottom: '5px'
      }, 'slow');
    }
  }

  function startGame(){
    // Reset the screen to display a blank game board.
    $('#endScreen').css('display', 'none');
    $('#difficulty').css('display', 'none');
    $('#titlePage').css('display', 'none');
    $('td').empty();
    $('#gamePage').css('display', 'block');
    $('#winRecord').css('display', 'block');

    // Reset variables to starting values.
    endOfGame = false;
    board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    // Determine starting player with random number between 0 and 1;
    var startingPlayer = Math.floor(Math.random() * 2);
    // Current Player set to inverse and switched to reuse jQuery calls.
    if(startingPlayer == 0) {
      currentPlayer = playerTwo;
      switchPlayer();
    } else {
      currentPlayer = playerOne;
      switchPlayer();
    }
  }

  // On game over screen, when 'New Game' button is clicked, start game.
  $('#restart').click(function() {
    startGame();
  });

  /* When 'One Player' button is clicked, turn single player on, reset screen to
    difficulty page.*/
  $('#onePlayer').click(function() {
    singlePlayer = true;
    $('#playerTwoName').text('Computer: ');
    $('#titlePage').css('display', 'none');
    $('#difficulty').css('display', 'block');
  });

  // When 'Two Player' button is clicked, turn single player off and start game.
  $('#twoPlayer').click(function() {
    singlePlayer = false;
    startGame();
  });

  // When 'Easy' difficulty button is clicked, turn easy mode on and start game.
  $('#easy').click(function() {
    easyMode = true;
    startGame();
  });

  // When 'Hard' difficulty button is clicked, turn easy mode off and start game.
  $('#hard').click(function() {
    easyMode = false;
    startGame();
  });

  /* When it is the player's turn or when two players, when a space is clicked,
   send the space id to check for input and assign the space. */
  $('#space0').click(function() {
    if(singlePlayer == false || (singlePlayer && currentPlayer.symbol !== 'O')) {
      assignSpace(0);
    }
  });
  $('#space1').click(function() {
    if(singlePlayer == false || (singlePlayer && currentPlayer.symbol !== 'O')) {
      assignSpace(1);
    }
  });
  $('#space2').click(function() {
    if(singlePlayer == false || (singlePlayer && currentPlayer.symbol !== 'O')) {
      assignSpace(2);
    }
  });
  $('#space3').click(function() {
    if(singlePlayer == false || (singlePlayer && currentPlayer.symbol !== 'O')) {
      assignSpace(3);
    }
  });
  $('#space4').click(function() {
    if(singlePlayer == false || (singlePlayer && currentPlayer.symbol !== 'O')) {
      assignSpace(4);
    }
  });
  $('#space5').click(function() {
    if(singlePlayer == false || (singlePlayer && currentPlayer.symbol !== 'O')) {
      assignSpace(5);
    }
  });
  $('#space6').click(function() {
    if(singlePlayer == false || (singlePlayer && currentPlayer.symbol !== 'O')) {
      assignSpace(6);
    }
  });
  $('#space7').click(function() {
    if(singlePlayer == false || (singlePlayer && currentPlayer.symbol !== 'O')) {
      assignSpace(7);
    }
  });
  $('#space8').click(function() {
    if(singlePlayer == false || (singlePlayer && currentPlayer.symbol !== 'O')) {
      assignSpace(8);
    }
  });
});
