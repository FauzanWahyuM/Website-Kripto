# Gunakan image Nginx sebagai base image untuk menyajikan file statis
FROM nginx:stable-alpine

# Hapus file konfigurasi Nginx default
RUN rm /etc/nginx/conf.d/default.conf

# Salin file konfigurasi Nginx kustom (jika Anda punya).
# Jika tidak, Anda bisa membuat default.conf sederhana atau mengandalkan default Nginx.
# Untuk website statis sederhana, default Nginx seringkali sudah cukup.
# Jika Anda tidak punya file ini, hapus baris ini dan baris `RUN rm /etc/nginx/conf.d/default.conf`
# COPY default.conf /etc/nginx/conf.d/default.conf

# Salin semua file website statis Anda ke direktori Nginx
# Asumsi semua file HTML, CSS, JS, dan utils.js berada di root proyek
# Jika Anda menggunakan 'npm run build' dan outputnya di folder 'dist', ubah menjadi 'COPY dist/ /usr/share/nginx/html/'
COPY index.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/style.css
COPY script.js /usr/share/nginx/html/script.js
COPY utils.js /usr/share/nginx/html/utils.js
# Tambahkan baris COPY untuk folder lain jika ada (misal: img/, fonts/)
# COPY img/ /usr/share/nginx/html/img/

# Exposed port dari container (port default Nginx)
EXPOSE 80

# Command untuk menjalankan Nginx saat container dimulai
CMD ["nginx", "-g", "daemon off;"]