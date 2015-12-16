/* **** Global Variables **** */
// try to elminate these global variables in your project, these are here just to start.

function game() {
    this.playersGuess=0;
    this.winningNumber=-1;
    this.guessHistory=[];
    this.guessMessage='';
    this.maxGuesses=5;
    this.hintGuessNumber=-1;
    this.gameEndMessage='';
    this.colorChangeTimer='';
    this.remainingGuessesMessage='';
}

/* **** Guessing Game Functions **** */

// Generate the Winning Number

function generateWinningNumber(currentGame){
	currentGame.winningNumber = Math.floor((Math.random() * 100) + 1);
}

// Fetch the Players Guess

function playersGuessSubmission(currentGame){
	currentGame.playersGuess = (Number($('#inputGuess').val()));
    checkGuess(currentGame);
    $('#status').text(currentGame.guessMessage);
    $('#gameEnd').text(currentGame.gameEndMessage);
    $('#remainingGuesses').text(currentGame.remainingGuessesMessage);
    $('#inputGuess').val('');
    $('#hintText').text('');
    if (currentGame.gameEndMessage !== '') {
        gameEndAnimate(currentGame);
    }
}

// Determine if the next guess should be a lower or higher number

function lowerOrHigher(currentGame){
    var diff = Math.abs(currentGame.playersGuess - currentGame.winningNumber);
    var distance = '';
    var direction = '';
    
    if (currentGame.playersGuess > currentGame.winningNumber) {
        direction = 'higher'
    } else {
        direction = 'lower'
    }
    
	if (diff > 20) {
        distance = 'more than 20 digits away from';
    } else if (diff > 10) {
        distance = 'within 20 digits of';
    } else if (diff > 5) {
        distance = 'within 10 digits of';
    } else {
        distance = 'within 5 digits of';
    }
    return 'Your guess of ' + currentGame.playersGuess + ' is ' + direction + ' and ' + distance + ' the winning number.';
}

// Check if the Player's Guess is the winning number 

function checkGuess(currentGame){
    if (currentGame.playersGuess < 1 || currentGame.playersGuess > 100) {
        currentGame.guessMessage = 'You do not follow rules well!  Please guess a number between 1 and 100';
    } else if (currentGame.guessHistory.length > 0 && currentGame.guessHistory.indexOf(currentGame.playersGuess) !== -1) {
        currentGame.guessMessage = 'You already guessed ' + currentGame.playersGuess + '! Please guess again.';
    } else if (currentGame.playersGuess===currentGame.winningNumber) {
        currentGame.guessMessage = '';
        currentGame.gameEndMessage = 'You WON!!! The winning number was ' + currentGame.winningNumber;
        $('#btnGuess').prop('disabled', true);
        $('#inputGuess').prop('disabled', true);
        $('#btnHint').prop('disabled', true);
        currentGame.remainingGuessesMessage = ''
    } else if (currentGame.maxGuesses === currentGame.guessHistory.length + 1) {
        currentGame.guessMessage = '';
        currentGame.gameEndMessage = 'Too many guesses.  You LOST!!!  The correct number was ' + currentGame.winningNumber;
        $('#btnGuess').prop('disabled', true);
        $('#inputGuess').prop('disabled', true);
        $('#btnHint').prop('disabled', true);
        currentGame.remainingGuessesMessage = '';
    } else {
        currentGame.guessHistory.unshift(currentGame.playersGuess);
        currentGame.guessMessage = lowerOrHigher(currentGame);
        currentGame.remainingGuessesMessage = 'Remaining Guesses: ' + (currentGame.maxGuesses - currentGame.guessHistory.length)
    }
}

// Create a provide hint button that provides additional clues to the "Player"

function provideHint(currentGame){
    if (currentGame.hintGuessNumber === currentGame.guessHistory.length) {
        return
    }
    currentGame.hintGuessNumber = currentGame.guessHistory.length;
	var hintArr = [currentGame.winningNumber];
    var wrongGuess = 0;
    for (var x=1; x <= (currentGame.maxGuesses - currentGame.guessHistory.length); x++) {
        wrongGuess = currentGame.winningNumber;
        while (hintArr.indexOf(wrongGuess) !== -1) {
            wrongGuess = Math.floor((Math.random() * 100) + 1);
        }
        hintArr.unshift(wrongGuess);
    }
    hintArr.sort(function(a,b) { return (a-b) });
    $('#hintText').text('One of these values is the winning number, [' + hintArr + '], submit a guess!');
}

// Allow the "Player" to Play Again

function playAgain(currentGame){
	generateWinningNumber(currentGame);
    $('#status').text('');
    $('#gameEnd').text('');
    $('#remainingGuesses').text('');
    currentGame.guessHistory = [];
    currentGame.guessMessage = '';
    currentGame.gameEndMessage = '';
    currentGame.hintGuessNumber = -1;
    $('#hintText').text('');
    $('#btnGuess').prop('disabled', false);
    $('#inputGuess').prop('disabled', false);
    $('#btnHint').prop('disabled', false);
    if (currentGame.colorChangeTimer !== undefined) {
        clearInterval(currentGame.colorChangeTimer);
        currentGame.colorChangeTimer = undefined;
    }
}

function gameEndAnimate(currentGame) {
    var colorArray = ['blue', 'green', 'yellow', 'pink', 'violet', 'brown'];
    var currentColor = 0;
    $('#gameEnd').css({'font-size': 'x-large'});
    if (currentGame.maxGuesses !== currentGame.guessHistory.length + 1) {
        currentGame.colorChangeTimer = setInterval(function(){
            $('#gameEnd').css({'color': colorArray[currentColor % colorArray.length]});
            currentColor++;
        },1000);
    } else {
        $('#gameEnd').css({'color': 'red'});
    }
}

/* **** Event Listeners/Handlers ****  */
$(document).ready(function() {
    currentGame = new game();
    generateWinningNumber(currentGame);
    $('#btnGuess').on('click', function() {
        playersGuessSubmission(currentGame);

    });
    $('#inputGuess').keypress(function(event) {
        if (event.which == 13) {
            playersGuessSubmission(currentGame);
        }
    });
    $('#btnRestart').on('click', function() {
        playAgain(currentGame);
    });
    $('#btnHint').on('click', function() {
       provideHint(currentGame); 
    });
});
