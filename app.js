const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8081;
// sequelize BDD
const { QueryTypes } = require('sequelize');
const initBDD = require('./models');
/* The code is initializing a SQL database connection using the `initBDD` function. 
It returns an object that contains the Sequelize models for the SQL database. */
  const dbmysql = initBDD("mysql")
  const playerMysql = dbmysql.player
  const partieMysql = dbmysql.partie
  const dbsqllite = initBDD("sqlite")
  const playersqlite = dbsqllite.player
  const partieqsqlite = dbsqllite.partie
 
// mongodb BDD
const mongoose = require('mongoose')
const { Schema, model } = mongoose; 
const mongoDBUrl = 'mongodb://localhost:27017/punto'; 
mongoose.connect(mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const dbmongo = mongoose.connection;
dbmongo.on('error', console.error.bind(console, 'Erreur de connexion MongoDB:'));
dbmongo.once('open', function() {
    console.log('Connecté à la base de données MongoDB');
});

const PartieSchema = new Schema({
  Player1: String,
  Player2: String,
  whowin: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Partie = model('Partie', PartieSchema);

const neo4j = require('neo4j-driver')

const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('TestAdmin', 'azertyuiop'))


/**
 * The function creates a player node in a Neo4j database if it doesn't already exist.
 * @param namePlayer1 - The parameter "namePlayer1" is the name of the player that you want to create
 * in the database.
 */
async function createPlayer(namePlayer1) {
  const session = driver.session()
  var inBDD; 
  var singleRecord;
  try {
    inBDD = await session.run(
      'MATCH (n:Player {name: $name}) RETURN n',
      { name: namePlayer1 }
    )
    singleRecord = inBDD.records[0]
    if (singleRecord == undefined) {
      result = await session.run(
        'CREATE (a:Player {name: $name}) RETURN a',
        { name: namePlayer1 }
      )
      console.log("Create New Player "  + namePlayer1)
    } else {
      console.log("Player it was created"  + namePlayer1)
    }
  } finally {
    await session.close()
  }
}

/**
 * The function `createPartie` creates a new game session in a graph database, connects the players to
 * the session, and records the winner of the session.
 * @param namePlayer1 - The name of the first player in the game.
 * @param namePlayer2 - The name of the second player in the game.
 * @param whowin - The parameter "whowin" represents the name of the player who won the game.
 */
async function createPartie(namePlayer1,namePlayer2,whowin) {
  const session = driver.session(); 
  var result; 
  var mydate = new Date();
  const date = mydate.toISOString()
  try {
      result = await session.run(
        'CREATE (a:Partie {date: $date}) RETURN a;',
        { date: date }
      )
      result = await session.run(
        'MATCH (b:Player { name: $namePlayer}),(a:Partie { date: $date}) CREATE (b)-[:PARTIEIN]->(a) RETURN b,a;',
        { date: date, namePlayer: namePlayer2  }
      )
      
      result = await session.run(
        'MATCH (a:Partie {date: $date}),(b:Player { name: $namePlayer}) CREATE (b)-[:PARTIEIN]->(a) RETURN a,b',
        { date: date, namePlayer: namePlayer1  }
      )
      result = await session.run(
        'MATCH (a:Partie {date: $date}),(n:Player { name: $whowin}) CREATE (a)-[:WIN]->(n) RETURN a,n',
        { date: date, whowin: whowin }
      )
    console.log("New Partie with " + date)
  } finally {
    await session.close()
  }
}

// Choix de la BDD
var whoBdd = "";
//form data
app.use(express.urlencoded({extended: true}))
app.use(express.json());
// set up ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public');
app.use(express.static(__dirname + '/public'));

// routes 
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(port, () => {
  console.log(`Server is listening on port http//localhost:${port}...`);
});


/* The above code is a route handler for a POST request to the '/add' endpoint. It receives form data
from the request body and performs different actions based on the value of the 'database' field in
the form data. */
app.post('/add', (req, res) => {
  const formData = req.body;
  whoBdd = formData.database
  // Query Mysql
  if (whoBdd == 'MySQL') {
    dbmysql.sequelize.sync().then(async () => {
      playerMysql.create({
        nom: formData.player1
      }).then(res => {
        console.log("New Player added in Mysql")
        console.log(res.dataValues)
      }).catch((error) => {
          console.error('Failed to create a new player : ', error);
      });
  
      playerMysql.create({
        nom: formData.player2
      }).then(res => {
        console.log("New Player added in Mysql")
        console.log(res.dataValues)
      }).catch((error) => {
          console.error('Failed to create a new player : ', error);
      });
    
    });

    //Query SQLite
  } else if (whoBdd == 'SQLite') {
    dbsqllite.sequelize.sync().then(async () => {
      playersqlite.create({
        nom: formData.player1
      }).then(res => {
        console.log("New Player added in Sqlite")
        console.log(res.dataValues)
      }).catch((error) => {
          console.error('Failed to create a new player : ', error);
      });
  
      playersqlite.create({
        nom: formData.player2
      }).then(res => {
        console.log("New Player added in Sqlite")
        console.log(res.dataValues)
      }).catch((error) => {
          console.error('Failed to create a new player : ', error);
      });
    
    });
  }  else if (whoBdd == 'Mongodb') {
      Partie.create({
          Player1: formData.player1,
          Player2: formData.player2,
          whowin: '',
      }).then(async res => {
          console.log("Two New Players added inMongoDB")
          await mongoose.connection.save();
          console.log(res);
      }).catch((error) => {
          console.error('Failed to create a new Players / partie : ', error);
      });
  }
  res.redirect(`/play?data=${encodeURIComponent(JSON.stringify(formData))}`);
});


/* The above code is a route handler for a POST request to save a winner in a game. It receives the
form data from the request body and checks the value of the variable `whoBdd` to determine which
database to use for saving the winner. */
app.post('/saveWinner', async (req, res) => {
 const formData = req.body;
  if (whoBdd == 'MySQL') {
    dbmysql.sequelize.sync().then(() => {
      partieMysql.create({
        player1: formData.player1,
        player2: formData.player2,
        whowin: formData.whowin, 
      }).then(res => {
        console.log("New Partie added")
        console.log(res.dataValues)
      }).catch((error) => {
          console.error('Failed to create a new player : ', error);
      });
  
    });
  } else if (whoBdd == 'SQLite') {
    dbsqllite.sequelize.sync().then(() => {
      partieqsqlite.create({
        player1: formData.player1,
        player2: formData.player2,
        whowin: formData.whowin, 
      }).then(res => {
        console.log("New Player added")
        console.log(res.dataValues)
      }).catch((error) => {
          console.error('Failed to create a new player : ', error);
      });
  
    });
  }  else if (whoBdd == 'Mongodb') {
    try {
      // LastPartie = partie en court
      const latestPartie = await Partie.findOne().sort({ createdAt: -1 }); 
      if (latestPartie) {
        // upddate whowin
        const updatedPartie = await Partie.updateOne(
          { _id: latestPartie._id }, 
          {
            $set: {
              player1: formData.player1,
              player2: formData.player2,
              whowin: formData.whowin,
              updatedAt: new Date(),
            },
          }
        );
        console.log("Update OK :", updatedPartie);
      } else {
        console.error('who "partie" ?');
      }
    } catch (error) {
      console.error('Failed to update partie : ', error);
    }
  } else if (whoBdd == 'noe4js') {

  }
});


/* The above code is defining a route in a JavaScript application using the Express framework. When a
GET request is made to the '/play' endpoint, the code parses the 'data' query parameter from the
request URL and decodes it from URI encoding. Then, it renders a view called 'play' and passes the
parsed data as a variable to the view. */
app.get('/play', (req, res) => {
  const data = JSON.parse(decodeURIComponent(req.query.data));
  res.render('play', { data });
});

/* The above code is a route handler for a POST request to '/transi'. It receives form data from the
request body and performs different actions based on the values of the 'database1' and 'database2'
fields in the form data. */
app.post('/transi', async (req, res) => {
  const formData = req.body;
  
  var data = ""
  if (formData.database1 == formData.database2) {
    data = "Erreur : Même BDD , impossible"
    res.render('resultSwitch', { data });
  } else if ('MySQL' == formData.database1 && formData.database2 == 'SQLite'  ) {
    switchBDDsql(dbmysql,dbsqllite,res)
  } else if ('SQLite' == formData.database1 && 'MySQL' == formData.database2  ) { 
    switchBDDsql(dbsqllite,dbmysql,res) 
  } else if ('MySQL' == formData.database1 && formData.database2 == 'Mongodb') {
    switchSQLtoNoSQL(dbmysql,res) 
  } else if ('SQLite' == formData.database1 && formData.database2 == 'Mongodb') {
    switchSQLtoNoSQL(dbsqllite,res) 
  } else if ('MySQL' == formData.database2 && formData.database1 == 'Mongodb') {
    switchNoSQLtoSQL(dbmysql,res) 
  } else if ('SQLite' == formData.database2 && formData.database1 == 'Mongodb') {
    switchNoSQLtoSQL(dbsqllite,res) 
  }
});

/**
 * The function `switchBDDsql` is an asynchronous function that switches data from one SQL database to
 * another.
 * @param DBB1 - DBB1 is an object representing the first database connection.
 * @param DBB2 - DBB2 is the target database where the data will be switched to. It is an instance of a
 * Sequelize model representing the target database.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It is typically used to render a view or send a JSON response.
 */
async function switchBDDsql(DBB1,DBB2,res) {
  try {
     // Select SQL BDD
    const playersFromDBB1 = await DBB1.sequelize.query("SELECT * FROM players", { type: QueryTypes.SELECT });
    
    const partiesFromDBB1 = await DBB1.sequelize.query("SELECT * FROM parties", { type: QueryTypes.SELECT });
    
    // Delete of SQL BDD 
    await DBB2.player.destroy({ where: {} });
    await DBB2.partie.destroy({ where: {} });

    // Add all BDD
    await Promise.all(playersFromDBB1.map((player) => DBB2.player.create({ nom : player.nom})));
    await Promise.all(partiesFromDBB1.map((partie) => DBB2.partie.create({
      player1: partie.player1,
      player2: partie.player2,
      whowin: partie.whowin, 
    })));
    await DBB1.sequelize.sync();
    await DBB2.sequelize.sync();
    var data  = 'Transition de base de données réussie.';
    res.render('resultSwitch', { data });
  } catch (error) {
    console.error('Erreur lors de la transition de base de données:', error);
  }
}

/**
 * The function `switchSQLtoNoSQL` switches data from a SQL database to a NoSQL database by selecting
 * data from the SQL database, deleting data from the NoSQL database, and then adding the selected data
 * to the NoSQL database.
 * @param DBB1 - DBB1 is an object representing a SQL database connection. It is used to execute SQL
 * queries and interact with the SQL database.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It is typically used to render a view or send a JSON response.
 */
async function switchSQLtoNoSQL(DBB1,res) {
  try {
    // Select SQL BDD
    const partiesFromDBB1 = await DBB1.sequelize.query("SELECT * FROM parties", { type: QueryTypes.SELECT });
    // delete NoSQL BDD
    await Partie.deleteMany(); 
    // Promise to all add
    console.log(partiesFromDBB1)
    await Promise.all(partiesFromDBB1.map(async (partie) => {
      const partieMongoData = {
        Player1: partie.player1,
        Player2: partie.player2,
        whowin: partie.whowin,
      };
      //console.log(partieMongoData)
      await Partie.create(partieMongoData);
    }));
    await DBB1.sequelize.sync();
   
    var data  = 'Transition de base de données réussie.';
    //console.log((await Partie.find()).toString())
    res.render('resultSwitch', { data });
    
  } catch (error) {
    console.error('Erreur lors de la transition de base de données:', error);
  }
}


/**
 * The function `switchNoSQLtoSQL` switches data from a NoSQL database to a SQL database.
 * @param DBB2 - DBB2 is an object that represents the SQL database connection using Sequelize. It
 * contains the necessary configurations to connect to the database, such as the host, port, username,
 * password, and database name.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It is typically an instance of the Express `Response` object.
 */
async function switchNoSQLtoSQL(DBB2,res) {
  try {
    // Select NoSQL BDD 
    const partiesFromMongo = await Partie.find();

    // Delete SQL BDD
    await DBB2.player.destroy({ where: {} });
    await DBB2.partie.destroy({ where: {} });

    // Add NoSQL to SQL
    await Promise.all(partiesFromMongo.map(async (partieMongo) => {
     
      await DBB2.player.create({ nom: partieMongo.Player1 }); 
      await DBB2.player.create({ nom: partieMongo.Player2 });

      await DBB2.partie.create({
        player1: partieMongo.Player1,
        player2: partieMongo.Player2,
        whowin: partieMongo.whowin,
      });
    }));
    await DBB2.sequelize.sync();
    
    var data  = 'Transition de base de données réussie.';
    res.render('resultSwitch', { data });
  } catch (error) {
    console.error('Erreur lors de la transition de base de données:', error);
  }
}

app.post('/delete', async (req, res) => {
  const formData = req.body;
  if ('MySQL' == formData.datadel) {
    await playerMysql.destroy({ where: {} });
    await partieMysql.destroy({ where: {} });
    var partiesFromDBB = await dbmysql.sequelize.query("SELECT * FROM parties", { type: QueryTypes.SELECT }); 
  } else if ('SQLite' == formData.datadel){
    await playersqlite.destroy({ where: {} });
    await partieqsqlite.destroy({ where: {} });
    var partiesFromDBB = await dbsqllite.sequelize.query("SELECT * FROM parties", { type: QueryTypes.SELECT }); 
  } else if ('Mongodb' == formData.datadel) {
    await Partie.deleteMany(); 
    var partiesFromDBB = await Partie.find();
  }
  if (partiesFromDBB = []) {
    var data = "Ok, database " + formData.datadel + " is void now"
    res.render('resultSwitch', { data });
  } else {
    var data = "Error " + partiesFromDBB
    res.render('resultSwitch', { data });
  }
});

// Random Database 

const listeJoueurs = [
  "Alexandre",
  "Sophie",
  "Maxime",
  "Emma",
  "Gabriel",
  "Lea",
  "Thomas",
  "Charlotte",
  "William",
  "Zoe",
  "Samuel",
  "Camille",
  "Nathan",
  "Mia",
  "Anthony",
  "Jade",
  "Vincent",
  "Eva",
  "Olivier",
  "Rose",
  "Louis",
  "Leonie",
  "Charles",
  "Clara",
  "Edouard",
  "Lila",
  "Mathieu",
  "Emilie",
  "Xavier",
  "Chloe",
  "Benjamin",
  "Juliette",
  "Hugo",
  "Leon",
  "Antoine",
  "Maeva",
  "Nicolas",
  "Leo",
  "Julien",
  "Florence",
  "Ethan",
  "Julie",
  "Simon",
  "Anais",
  "David",
  "Melissa",
  "Christopher",
  "Audrey"
];

app.post('/addrandom', async (req, res) => {
  const formData = req.body;
  if ('MySQL' == formData.dataRandom   ) {
    AddRandomSQL(dbmysql,res)
  } else if ('SQLite' == formData.dataRandom){
    AddRandomSQL(dbsqllite,res)
  } else if ('Mongodb' == formData.dataRandom) {
    AddRandomNoSQL(res)
  }
});

/**
 * The function `AddRandomSQL` shuffles an array of player names, creates player records in a database,
 * and randomly assigns winners between pairs of players.
 * @param DBB - The parameter "DBB" seems to be an object representing a database connection or a
 * database client. It is used to interact with the database and perform operations such as creating
 * new records.
 * @param res - The parameter `res` is typically used to send a response back to the client in a web
 * application. It is commonly used in frameworks like Express.js to handle HTTP requests and
 * responses. In this code snippet, it seems that `res` is not being used. If you are not using it for
 */
async function AddRandomSQL(DBB,res) {
  try {
    // Delete SQL BDD
    await DBB.player.destroy({ where: {} });
    await DBB.partie.destroy({ where: {} });
    await DBB.sequelize.sync();
    var listeJoueursMelangee = shuffleArray(listeJoueurs);
    for (let i = 0; i < listeJoueursMelangee.length; i++) {
      if (listeJoueursMelangee[i] != null) {
        await DBB.player.create({ nom: listeJoueursMelangee[i] });
      }
    }

    for (let i = 0; i < listeJoueursMelangee.length; i += 2) {
      const player1 = listeJoueursMelangee[i];
      const player2 = listeJoueursMelangee[i + 1];
      const whowin = Math.random() < 0.5 ? player1 : player2;
      await DBB.partie.create({ player1 : player1, player2 : player2, whowin : whowin });
    }
    await DBB.sequelize.sync();
    var partiesFromDBB = await DBB.sequelize.query("SELECT * FROM parties", { type: QueryTypes.SELECT });
    var listJSON = []
    for (let i = 0; i < partiesFromDBB.length; i++) {
      if (partiesFromDBB[i] != null) {
        var play1 = partiesFromDBB[i].player1
        var play2 = partiesFromDBB[i].player2
        var play3 = partiesFromDBB[i].whowin
        listJSON.push( { player1 : play1, player2 : play2 , whowin : play3 })
      }
    }
    var data = { result : "Added Random data", addinBDD : JSON.stringify(listJSON) }
    res.render('resultRandom', { data });
  } catch (error) {
    console.error('Erreur lors du processus : ', error);
  } 
}
/**
 * The function `AddRandomSQL` shuffles an array of player names, creates partie records in a NoSQL database ,
 * and randomly assigns winners between pairs of players.
 * @param res - The parameter `res` is typically used to send a response back to the client in a web
 * application. It is commonly used in frameworks like Express.js to handle HTTP requests and
 * responses. In this code snippet, it seems that `res` is not being used. If you are not using it for
 */
async function AddRandomNoSQL(res) {
  try {

    await Partie.deleteMany(); 
    const listeJoueursMelangee = shuffleArray(listeJoueurs);

    for (let i = 0; i < listeJoueursMelangee.length; i += 2) {
      const player1 = listeJoueursMelangee[i];
      const player2 = listeJoueursMelangee[i + 1];
      const whowin = Math.random() < 0.5 ? player1 : player2;
      await Partie.create({ Player1: player1, Player2: player2,  whowin: whowin });
    }
    var partiesFromDBB = await Partie.find();
    var listJSON = []
    for (let i = 0; i < partiesFromDBB.length; i++) {
      if (partiesFromDBB[i] != null) {
        var play1 = partiesFromDBB[i].Player1
        var play2 = partiesFromDBB[i].Player2
        var play3 = partiesFromDBB[i].whowin
        listJSON.push( { player1 : play1, player2 : play2 , whowin : play3 })
      }
    }
    var data = { result : "Added Random data", addinBDD : JSON.stringify(listJSON) }

    res.render('resultRandom', { data });
  } catch (error) {
    console.error('Erreur lors du processus : ', error);
  }

}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}



// Neo4j function 
async function VisielSQLtoNeo(DBB1,res) {
  try {
    // Select SQL BDD
    const partiesFromDBB1 = await DBB1.sequelize.query("SELECT * FROM parties", { type: QueryTypes.SELECT });
    await Promise.all(partiesFromDBB1.map(async (partie) => {
      createPlayer(partie.player1)
      createPlayer(partie.player2)
      createPartie(partie.player1,partie.player2,partie.whowin)
    }));
    await DBB1.sequelize.sync();
   
    var data  = 'Transition de base de données réussie.';
    //console.log((await Partie.find()).toString())
    res.render('resultSwitch', { data });
    
  } catch (error) {
    console.error('Erreur lors de la transition de base de données:', error);
  }
}



async function VisielNoSQLtoNeo(DBB2,res) {
  try {
    // Select NoSQL BDD 
    const partiesFromMongo = await Partie.find();

    // Delete SQL BDD
  
    // Add NoSQL to SQL
    await Promise.all(partiesFromMongo.map(async (partieMongo) => {
      createPlayer(partieMongo.Player1)
      createPlayer(partieMongo.Player2)
      createPartie(partieMongo.Player1,partieMongo.Player2,partieMongo.whowin)
    }));
    await DBB2.sequelize.sync();
    
    var data  = 'Transition de base de données réussie.';
    res.render('resultSwitch', { data });
  } catch (error) {
    console.error('Erreur lors de la transition de base de données:', error);
  }
}
