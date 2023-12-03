let counterPlayer1 = 0;
let counterPlayer2 = 0;
var cardplayed = "";
var table = [
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0]
]


/* The Card class represents a playing card with a suit and number. */
class Card {
    constructor(suit,number) {
        this.suit = suit;
        this.number = number;
    }
    toString() {
        return this.number + " of " + this.suit;
    }
    get getSuit() {
        return this.suit;
    }
    get getNumber() {
        return this.number;
    }
}

/* The Deck class represents a deck of cards with different suits and numbers, and provides methods for
shuffling the deck and retrieving cards of a specific color. */
class Deck {
    constructor() {
            this.cards = []
            this.suits = ["Red", "Blue", "Yellow", "Green"];
            this.numbers = ["1","2", "3", "4", "5", "6","7","8","9"];
            for (let i in this.suits) {
                for (let y in this.numbers) {
                    this.cards.push(new Card(this.suits[i], this.numbers[y]));
                    this.cards.push(new Card(this.suits[i], this.numbers[y]));
                }
            }
    }
    
    Deckcolors(color) {
        this.deckPlayer = []
        for (let i in this.cards) {
            if ((this.cards[i].getSuit).localeCompare(color) == 0){
                this.deckPlayer.push(this.cards[i]);
            }
        }
       // console.log(this.deckPlayer)
        return(this.deckPlayer);
    }
    
    shuffle() {
        let currentIndex = this.cards.length,  randomIndex;
      
        // While there remain elements to shuffle.
        while (currentIndex > 0) {
      
          // Pick a remaining element.
          randomIndex = Math.round(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [this.cards[currentIndex], this.cards[randomIndex]] = [
            this.cards[randomIndex], this.cards[currentIndex]];
        }
      }
    
}

/* The Player class represents a player in a card game, with methods for managing their deck, shuffling
cards, selecting random cards, and playing cards on a game board. */
class Player {
    constructor(name,Deck,cardscolors) {
        this.deckPlayer = []
        this.name = name
        for (let i in cardscolors) {
            this.deckPlayer = Deck.Deckcolors(cardscolors[i]);
        }
        this.color = cardscolors[0]
    }
    get getCardsColor() {
        return(this.deckPlayer.toString());
    }
    get getColor() {
        return(this.color);
    } 
    get getName() {
        return (this.name.toString());
    } 
    newGame(Deck) {
        this.deckPlayer = Deck.Deckcolors(this.color);
    }
    shuffle() {
        let currentIndex = this.deckPlayer.length,  randomIndex;
      
        // While there remain elements to shuffle.
        while (currentIndex > 0) {
      
          // Pick a remaining element.
          randomIndex = Math.round(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [this.deckPlayer[currentIndex], this.deckPlayer[randomIndex]] = [
            this.deckPlayer[randomIndex], this.deckPlayer[currentIndex]];
        }
        }
        selectRandomCard() {
            let randomIndex = Math.floor(Math.random() * this.deckPlayer.length);
            console.log(this.deckPlayer)
            console.log("Random id " + randomIndex)
            return randomIndex;
        }
        getCardswithid(id) {
            return this.deckPlayer[id]
        }
        async addCardGrille(indexcards) {
            let tablecord = await whereCards()
            if (Playable(tablecord[0],tablecord[1])) {
                if (table[tablecord[0]][tablecord[1]] == 0) {
                    cardplayed = this.deckPlayer[indexcards].toString()
                    table[tablecord[0]][tablecord[1]] = this.deckPlayer[indexcards];
                    this.removeCard(indexcards)
                } else {
                    if (table[tablecord[0]][tablecord[1]].getNumber < this.deckPlayer[indexcards].getNumber) {
                        cardplayed = this.deckPlayer[indexcards].toString()
                        table[tablecord[0]][tablecord[1]] = this.deckPlayer[indexcards];
                        this.removeCard(indexcards)
                    } else {
                        await this.addCardGrille(indexcards)
                    }
                }
            } else {
                await this.addCardGrille(indexcards)
            }
        }
        begingGame(cord1,cord2) {
            let cardindex = this.selectRandomCard()
            table[cord1][cord2] = this.deckPlayer[cardindex]
            this.removeCard(cardindex)          
        }
        removeCard(cardindex) {
            this.deckPlayer.splice(cardindex, 1)
        }
    }

// Fonction qui permet de fais tourne le jeu :

/**
 * The Playable function checks if a given set of coordinates is within the range of a 10x10 grid.
 * @param cord1 - The `cord1` parameter represents the first coordinate value, which is expected to be
 * a number.
 * @param cord2 - The `cord2` parameter represents the second coordinate value.
 * @returns a boolean value.
 */

/**
 * The function "play" takes in form data and checks if both player names are filled, and if so,
 * initializes the players. If not, it displays a message asking to fill in the text fields.
 * @param formData - The formData parameter is an object that contains the data submitted from a form.
 * It likely includes the values entered in the "player1" and "player2" text fields.
 */
function play(formData) {
    Play1 = formData.player1;
    Play2 = formData.player2;
    if (Play1 != "" && Play2 != "") {
        initPlayer(Play1,Play2);
    } else {
        var divgrille = document.getElementById("message")
        var balise = "Fill the text fields with your nickname"
        divgrille.innerHTML = balise
    }
   
}


function Playable(cord1,cord2) {
    i = 0
    let bolean = false
    cord1 = parseInt(cord1)
    cord2 = parseInt(cord2)
    let tablecord =  [ 
                    [cord1,cord2],
                    [cord1+1,cord2+1],
                    [cord1-1,cord2-1],
                    [cord1+1,cord2-1],
                    [cord1-1,cord2+1],
                    [cord1+1,cord2],
                    [cord1,cord2+1],
                    [cord1-1,cord2],
                    [cord1,cord2-1]
                    ]
        console.log(tablecord.toString())
        while(i < tablecord.length && bolean == false ) {
            if (tablecord[i][0] < 11 && tablecord[i][0] >= 0 ) {
                if (tablecord[i][1] < 11 && tablecord[i][1] >= 0 ) {
                    bolean = isCard(tablecord[i][0],tablecord[i][1])
                }
            }
            i++;
        }
    return bolean
}

/**
 * The function "isCard" checks if a card exists at the specified coordinates on a table.
 * @param cord1 - The parameter `cord1` represents the row index of the card on the table.
 * @param cord2 - The parameter "cord2" represents the second coordinate of a card on a table.
 * @returns a boolean value. If the value at the specified coordinates in the table is 0, it will
 * return false. Otherwise, it will return true.
 */
function isCard(cord1,cord2) {
        if (table[cord1][cord2] == 0) {
            return false;
        } else {
            return true;
        }
    
}

/**
 * The function `getValueCords` takes an `id` parameter, splits it by comma, and assigns the first and
 * second parts to `actcord1` and `actcord2` respectively.
 * @param id - The `id` parameter is a string that contains two values separated by a comma.
 */
async function getValueCords(id) {
    const chars = id.split(',')
    actcord1 = chars[0]
    actcord2 = chars[1]
}


/**
 * The function `printTable` generates HTML code to display a table of buttons based on the values in
 * the `table` array.
 */
function printTable() {
    var divgrille = document.getElementById("Newgrille")
    var balise = ""
    for(var i=0 ; i < table.length ; i++) {
        balise  += "<div>"
        for (var j=0 ; j < table[i].length; j++){
            if (table[i][j] != 0) {
                console.log(table)
                balise  +="<button id=" + i + "," + j + " class='btn" + table[i][j].getSuit + "' onclick='getValueCords(id)'>" + table[i][j].getNumber + "</button>"
            } else  {
                balise  +="<button id=" + i + "," + j + " class='btn' onclick='getValueCords(id)'>0</button>"
            }
        }
        balise += "</div>" 
    }
    divgrille.innerHTML = balise
}

/**
 * The function `whereCards` returns a promise that resolves with an array of characters extracted from
 * the IDs of buttons when they are clicked.
 * @returns The function `whereCards()` is returning a Promise object.
 */
function whereCards() {
    return new Promise(function (resolve, reject) {
    document.querySelectorAll('button').forEach(button => {button.addEventListener('click', function (id) {
        const chars = button.id.split(',')
        actcord1 = chars[0]
        actcord2 = chars[1]
        resolve(chars);
      } )
        
      });
    });
  }


// Fonction de démarrage du jeu : 

/**
 * The function `initPlayer` initializes two players with shuffled decks and assigns them colors, then
 * reloads the game with the updated players and deck.
 * @param Name1 - The name of the first player.
 * @param Name2 - The parameter "Name2" is the name of the second player in the game.
 */
function initPlayer(Name1,Name2) {
    let deck = new Deck();
    deck.shuffle();
    var player1 = new Player(Name1,deck,["Red"]);
    var player2 = new Player(Name2,deck,["Green"]);
    reload(player1,player2,deck)
    //await player1.addCardGrille(player1.selectRandomCard())
    //printTable();
}

/**
 * The `reload` function initializes a game by creating a table, printing it, initializing players,
 * determining who starts, and then starting the game.
 * @param player1 - The `player1` parameter represents the first player in the game. It could be an
 * object or instance of a player class that contains methods and properties related to the player's
 * actions and state.
 * @param player2 - The parameter "player2" represents the second player in the game. It could be an
 * object or instance of a class that represents a player and contains methods and properties related
 * to the player's actions and state in the game.
 * @param Deck - The "Deck" parameter represents a deck of cards that will be used in the game. It is
 * likely an array or object that contains the cards and their properties (such as suit and value).
 */
async function reload(player1,player2,Deck) {
    table = [
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0]
    ]
    printTable();
    player1.newGame(Deck)
    player2.newGame(Deck)
    let started = Math.round(Math.random() * (2 - 1 ) + 1);
    if (started == 1) {
        player1.begingGame(5,5)
        started = 2
    } else {
        player2.begingGame(5,5)
        started = 1
    }
    printTable();
    console.log(table)
    await Game(player1,player2,started)

}



/**
 * The function "Game" is an asynchronous function that simulates a game between two players, where
 * they take turns playing cards and the winner is determined based on certain conditions.
 * @param player1 - The `player1` parameter represents the first player in the game. It could be an
 * object or instance of a player class that has methods and properties related to the player's actions
 * and attributes.
 * @param player2 - The `player2` parameter in the `Game` function represents the second player in the
 * game. It is an object that should have certain methods and properties defined in order to play the
 * game correctly. The specific implementation of the `Player` class or object is not provided in the
 * code snippet, so
 * @param started - The "started" parameter is a variable that keeps track of which player's turn it
 * is. It starts with a value of 1 and alternates between 1 and 2 as the game progresses.
 */
async function Game(player1,player2,started) {
    var champtxt = document.getElementById("Champ")
    var victoiretxt = document.getElementById("Victoire")
    var restart = document.getElementById("BontonRestrat")
    var boutonResart = '<form action="/" method="get"><button type="submit" class="play-button">Restart</button></form>'
   // victoiretxt.innerHTML = "Victoire Player 1 : " + counterPlayer1 + " Victoire Player 2: " + counterPlayer2;
    let puissance = false;
    let cardTemp;
    printTable();
        while (puissance == false) {
            if (started == 1) {
                cardTemp =  player1.selectRandomCard()
                console.log("Test cardTemp: " + player1.getCardswithid(cardTemp));
                champtxt.innerHTML = player1.getName + " to Play : " +  player1.getCardswithid(cardTemp);
                await player1.addCardGrille(cardTemp);
                printTable();
                puissance = checkWin(player1,table);
                if (puissance) {
                    counterPlayer1++;
                }
                started++;
            }
            if (started == 2 && puissance == false ) {
                cardTemp =  player2.selectRandomCard();
                champtxt.innerHTML = player2.getName + "  to Play : " +  player2.getCardswithid(cardTemp);
                await player2.addCardGrille(cardTemp);
                printTable();
                puissance = checkWin(player2,table)
                if (puissance) {
                    counterPlayer2++;
                }
                started--;
            }
    }
    victoiretxt.innerHTML = "Round win " + player1.getName + " : " + counterPlayer1 + "\nRound win " + player2.getName + " : "  + counterPlayer2;
    if (counterPlayer1 == 2) {
        champtxt.innerHTML = player1.getName + " Win";
        fetchWinner(player1.getName,player2.getName, player1.getName)
        restart.innerHTML = boutonResart
    } else if (counterPlayer2 == 2) {
        champtxt.innerHTML = player2.getName + " Win";
        fetchWinner(player2.getName,player2.getName,player1.getName)
        restart.innerHTML = boutonResart
    } else {
        reload(player1,player2,new Deck())
    }  
}

/**
 * The fetchWinner function sends a POST request to the server with the winner's name and the names of
 * the two players.
 * @param NamePlayerWin - The parameter "NamePlayerWin" represents the name of the player who won the
 * game.
 * @param player2 - The parameter "player2" represents the name or identifier of the second player in
 * the game.
 * @param player1 - The parameter "player1" represents the name or information of the first player in a
 * game or competition.
 */
function fetchWinner(NamePlayerWin, player2, player1) {
    const winner = {
      'player1': player1,
      'player2': player2,
      'whowin': NamePlayerWin  
    };
    console.log(winner);
    fetch('/saveWinner', {
      method: 'POST',
      body: JSON.stringify(winner),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }            
    })
    .then(response => response.json())
    .then(data => {
      console.log('Réponse du serveur :', data);
    })
    .catch(error => {
      console.error('Erreur lors de la requête fetch :', error);
    });

  }

   /**
    * The function `checkWin` checks if a player has won in a game by checking the rows, columns, and
    * diagonals of a table.
    * @param player - The player parameter represents the player object, which likely has properties
    * such as "getColor" that returns the color of the player's cards.
    * @param table - The `table` parameter is a 2-dimensional array representing a game board. Each
    * element in the array represents a card on the board.
    * @returns a boolean value. It returns true if the player has won the game, and false otherwise.
    */
    function checkWin(player, table) {
        // Vérification des rangées horizontales
        for (let row = 0; row < table.length; row++) {
          for (let col = 0; col <= table[row].length - 4; col++) {
            const slice = table[row].slice(col, col + 4);
            if (slice.every(card => card.getSuit === player.getColor)) {
              return true;
            }
          }
        }
      
        // Vérification des colonnes
        for (let col = 0; col < table[0].length; col++) {
          for (let row = 0; row <= table.length - 4; row++) {
            const slice = [];
            for (let i = 0; i < 4; i++) {
              slice.push(table[row + i][col]);
            }
            if (slice.every(card => card.getSuit === player.getColor)) {
              return true; 
            }
          }
        }
    
        // Vérification des diagonales
        for (let row = 0; row <= table.length - 4; row++) {
          for (let col = 0; col <= table[row].length - 4; col++) {
            const slice1 = [];
            const slice2 = [];
            for (let i = 0; i < 4; i++) {
              slice1.push(table[row + i][col + i]); // Diagonale de gauche à droite
              slice2.push(table[row + i][col + 3 - i]); // Diagonale de droite à gauche
            }
            if (slice1.every(card => card.getSuit === player.getColor) || slice2.every(card => card.getSuit === player.getColor)) {
              return true; 
            }
          }
        }
        return false; 
}
// Start Game ! 
play(formData)
