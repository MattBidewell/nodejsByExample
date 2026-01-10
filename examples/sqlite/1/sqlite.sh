// Run the SQLite example (Node.js 22.5+)
$ node sqlite.js
# Tables created
# Users inserted
# Last insert ID: 4
# Single user: { id: 1, name: 'Alice', email: 'alice@example.com', ... }
# All users: [ { id: 1, ... }, { id: 2, ... }, ... ]
# User count: 5
# Cached user: { name: 'Alice', role: 'admin' }


// The database file persists between runs
$ ls -la database.sqlite
# -rw-r--r--  1 user  staff  12288 Jan 10 12:00 database.sqlite
