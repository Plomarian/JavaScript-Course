const readline = require('readline-sync');
const VALID_CHOICES = ['rock', 'paper', 'scissors', 'lizard', 'spock'];

const CHOICES = {
  r: 'rock',
  p: 'paper',
  s: 'scissors',
  l: 'lizard',
  v: 'spock'
};

let userWins = 0;
let pcWins = 0;
let ties = 0;

function prompt(message) {
  console.log(`=> ${message}`);
}

function playerWins(choice, computerChoice) {
  return (choice === 'rock' && computerChoice === 'scissors') ||
         (choice === 'rock' && computerChoice === 'lizard') ||
         (choice === 'paper' && computerChoice === 'rock') ||
         (choice === 'paper' && computerChoice === 'spock') ||
         (choice === 'scissors' && computerChoice === 'paper') ||
         (choice === 'scissors' && computerChoice === 'lizard') ||
         (choice === 'lizard' && computerChoice === 'paper') ||
         (choice === 'lizard' && computerChoice === 'spock') ||
         (choice === 'spock' && computerChoice === 'rock') ||
         (choice === 'spock' && computerChoice === 'scissors');
}

function displayWinner(choice, computerChoice) {
  prompt(`Your choice is: ${choice.charAt(0).toUpperCase() + choice.slice(1)}. Computer's choice is: ${computerChoice.charAt(0).toUpperCase() + computerChoice.slice(1)}.`);
  if (playerWins(choice, computerChoice)) {
    prompt('You win!');
    userWins += 1;
  } else if (choice === computerChoice) {
    prompt("It's a tie!");
    ties += 1;
  } else {
    prompt("Computer wins!");
    pcWins += 1;
  }
}

//Main Program
prompt('Do you want to play a game? (y/n)');
let answer = readline.question().toLowerCase();

while (answer !== 'n' && answer !== 'y' && answer !== 'no' && answer !== 'yes') {
  prompt('Please enter "y" or "n".');
  answer = readline.question().toLowerCase();
}
if (answer === 'n' || answer === 'no') console.clear();

while (answer === 'y' || answer === 'yes') {
  prompt(`Welcome to Rock-Paper-Scissors-Lizard-Spock game!\nYour options are: ${VALID_CHOICES.join(', ')}.`);
  prompt("Type 'r' for rock, 's' for scissors, 'p' for paper, 'l' for lizard and 'v' for spock!");
  let choice = CHOICES[readline.question().toLowerCase()];

  while (!VALID_CHOICES.includes(choice)) {
    prompt("That's not a valid choice");
    choice = CHOICES[readline.question().toLowerCase()];
  }

  let randomIndex = Math.floor(Math.random() * VALID_CHOICES.length);
  let computerChoice = VALID_CHOICES[randomIndex];

  displayWinner(choice, computerChoice);
  prompt(`OVERALL SCORE:\nWins: ${userWins}. Losses: ${pcWins}. Ties: ${ties}.`);

  if (userWins === 5) {
    prompt('Congratulations! You won!');
    break;
  } else if (pcWins === 5) {
    prompt("That's unfortunate!You lost.");
    break;
  }

  prompt('Do you want to play again (y/n)?');
  answer = readline.question().toLowerCase();
  while (answer !== 'n' && answer !== 'y' && answer !== 'no' && answer !== 'yes') {
    prompt('Please enter "y" or "n".');
    answer = readline.question().toLowerCase();
  }
  if (answer === 'n' || answer === 'no') console.clear();
}