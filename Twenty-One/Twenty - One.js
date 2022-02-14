const READLINE = require("readline-sync");
const SUITS = ['♥', '♠', '♦', '♣'];
const CARD_VALUES = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
const WINNING_NUMBER = 21;
const MAX_SAFE_NUMBER = 17;
const FIGURES_VALUE = 10;
const ACE_DEFAULT_VALUE = 11;
const BETTING_ODDS = 2;

let playersHand = [];
let dealersHand = [];
let playersTotal = 0;
let dealersTotal = 0;
let option = 'hit';
let deck;
let bet;
let existingBet;
let amountOfMOney = 1000;
let regex = /\b[0-9][0-9]+\b/;

function displayCard(card) {
  if (card.length === 2) {
    console.log(`+------+`);
    console.log(`|      |`);
    console.log(`|  ${card}  |`);
    console.log(`|      |`);
    console.log(`+------+`);
  } else {
    console.log(`+------+`);
    console.log(`|      |`);
    console.log(`|  ${card} |`);
    console.log(`|      |`);
    console.log(`+------+`);
  }
}


function prompt(msg) {
  console.log(`=> ${msg}`);
}

function invalidInput(answer) {
  return answer !== 'y' && answer !== 'yes' && answer !== 'n' && answer !== 'no';
}

function invalidOption(option) {
  return option !== 'hit' && option !== 'stay';
}

function busted(total) {
  return total > WINNING_NUMBER;
}


function checkingInput() {
  prompt('Hit or Stay?');
  option = READLINE.question().toLowerCase();

  while (invalidOption(option)) {
    prompt ('Invalid option. Hit or Stay?');
    option = READLINE.question().toLowerCase();
  }
  console.clear();
  return option;
}


function initializeDeck(suits,values) {
  let deck = [];
  for (let index = 0; index < suits.length; index++) {
    for (let otherIndex = 0; otherIndex < values.length; otherIndex++) {
      deck.push([suits[index],values[otherIndex]]);
    }
  }
  return deck;
}

function shuffle(array) {
  for (let index = array.length - 1; index > 0; index--) {
    let otherIndex = Math.floor(Math.random() * (index + 1)); // 0 to index
    [array[index], array[otherIndex]] = [array[otherIndex], array[index]]; // swap elements
  }
  return array;
}


function firstDraw(hand, deck) {
  let firstCard = deck.shift().join("");
  let secondCard = deck.shift().join("");
  hand.push(firstCard, secondCard);
}


function displayWinner(playersTotal, dealersTotal) {
  if (playersTotal > WINNING_NUMBER) {
    return 'Dealer wins!';
  } else if (dealersTotal > WINNING_NUMBER) {
    return 'Player wins!';
  }
  if (playersTotal > dealersTotal) {
    return 'Player wins!';
  } else if (playersTotal < dealersTotal) {
    return 'Dealer wins!';
  } else {
    return 'That\'s really unfortunate. Dealer wins. :(';
  }
}

function computeSum(hand) {
  let total = 0;
  let totalAces = 0;
  for (let idx = 0; idx < hand.length; idx++) {
    let card = hand[idx];
    if (['K', 'Q', 'J'].includes(card[1])) {
      total += FIGURES_VALUE;
    } else if (card[1] === 'A') {
      total += ACE_DEFAULT_VALUE;
      totalAces += 1;
    } else {
      total += Number(card.slice(1));
    }
  }
  for (let idx = 0; idx < totalAces; idx++) {
    if (total > 21) total -= 10;
  }

  return total;
}


function invalidBet(bet) {
  return !regex.test(bet) || (bet < 50 || bet > amountOfMOney);
}

function welcomingPlayer() {
  console.clear();
  prompt('Welcome to Twenty-One!\nPress enter to start the game!');
  READLINE.question(); //i know it's wrong, but it works as supposed :P
  console.clear();
}

function gameLoading() {
  deck = initializeDeck(SUITS,CARD_VALUES);
  shuffle(deck);

  firstDraw(playersHand,deck);
  firstDraw(dealersHand,deck);
  return deck;
}


function earlyGameplay() {
  playersTotal = computeSum(playersHand);
  let card1 = playersHand[0];
  let card2 = playersHand[1];
  let dealersOpenCard = dealersHand[0]; //maybe use the opencard function

  displayCard(card1);
  displayCard(card2);
  prompt (`Your first two cards are: ${card1} and ${card2}`);
  prompt(`Your total is: ${playersTotal}.`);

  betting();

  displayCard(dealersOpenCard);
  prompt(`Dealer's open card is: ${dealersOpenCard}. His second card is hidden.`);
  checkingInput();
}

function playersGameplay(deck) {
  while (option !== 'stay' && !busted(playersTotal)) {

    let newCard = deck.shift().join("");
    playersHand.push(newCard);
    playersTotal = computeSum(playersHand);

    displayCard(newCard);
    prompt (`Your new card is ${newCard}! Your total is ${playersTotal}.`);
    if (playersTotal === 21) {
      prompt('BlackJack!');
      break;
    }

    if (busted(playersTotal)) break;

    checkingInput();
  }
}


function dealersGameplay(deck) {
  dealersTotal = computeSum(dealersHand);
  while (dealersTotal < MAX_SAFE_NUMBER && !busted(dealersTotal)) {
    let newCard = deck.shift().join("");
    dealersHand.push(newCard);
    dealersTotal = computeSum(dealersHand);
  }
  dealerRevealsCards(dealersHand);
}


function dealerRevealsCards(hand) {
  prompt('Dealer\'s turn is over.\nPress enter to reveal his cards.');
  READLINE.question();
  console.clear();
  for (let idx = 0; idx < hand.length; idx++) {
    let card = hand[idx];
    displayCard(card);
  }
}


function gameplay() {
  console.clear();
  welcomingPlayer();

  gameLoading();
  earlyGameplay();

  playersGameplay(deck);
  if (busted(playersTotal)) {
    prompt('You busted!');
    dealersTotal = computeSum(dealersHand);
  } else {
    dealersGameplay(deck);
    if (busted(dealersTotal)) prompt('Dealer burned himself!');
  }

  prompt(`You have ${playersTotal}. Dealer has ${dealersTotal}.`);
  prompt(displayWinner(playersTotal, dealersTotal));

}


function betting() {
  if (amountOfMOney >= 50) {
    prompt(`You have ${amountOfMOney}$ virtual money to bet versus the dealer.`);
    prompt('How much do you want to bet? (min. 50$)');
    bet = Number(READLINE.question());
    while (invalidBet(bet)) {
      prompt(`Invalid bet. You can bet up to ${amountOfMOney}$.(min. 50$)`);
      bet = Number(READLINE.question());
    }
    existingBet = true;
    amountOfMOney -= bet;
  } else {
    prompt('You don\'t have enough money to bet.');
    existingBet = false;
  }
}

//MAIN PROGRAM

while (true) {
  playersHand = [];
  dealersHand = [];

  gameplay();

  if (existingBet) {
    if (displayWinner(playersTotal, dealersTotal)[0] === 'P') {
      amountOfMOney += (bet * BETTING_ODDS);
      prompt(`You won your bet! Your earnings are ${bet * BETTING_ODDS}$ and your new total is: ${amountOfMOney}$.`);
    } else {
      prompt(`You lost your bet! You lost ${bet}$ and your new total is: ${amountOfMOney}$.`);
    }
  }

  prompt('Do you want to play again? (y/n)');
  let choice = READLINE.question().toLowerCase();

  while (invalidInput(choice)) {
    prompt('Invalid input. (y/n)');
    choice = READLINE.question().toLowerCase();
  }

  if (choice !== 'yes' && choice !== 'y') {
    console.clear();
    prompt("Thanks for playing Twenty-One! We'll be happy to see you again!");
    break;
  }
}
