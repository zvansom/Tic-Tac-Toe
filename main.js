$(document).ready(function() {

  var singlePlayer;
  var easyMode;
  var winningCombinations = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7],
    [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
  var availableMoves = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  var currentPlayer;
  var playerOne = new Object();
    playerOne.symbol = 'X';
    playerOne.spacesOwned = [];
    playerOne.record = 0;
  var playerTwo = new Object();
    playerTwo.symbol = 'O';
    playerTwo.spacesOwned = [];
    playerTwo.record = 0;

  function assignSpace(spaceLocation) {
    // Check to see if space is already occupied.
    if(availableMoves.includes(spaceLocation)) {
      /*Assign the space to the current player, remove from available and
      print to screen.*/
      currentPlayer.spacesOwned.push(spaceLocation);
      availableMoves.splice(availableMoves.indexOf(spaceLocation), 1);
      $('#space' + spaceLocation).text(currentPlayer.symbol);
    } else {
      // If the space is in either player's array, ignore the input.
      return;
    }
    // Check if current player has won.
    checkForVictory();
  }

  function checkForVictory() {
    var winningMessage;
    // Search through the all of the winning combinations.
    winningCombinations.forEach(function(combination) {
      /*Check through each space in the combination and add to test if space is
      controlled by the current player.*/
      var test = combination.filter(function(space) {
        return currentPlayer.spacesOwned.includes(space);
      });
      // If test has three values in it, the current player has won.  End Game.
      if(test.length == 3) {
        winningMessage = currentPlayer.symbol + " Wins!";
        currentPlayer.record++;
        endGame(winningMessage);
      }
    });
    if(!winningMessage){
      if(playerOne.spacesOwned.length + playerTwo.spacesOwned.length < 9){
      // If there are unoccupied spaces, switch active players.
        switchPlayer();
      } else {
      // If all 9 spaces are occupied it's a draw.  End Game.
        var drawMessage = "It's a draw!";
        endGame(drawMessage);
      }
    }
  }

  function endGame(message) {
    $('#oTurnFlag').hide();
    $('#xTurnFlag').hide();
    $('#gamePage').css('display', 'none');
    $('#endScreen').css('display', 'block');
    $('#endMessage').text(message);
    $('#playerOneWins').text(playerOne.record);
    $('#playerTwoWins').text(playerTwo.record);
  }

  function switchPlayer() {
    if(currentPlayer == playerOne) {
      currentPlayer = playerTwo;
      $('#xTurnFlag').css({'display': 'none'});
      $('#oTurnFlag').css({'display': 'inline-block'});
      $('#oTurnFlag').animate({
        bottom: '5px'
      }, 'slow');
      if(singlePlayer) {
        computerPlayer();
      }
    } else {
      currentPlayer = playerOne;
      $('#oTurnFlag').css({'display': 'none'});
      $('#xTurnFlag').css({'display': 'inline-block'});
      $('#xTurnFlag').animate({
        bottom: '5px'
      }, 'slow');
    }
  }

  function startGame(){
    $('#endScreen').css('display', 'none');
    $('#difficulty').css('display', 'none');
    $('#titlePage').css('display', 'none');
    $('td').empty();
    $('#gamePage').css('display', 'block');
    $('#winRecord').css('display', 'block');

    playerOne.spacesOwned = [];
    playerTwo.spacesOwned = [];
    availableMoves = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    var startingPlayer = Math.floor(Math.random() * 2) + 1;
    if(startingPlayer == 1) {
      currentPlayer = playerOne;
      $('#xTurnFlag').css({'display': 'inline-block'});
      $('#xTurnFlag').animate({
        bottom: '5px'
      }, 'slow');
    } else {
      currentPlayer = playerTwo;
      $('#oTurnFlag').css({'display': 'inline-block'});
      $('#oTurnFlag').animate({
        bottom: '5px'
      }, 'slow');
      if(singlePlayer){
        computerPlayer();
      }
    }
  }

  function computerPlayer() {
    console.log("# of moves left: " + availableMoves.length);

    var computerMoveIndex = Math.floor(Math.random() * (availableMoves.length - 1));
    console.log("Index: " + computerMoveIndex);

    var computerMove;
    if(easyMode) {
      computerMove = availableMoves[computerMoveIndex];
      console.log("Computer's selected space: " + computerMove);

      assignSpace(computerMove);
    }
  }

  $('#restart').click(function() {
    startGame();
  });

  $('#onePlayer').click(function() {
    singlePlayer = true;
    $('#titlePage').css('display', 'none');
    $('#difficulty').css('display', 'block');
  });

  $('#easy').click(function() {
    easyMode = true;
    startGame();
  })

  $('#twoPlayer').click(function() {
    singlePlayer = false;
    startGame();
  });

  $('#space1').click(function() {
    assignSpace(1);
  });
  $('#space2').click(function() {
    assignSpace(2);
  });
  $('#space3').click(function() {
    assignSpace(3);
  });
  $('#space4').click(function() {
    assignSpace(4);
  });
  $('#space5').click(function() {
    assignSpace(5);
  });
  $('#space6').click(function() {
    assignSpace(6);
  });
  $('#space7').click(function() {
    assignSpace(7);
  });
  $('#space8').click(function() {
    assignSpace(8);
  });
  $('#space9').click(function() {
    assignSpace(9);
  });
});
