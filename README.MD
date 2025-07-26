# Sistem Admin Pembelian dengan Chatbot AI

Sebuah sistem admin sederhana untuk mengelola pembelian produk yang dilengkapi dengan chatbot AI terintegrasi.

## Fitur Utama

1. **Admin Pembelian**:

   - Input data pembelian
   - Cancel pembelian
   - Manajemen produk dan stok

2. **Chatbot AI**:
   - Terintegrasi dengan model AI (Gemini)
   - UI interaktif untuk berkomunikasi dengan chatbot

## Teknologi yang Digunakan

- **Backend**: Node.js dengan Express.js
- **Frontend**: EJS (Embedded JavaScript templates)
- **Database**: SQL (SQLite)
- **Chatbot**: Terintegrasi dengan API AI Gemini

## Panduan Instalasi

### Prasyarat

1. Node.js (v14 atau lebih baru)
2. Database SQL (MySQL/PostgreSQL/SQLite)
3. Akun API untuk layanan AI yang dipilih (opsional untuk chatbot)

### Langkah-langkah

1. Clone repositori ini:

   ```bash
   git clone https://github.com/username/sys-adm-pembelian.git
   cd sys-adm-pembelian

   ```

2. Install Dependensie - npm install, Express EJS

   ```bash
   npm init -y
   npm install express ejs

   ```

3. Jalankan Aplikasi

```bash
node app.js
```

4. Membuat file .env untuk API Key Chatbot AI
   isi dengan OPENAI_API_KEY=isi_api_keymu

#### 🧪 3. **Tes Ulang Semua Fitur**

Uji Aplikasi:

- [x] Halaman form bisa simpan pembelian?
- [x] Tabel pembelian muncul?
- [x] Tombol cancel berfungsi?
- [x] Chatbot bisa jawab beneran?
- [x] Styling oke?
- [x] Tidak ada error di console/server?
