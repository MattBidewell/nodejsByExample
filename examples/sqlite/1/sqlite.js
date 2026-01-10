// <b>SQLite</b> is built into Node.js 22.5+, providing a lightweight SQL database without external dependencies. Perfect for local data storage, caching, and testing.


// Import the SQLite module
import { DatabaseSync } from 'node:sqlite';


// <b>Creating a Database</b>
// Create an in-memory database or a file-based one.

// In-memory database (lost when process exits)
const memoryDb = new DatabaseSync(':memory:');

// File-based database (persists to disk)
const fileDb = new DatabaseSync('./database.sqlite');


// <b>Creating Tables</b>
// Use exec() for statements that don't return data.
const db = new DatabaseSync(':memory:');

db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT NOT NULL,
    content TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

console.log('Tables created');


// <b>Inserting Data</b>
// Use prepare() to create a prepared statement, then run() to execute.
const insertUser = db.prepare(
  'INSERT INTO users (name, email) VALUES (?, ?)'
);

insertUser.run('Alice', 'alice@example.com');
insertUser.run('Bob', 'bob@example.com');
insertUser.run('Charlie', 'charlie@example.com');

console.log('Users inserted');


// <b>Getting the Last Insert ID</b>
// After an insert, get the auto-generated ID.
const result = insertUser.run('Diana', 'diana@example.com');
console.log('Last insert ID:', result.lastInsertRowid);
console.log('Rows changed:', result.changes);


// <b>Querying Data</b>
// Use get() for single row, all() for multiple rows.

// Get single row
const getUser = db.prepare('SELECT * FROM users WHERE id = ?');
const user = getUser.get(1);
console.log('Single user:', user);

// Get all rows
const getAllUsers = db.prepare('SELECT * FROM users');
const users = getAllUsers.all();
console.log('All users:', users);


// <b>Named Parameters</b>
// Use named parameters for clarity.
const insertWithNamed = db.prepare(
  'INSERT INTO posts (user_id, title, content) VALUES ($userId, $title, $content)'
);

insertWithNamed.run({
  $userId: 1,
  $title: 'First Post',
  $content: 'Hello, World!'
});


// <b>Updating Data</b>
const updateUser = db.prepare(
  'UPDATE users SET name = ? WHERE id = ?'
);
const updateResult = updateUser.run('Alicia', 1);
console.log('Updated rows:', updateResult.changes);


// <b>Deleting Data</b>
const deleteUser = db.prepare('DELETE FROM users WHERE id = ?');
// deleteUser.run(4);


// <b>Transactions</b>
// Group multiple operations into a transaction.
function createUserWithPost(name, email, postTitle) {
  db.exec('BEGIN TRANSACTION');
  
  try {
    const userResult = insertUser.run(name, email);
    const userId = userResult.lastInsertRowid;
    
    insertWithNamed.run({
      $userId: userId,
      $title: postTitle,
      $content: 'Auto-generated post'
    });
    
    db.exec('COMMIT');
    return userId;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

const newUserId = createUserWithPost('Eve', 'eve@example.com', 'Eve\'s First Post');
console.log('Created user with post:', newUserId);


// <b>Aggregations</b>
// SQL aggregate functions work as expected.
const countUsers = db.prepare('SELECT COUNT(*) as count FROM users');
console.log('User count:', countUsers.get().count);

const stats = db.prepare(`
  SELECT 
    COUNT(*) as total,
    MIN(created_at) as first_created,
    MAX(created_at) as last_created
  FROM users
`);
console.log('Stats:', stats.get());


// <b>Joining Tables</b>
const postsWithUsers = db.prepare(`
  SELECT 
    posts.id,
    posts.title,
    users.name as author
  FROM posts
  JOIN users ON posts.user_id = users.id
`);
console.log('Posts with authors:', postsWithUsers.all());


// <b>Searching</b>
// Use LIKE for pattern matching.
const searchUsers = db.prepare(
  'SELECT * FROM users WHERE name LIKE ?'
);
console.log('Search results:', searchUsers.all('%li%'));


// <b>Practical Example: Key-Value Store</b>
// A simple key-value store using SQLite.
class KeyValueStore {
  constructor(dbPath = ':memory:') {
    this.db = new DatabaseSync(dbPath);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS kv (
        key TEXT PRIMARY KEY,
        value TEXT,
        expires_at INTEGER
      )
    `);
    
    this.getStmt = this.db.prepare('SELECT value, expires_at FROM kv WHERE key = ?');
    this.setStmt = this.db.prepare('INSERT OR REPLACE INTO kv (key, value, expires_at) VALUES (?, ?, ?)');
    this.deleteStmt = this.db.prepare('DELETE FROM kv WHERE key = ?');
  }
  
  get(key) {
    const row = this.getStmt.get(key);
    if (!row) return null;
    
    if (row.expires_at && Date.now() > row.expires_at) {
      this.delete(key);
      return null;
    }
    
    return JSON.parse(row.value);
  }
  
  set(key, value, ttlMs = null) {
    const expires = ttlMs ? Date.now() + ttlMs : null;
    this.setStmt.run(key, JSON.stringify(value), expires);
  }
  
  delete(key) {
    this.deleteStmt.run(key);
  }
}

const cache = new KeyValueStore();
cache.set('user:1', { name: 'Alice', role: 'admin' });
cache.set('session:abc', { userId: 1 }, 60000); // Expires in 60s

console.log('Cached user:', cache.get('user:1'));
console.log('Cached session:', cache.get('session:abc'));


// <b>Closing the Database</b>
// Close the database when done (important for file-based DBs).
// db.close();
