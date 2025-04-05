const express = require('express');
const app = express();
// const db = require('better-sqlite3')('todo.db');

const path = require('path');
const fs = require('fs');
const express = require('express');
const dbPath = path.join(__dirname, 'data');
if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath);
const db = require('better-sqlite3')(path.join(dbPath, 'todo.db'));



const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Create table if it doesn’t exist
db.prepare(`CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT
)`).run();

// Get todos
app.get('/api/todos', (req, res) => {
  const todos = db.prepare('SELECT * FROM todos').all();
  res.json(todos);
});

// Add todo
app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  db.prepare('INSERT INTO todos (text) VALUES (?)').run(text);
  res.status(201).json({ message: 'Added' });
});

// Delete todo
app.delete('/api/todos/:id', (req, res) => {
  db.prepare('DELETE FROM todos WHERE id = ?').run(req.params.id);
  res.sendStatus(204);
});

app.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`));
