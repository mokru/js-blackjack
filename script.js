const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class card {
  constructor(suit, value) {
    (this.suit = suit), (this.value = value), (this.hidden = true);
  }
}

class deck {
  constructor(cards) {
    this.cards = [];
  }
}

const suits = ["hearts", "clubs", "spades", "diamonds"];

function shuffle(array) {
  let currentIndex = array.length;
  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],array[currentIndex],
    ];
  }
}

function reveal(hand, index) {
  if (hand.cards[index - 1].hidden == true) {
    hand.cards[index - 1].hidden = false;
  } else {
    console.log(index + " card already revealed");
  }
}

function revealAll(hand) {
  hand.cards.forEach((card) => {
    if (card.hidden == true) {
      card.hidden = false;
    }
  });
}

function showHand(hand) {
  hand.cards.forEach((card) => {
    if (card.hidden == true) {
      console.log("??");
    } else {
      console.log(card.value + " " + card.suit);
    }
  });
}

function countHand(hand) {
  let sum = 0;
  let hiddenCards = false;
  hand.cards.forEach((card) => {
    if (card.hidden == true) {
      hiddenCards = true;
    } else {
      if (["J", "Q", "K"].includes(card.value)) {
        sum += 10;
      } else if ("A" == card.value) {
        if (sum >= 11) {
          sum += 1;
        } else {
          sum += 11;
        }
      } else {
        sum += card.value;
      }
    }
  });
  if (hiddenCards) {
    return ">" + sum;
  } else {
    return sum;
  }
}

function deal(from, to, count, faceUp) {
  for (let i = 0; i < count; i++) {
    if (faceUp) {
      from.cards[0].hidden = false;
    }
    to.cards.push(from.cards[0]);
    from.cards.shift();
  }
}

function drawTable() {
  playerSum = countHand(player);
  dealerSum = countHand(dealer);

  console.clear();
  console.log("Dealer has: ");
  showHand(dealer);
  console.log("(" + dealerSum + ")");
  console.log("Player has: ");
  showHand(player);
  console.log("(" + playerSum + ")");
}

function checkWin() {
  // Always update hand values before checking
  playerSum = countHand(player);
  dealerSum = countHand(dealer);

  //check if player won
  if (playerSum > 21) {
    drawTable();
    console.log("player Bust!");
    return true;
  }
  if (playerSum == 21) {
    revealAll(dealer);
    dealerSum = countHand(dealer);
    if (dealerSum == 21) {
      drawTable();
      console.log("push (dealer has blackjack)");
      return true;
    }
    drawTable();
    console.log("Blackjack! player wins!");
    return true;
  }

  if (playerStood) {
    revealAll(dealer);
    drawTable();
    dealerSum = countHand(dealer);
    while (dealerSum < 17) {
      deal(Deck, dealer, 1, true);
      drawTable();
      dealerSum = countHand(dealer);
    }
    if (dealerSum > 21) {
      drawTable();
      console.log("Dealer bust!");
      return true;
    }
    if (dealerSum == playerSum) {
      drawTable();
      console.log("Draw");
      return true;
    }
    if (dealerSum == 21) {
      drawTable();
      console.log("Dealer blackjack!");
      return true;
    }
    if (dealerSum < playerSum) {
      console.log("Player wins!");
      return true;
    } else {
      console.log("Dealer wins!");
      return true;
    }
  }
  return false;
}

function gameLoop() {
  if (checkWin()) {
    console.log("Game ended");
    rl.close();
    return;
  }
  drawTable();
  rl.question("Do you hit or stand? (hit/stand)", (answer) => {
    if (answer.toLowerCase() === "hit") {
      deal(Deck, player, 1, true);
    } else if (answer.toLowerCase() === "stand") {
      playerStood = true;
    } else {
      console.log("Invalid input. input 'hit' or 'stand'");
    }
    gameLoop();
  });
}

let Deck = new deck();
let dealer = new deck();
let player = new deck();
let gameSize = 4;

suits.forEach((suit) => {
  let count = 0;
  while (count <= gameSize) {
    for (let i = 2; i <= 14; i++) {
      let displayValue = i;
      if (i === 11) displayValue = "J";
      else if (i === 12) displayValue = "Q";
      else if (i === 13) displayValue = "K";
      else if (i === 14) displayValue = "A";
      Deck.cards.push(new card(suit, displayValue));
    }
    count++;
  }
});
shuffle(Deck.cards);

deal(Deck, dealer, 1, true);
deal(Deck, dealer, 1, false);
deal(Deck, player, 2, true);

let playerSum = countHand(player);
let dealerSum = countHand(dealer);
let playerStood = false;

if (!checkWin()) {
  gameLoop();
}
