//Assignment: Mortgage Loan Calculator

const READLINE = require('readline-sync');
const MESSAGES = require('./mortgage_messages.json');

function prompt(key) {
  console.log(`*** ${key} ***`);
}

function invalidYears(value) {
  return value <= 0 || value > 25 || !Number.isInteger(value);
}
function invalidAnnualPerRate(value) {
  return value <= 0 || value > 100 || Number.isNaN(value);
}

function invalidAmountOfMoney(value) {
  return value < 10000 || value > 200000 || Number.isNaN(value);
}

prompt(MESSAGES["welcome"]);

prompt('Do you want to compute your mortgage monthly payment? (y/n)');
let answer = (READLINE.question()).toLowerCase();

if (answer !== 'y' && answer !== 'yes') {
  prompt('No problem!Have a nice day!');
}

while (answer === 'y' || answer === 'yes') {

  prompt('See what it takes to get your dream house in 3 steps!');

  prompt(MESSAGES["askAmountMoney"]);
  let loanAmount = Number(READLINE.question());

  while (invalidAmountOfMoney(loanAmount)) {
    prompt(MESSAGES["invalidMoney"]);
    loanAmount = Number(READLINE.question());
  }

  prompt(MESSAGES["askYears"]);
  let duration = Number(READLINE.question());

  while (invalidYears(duration)) {
    prompt(MESSAGES["invalidYears"]);
    duration = Number(READLINE.question(),10);
  }

  prompt(MESSAGES["askAPR"]);
  let annualPercentageRate = (parseFloat(READLINE.question()) / 100 );

  while (invalidAnnualPerRate(annualPercentageRate)) {
    prompt(MESSAGES["invalidAPR"]);
    annualPercentageRate = (parseFloat(READLINE.question()) / 100);
  }

  let loanDuration = duration * 12;
  let monthlyIntRate = annualPercentageRate / 12;

  let monthlyPayment = loanAmount *
  (monthlyIntRate / (1 - Math.pow((1 + monthlyIntRate), (-loanDuration))));

  let totalAmount = (monthlyPayment * loanDuration).toFixed(2);
  let totalInterest = (totalAmount - loanAmount).toFixed(2);

  prompt(`Your monthly payment is: $${monthlyPayment.toFixed(2)} `);
  prompt(`The total amount of money you have to return is: $${totalAmount}`);
  prompt(`Your total interest is: $${totalInterest}`);

  prompt('Do you want to perform another calculation? (y/n)');
  answer = (READLINE.question()).toLowerCase();
  if (answer !== 'y' && answer !== 'yes') {
    console.clear();
  }
}