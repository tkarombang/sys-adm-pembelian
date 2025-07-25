const express = require('express');
const path = require('path');
const db = require('./models/db');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
// app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }))

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
  db.get(`SELECT quantity FROM stock WHERE product_id = ?`, [product_id], (err, row) => {
    if (err || !row) return res.send('STOK TIDAK DITEMUKAN');

    if (row.quantity < quantity) return res.send('STOK TIDAK MENCUKUPI');

    db.run(
      `INSERT INTO purchases (product_id, quantity) VALUES (?, ?)`, [product_id, quantity],
      function (err) {
        if (err) return res.send('GAGAL SIMPAN PEMBELI')

        console.log("PEMBELIAN BERHASIL, ID", this.lastID)
        res.redirect('/')
      }
    )
  })
})


app.post('/cancel/:id', (req, res) => {
  const id = req.params.id;

  db.get(`SELECT * FROM purchases WHERE id = ?`, [id], (err, purchases) => {
    if (err || !purchases) return res.send('DATA TIDAK DITEMUKAN');

    if (purchases.status === 'cancelled') return res.redirect('/');

    db.run(`UPDATE purchases SET status = 'cancelled' WHERE id = ?`, [id], (err2) => {
      if (err2) return res.send('GAGAL CANCEL');

      db.run(`UPDATE stock SET quantity = quantity + ? WHERE product_id = ?`, [purchases.quantity, purchases.product_id], () => res.redirect('/')
      );

    })


  })
})


app.listen(PORT, () => console.log(`Server running on  http://localhost:${PORT}`));