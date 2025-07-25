
-- TABEL PRODUK
CREATE TABLE IF NOT EXISTS product (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  price INTEGER
);

-- TABEL STOK
CREATE TABLE IF NOT EXISTS stock (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER,
  quantity INTEGER,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- TABLE PEMBELIAN
CREATE TABLE IF NOT EXISTS purchases(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER,
  quantity INTEGER,
  status TEXT DEFAULT  'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES product(id)
);

SELECT * FROM purchases;

-- INSERT PRODUK DAN STOK
-- INSERT INTO product (name, price) VALUES
-- ('Laptop', 8443999),
-- ('Smart Watch', 2330888),
-- ('iPhone', 23444888),
-- ('Camera Nikon', 35999555),
-- ('Pixels', 15888222),
-- ('TWS', 5000999),
-- ('Computer', 55222999),
-- ('LCD', 20888111),
-- ('Mouse', 800999),
-- ('Keyboard Tactical', 4555888),
-- ('Headphone', 2000888);

-- INSERT INTO stock (product_id, quantity) VALUES
-- (1, 7),
-- (2, 2),
-- (3, 1),
-- (4, 2),
-- (5, 1),
-- (6, 3),
-- (7, 2),
-- (8, 3),
-- (9, 1),
-- (10, 2);

-- SELECT id, 20 FROM product;

