# Setup Mobile App untuk Notifikasi

## 1. Download ke GitHub
1. Klik tombol **GitHub** di pojok kanan atas editor Lovable
2. Pilih **Connect to GitHub** dan autorisasi aplikasi
3. Klik **Create Repository** untuk membuat repository baru
4. Kode aplikasi akan otomatis tersinkronisasi ke GitHub

## 2. Setup Local Development

Setelah repository dibuat di GitHub:

```bash
# 1. Clone repository dari GitHub
git clone [URL_REPOSITORY_ANDA]
cd [NAMA_PROJECT]

# 2. Install dependencies
npm install

# 3. Build project
npm run build

# 4. Initialize Capacitor (sudah dikonfigurasi)
# File capacitor.config.ts sudah tersedia

# 5. Add platform (pilih salah satu atau keduanya)
npx cap add android
npx cap add ios

# 6. Sync project ke platform mobile
npx cap sync

# 7. Update native dependencies 
npx cap update android  # untuk Android
npx cap update ios      # untuk iOS
```

## 3. Menjalankan di Perangkat

### Android
```bash
# Pastikan Android Studio sudah terinstall
npx cap run android
```

### iOS (hanya di Mac dengan Xcode)
```bash
# Pastikan Xcode sudah terinstall
npx cap run ios
```

## 4. Fitur Mobile yang Tersedia

✅ **Notifikasi Lokal**: Pengingat tugas berdasarkan preferensi
✅ **Penyimpanan Lokal**: Data tersimpan di setiap perangkat
✅ **Tanpa Login**: Tidak perlu akun, data tersimpan secara lokal
✅ **Real-time Clock**: Jam dan tanggal yang selalu update
✅ **Jadwal Hari Ini**: Menu khusus untuk jadwal hari ini

## 5. Konfigurasi Notifikasi

Aplikasi akan otomatis meminta izin notifikasi saat pertama kali dibuka. Notifikasi akan muncul berdasarkan pengaturan pada setiap tugas:

- 2 hari sebelum deadline
- 1 hari sebelum deadline  
- Hari yang sama (9 pagi)
- 8 jam sebelum deadline

## 6. Sync Otomatis dengan GitHub

Setiap perubahan di Lovable akan otomatis tersinkronisasi ke GitHub. Untuk mendapatkan update terbaru di local:

```bash
git pull origin main
npm run build
npx cap sync
```

## Troubleshooting

### Android Studio
- Pastikan Android SDK dan emulator sudah terinstall
- Aktifkan USB Debugging untuk perangkat fisik

### Xcode (iOS)
- Hanya bisa di Mac
- Perlu Apple Developer Account untuk deploy ke perangkat fisik
- Untuk testing bisa menggunakan iOS Simulator

### Notifikasi tidak muncul
- Pastikan izin notifikasi sudah diberikan
- Cek pengaturan sistem untuk mengizinkan notifikasi aplikasi
- Restart aplikasi setelah mengubah pengaturan notifikasi

### Data hilang
- Data tersimpan secara lokal di setiap perangkat
- Jika uninstall aplikasi, data akan hilang
- Untuk backup, bisa export/import data manual