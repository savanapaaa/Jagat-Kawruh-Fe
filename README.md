# Jagat Kawruh - Media Pembelajaran Berbasis Web

Platform pembelajaran digital yang memudahkan guru dan siswa dalam proses belajar mengajar.

## 🚀 Fitur Utama

- **Materi Terstruktur** - Materi pembelajaran yang sistematis dan mudah dipahami
- **Tugas & Kuis Online** - Sistem tugas dan kuis interaktif
- **Penilaian Otomatis** - Feedback cepat dan akurat untuk setiap tugas
- **Akses Guru & Siswa** - Platform terintegrasi untuk kolaborasi

## 📦 Instalasi

1. Clone repository ini
2. Install dependencies:
```bash
npm install
```

3. Jalankan development server:
```bash
npm start
```

4. Buka [http://localhost:3000](http://localhost:3000) di browser Anda

## 🛠️ Tech Stack

- React.js
- CSS3
- JavaScript ES6+

## � Struktur Project (Feature-Based)

```
src/
├── components/           # Reusable components
│   ├── Navbar/
│   │   ├── index.js
│   │   └── Navbar.css
│   ├── Footer/
│   │   ├── index.js
│   │   └── Footer.css
│   └── Button/
│       ├── index.js
│       └── Button.css
├── pages/               # Page-specific components
│   └── Home/
│       ├── index.js
│       ├── Hero.js
│       ├── Features.js
│       ├── HowItWorks.js
│       ├── About.js
│       ├── CTA.js
│       └── styles/
│           ├── Hero.css
│           ├── Features.css
│           ├── HowItWorks.css
│           ├── About.css
│           └── CTA.css
├── App.js
├── App.css
├── index.js
└── index.css
```

## 🎯 Struktur Folder

Struktur folder aplikasi React disusun berdasarkan fitur (feature-based structure) untuk memudahkan pengelolaan kode seiring bertambahnya fitur pada sistem:

- ✅ **pages/** - Berisi halaman-halaman utama aplikasi (Home, Login, Dashboard, dll)
- ✅ **components/** - Berisi komponen yang dapat digunakan kembali (reusable)
- ❌ **Tidak menggunakan 1 folder components besar** - Lebih mudah maintain dan scalable

### Keuntungan Feature-Based Structure:
- Mudah mencari file terkait fitur tertentu
- Scalable untuk project yang bertambah besar
- Memisahkan concerns dengan jelas
- Reusable components terpisah dari page-specific components

## 🎨 Customization

Anda dapat mengkustomisasi warna, font, dan konten sesuai kebutuhan dengan mengedit file CSS di folder masing-masing component atau page.

## 📝 Menambah Halaman Baru

Untuk menambah halaman baru (contoh: Login):

1. Buat folder baru di `src/pages/Login/`
2. Buat `index.js` sebagai main component
3. Buat folder `styles/` untuk CSS
4. Import di `App.js`

## 📄 License

Copyright © 2025 Jagat Kawruh. All rights reserved.
