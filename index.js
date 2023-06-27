//#region Parametrage serveur

const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const session = require('express-session');


// Création du serveur Express
const app = express();

// Configuration du serveur
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

// Connexion à la base de donnée PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "nfe114",
  password: "postgres",
  port: 5432
});
console.log("Connexion réussie à la base de données");

// Démarrage du serveur
app.listen(3000, () => {
  console.log("Serveur démarré (http://localhost:3000/) !");
});

//#endregion

//#region  Accueil

// GET /
app.get("/", (req, res) => {
  res.render("index");
});

//#endregion

//#region Login

app.get("/login", (req, res) => {
  res.render("login");
});
// http://localhost:3000/auth
app.post('/login', (req, res) => {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM Compte WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

//#endregion

//#region Afficher les CA

// GET /ca
app.get("/ca", (req, res) => {
  const sql = "SELECT * FROM ca ";
  let regions = [];
  let vendeurs = [];
  const filtreReg = "SELECT * FROM region";
  const filtreVen = "SELECT * FROM vendeur";

  pool.query(filtreReg, [], (err, tab) => {
    if (err) {
      return console.error(err.message);
    }
    regions = tab.rows;

    pool.query(filtreVen, [], (err, tab1) => {
      if (err) {
        return console.error(err.message);
      }
      vendeurs = tab1.rows;

      pool.query(sql, [], (err, result) => {
        if (err) {
          return console.error(err.message);
        }
        res.render("ca", { model: result.rows, regions: regions, vendeurs: vendeurs });
      });
    });
  });
});

// GET ca1
app.get("/ca1/:id", (req, res) => {
  const id = req.params.id
  const sql = "SELECT * FROM ca WHERE \"regionId\" = $1";
  pool.query(sql, [id], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("ca1", { model: result.rows });
  });
});

// GET ca2
app.get("/ca2/:id", (req, res) => {
  const id = req.params.id
  const sql = "SELECT * FROM ca WHERE \"vendeurId\" = $1";
  pool.query(sql, [id], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("ca2", { model: result.rows });
  });
});

//#endregion






