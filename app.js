const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const path = require('path');
const db = require('./models/db');
require('dotenv').config();

const app = express();
const PORT = 3000;

const indexRouter = require('./routes/index')
app.use(expressLayouts)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', indexRouter);
app.set('layout', 'layouts/layout')
app.set('view engine', 'ejs');
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, 'public')));
// eslint-disable-next-line no-undef
app.set('views', path.join(__dirname, 'views'))


const runTransaction = (db, operationsm, callback) => {
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    operationsm(db, (err) => {
      if (err) {
        db.run('ROLLBACK');
        return callback(err);
      }
      db.run('COMMIT');
      callback(null);
    })
  })
}

app.get('/', (req, res) => {
  db.all('SELECT p.*, s.quantity AS stock FROM product p LEFT JOIN stock s ON  s.product_id = p.id', (err, products) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Gagal ambil produk');
    }

    db.all(`SELECT purchases.*, product.name AS product_name
      FROM purchases 
      JOIN product 
      ON purchases.product_id = product.id 
      ORDER BY purchases.created_at DESC`, (err2, purchases) => {
      if (err2) {
        console.log('Error Purchases query', err2)
        return res.send('GAGAL AMBIL PEMBELIANKAH');
      }
      res.render('index', { title: 'Admin Page', products, purchases })
    })

  });

});

app.post('/purchase', (req, res) => {
  const { product_id, quantity } = req.body;

  runTransaction(db, (db, done) => {
    db.run(
      `UPDATE stock SET quantity = quantity - ? WHERE product_id = ? AND quantity >= ?`, [quantity, product_id, quantity],
      function (err) {
        if (err || this.changes === 0) {
          return done(new Error('STOCK TIDAK MENCUKUPI'));
        }
        db.run(`INSERT INTO purchases (product_id, quantity, status) VALUES (?, ?, 'active')`, [product_id, quantity],
          function (err) {
            done(err)
          }
        );
      }
    );
  }, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).send(err.message);
    }
    res.redirect('/')
  });
});


app.post('/cancel/:id', (req, res) => {
  const id = req.params.id;

  runTransaction(db, (db, done) => {
    db.get(
      `SELECT product_id, quantity FROM purchases WHERE id = ? AND status = 'active'`, [id],
      (err, purchases) => {
        if (err || !purchases) {
          return done(new Error('Transaksi Tidak Valid'));
        }
        db.run(
          `UPDATE purchases SET status = 'cancelled' WHERE id = ?`, [id],
          function (err) {
            if (err) return done(err);

            db.run(
              `UPDATE stock SET quantity = quantity + ? WHERE product_id = ?`, [purchases.quantity, purchases.product_id],
              (err) => {
                done(err);
              }
            );
          }
        );
      }
    );
  }, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).send(err.message);
    }
    res.redirect('/');
  });
});






app.listen(PORT, () => console.log(`Server running on  http://localhost:${PORT}`));