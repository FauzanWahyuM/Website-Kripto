# Gunakan image Nginx sebagai base image
FROM nginx:stable-alpine

# Hapus file konfigurasi Nginx default
RUN rm /etc/nginx/conf.d/default.conf

# Salin file konfigurasi Nginx kustom Anda
# Gunakan ADD yang lebih fleksibel, atau pastikan COPY sudah benar
COPY default.conf /etc/nginx/conf.d/default.conf

# Buat direktori tujuan di dalam container
RUN mkdir -p /usr/share/nginx/html/kripto-app

# Salin semua file website statis Anda ke direktori yang sesuai di dalam container
# (sesuai dengan path 'alias' di default.conf)
# Gunakan COPY dengan pola wildcard atau direktori untuk menyalin semua files
COPY index.html /usr/share/nginx/html/kripto-app/index.html
COPY style.css /usr/share/nginx/html/kripto-app/style.css
COPY script.js /usr/share/nginx/html/kripto-app/script.js
COPY utils.js /usr/share/nginx/html/kripto-app/utils.js

# --- DEBUGGING: TAMBAHKAN LANGKAH INI UNTUK MEMERIKSA FILE SETELAH DISALIN ---
# Ini akan menampilkan isi direktori di dalam container setelah proses COPY
RUN ls -l /etc/nginx/conf.d/
RUN ls -l /usr/share/nginx/html/kripto-app/
# --- AKHIR DEBUGGING ---

# Exposed port dari container
EXPOSE 80

# Command untuk menjalankan Nginx
CMD ["nginx", "-g", "daemon off;"]