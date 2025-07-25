const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Gagal konek ke database:', err.message);
  } else {
    console.log('Berhasil terhubung ke SQLite database');
  }
});

module.exports = db;