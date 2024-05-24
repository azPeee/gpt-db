# gpt-db
Készíthetünk egy egyszerű weboldalt, amely lehetővé teszi a PostgreSQL adatbázis kezelését. Ehhez szükség lesz egy szerver oldali keretrendszerre (pl. Node.js, Python Flask, vagy Django) és egy kliens oldali keretrendszerre (pl. HTML, CSS, és JavaScript).

### Példa: Weblap készítése Node.js és Express segítségével

#### 1. Szükséges telepítések

Először telepítsük a szükséges csomagokat:
- Node.js
- PostgreSQL
- Express
- pg (PostgreSQL kliens a Node.js-hez)

Használjunk npm-et (Node Package Manager) a csomagok telepítéséhez.

```sh
mkdir postgres-webapp
cd postgres-webapp
npm init -y
npm install express pg body-parser
```

#### 2. Szerver oldali kód

Hozzunk létre egy `server.js` fájlt és írjuk meg a következő kódot:

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// PostgreSQL adatbázis beállításai
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
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
    const result = await pool.query('SELECT * FROM your_table');
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
    await pool.query('INSERT INTO your_table (name, value) VALUES ($1, $2)', [name, value]);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error inserting data into database');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```

#### 3. HTML kód

Hozzunk létre egy `index.html` fájlt a következő tartalommal:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PostgreSQL Web App</title>
</head>
<body>
  <h1>PostgreSQL Web App</h1>
  <form action="/add" method="POST">
    <input type="text" name="name" placeholder="Name" required>
    <input type="text" name="value" placeholder="Value" required>
    <button type="submit">Add</button>
  </form>
  <h2>Data from Database:</h2>
  <ul id="dataList"></ul>

  <script>
    async function fetchData() {
      const response = await fetch('/data');
      const data = await response.json();
      const dataList = document.getElementById('dataList');
      dataList.innerHTML = '';
      data.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `Name: ${item.name}, Value: ${item.value}`;
        dataList.appendChild(listItem);
      });
    }
    fetchData();
  </script>
</body>
</html>
```

#### 4. Adatbázis beállítás

Hozzuk létre az adatbázist és a táblát a PostgreSQL-ben.

```sql
CREATE DATABASE your_database;

\c your_database

CREATE TABLE your_table (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  value VARCHAR(100)
);
```

#### 5. Futatás

Futtassuk a szervert a következő parancs segítségével:

```sh
node server.js
```

Nyissuk meg a böngészőt, és látogassunk el a `http://localhost:3000` címre. A weboldalon hozzáadhatunk adatokat az űrlapon keresztül, és megtekinthetjük az adatokat a listában.

Ezzel egy egyszerű webalkalmazást hoztunk létre, amely kapcsolatba lép egy PostgreSQL adatbázissal. A kódot és a struktúrát természetesen tovább lehet bővíteni és testreszabni a speciális igényeknek megfelelően.
