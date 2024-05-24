const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// PostgreSQL adatbázis beállításai
const pool = new Pool({
    user : 'postgres',
    host : 'localhost',
    database : 'gpt_dba',
    password : 'postgreBS',
    port : 5432,
});

// Middleware beállítása
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Alap route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Adatok lekérdezése az adatbázisból
app.get('/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gpt_table');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching data from database');
  }
});

// Adatok beszúrása az adatbázisba
app.post('/add', async (req, res) => {
  const { name, value } = req.body;
  try {
    await pool.query('INSERT INTO gpt_table (name, value) VALUES ($1, $2)', [name, value]);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error inserting data into database');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
