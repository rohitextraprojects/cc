const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

// Ensure database directory exists
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir);


const db = new Database(path.join(dbDir, 'todo.db'));

// Express config
app.use(express.json());
app.use(express.static(__dirname));

// Create table if it doesn’t exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT
  )
`).run();

// Get todos
app.get('/api/todos', (req, res) => {
  const todos = db.prepare('SELECT * FROM todos').all();
  res.json(todos);
});


// app.get('/download-db', (req, res) => {
//   res.download(path.join(dbDir, 'todo.db'), 'todo.db');
// });


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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`));
