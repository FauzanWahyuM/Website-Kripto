import globals from "globals";
import pluginJs from "@eslint/js"; // Ini mungkin sudah ada dari `eslint --init`
import jest from 'eslint-plugin-jest'; // Import plugin Jest yang baru diinstal

export default [
  // Konfigurasi Default untuk semua file JavaScript
  {
    files: ["**/*.js"], // Terapkan konfigurasi ini ke semua file .js
    languageOptions: {
      globals: {
        ...globals.browser, // Global browser (window, document, dll.)
      },
      // Ini mungkin perlu disesuaikan tergantung pilihan Anda di `eslint --init`
      // Jika Anda menggunakan ES modules di script.js Anda, biarkan `sourceType: "module"`
      // Jika vanilla JS tanpa import/export, bisa jadi "script" atau "commonjs"
      sourceType: "module", // Asumsi default adalah ES module (jika script.js menggunakan import/export)
                            // Jika tidak, dan script.js murni vanilla tanpa import/export,
                            // mungkin perlu diubah menjadi "script" atau hapus saja.
    },
    // Aturan default, mungkin dari eslint:recommended atau Airbnb
    extends: [
      pluginJs.configs.recommended, // Aturan dasar ESLint yang direkomendasikan
      // Jika Anda memilih Airbnb, Anda juga perlu menambahkan ini:
      // 'eslint-config-airbnb-base', // Pastikan Anda sudah menginstal `eslint-config-airbnb-base` dan `eslint-plugin-import`
    ],
    rules: {
      // Aturan kustom Anda, misal:
      "no-unused-vars": "warn",
      "no-console": "off",
      // ... aturan lain dari konfigurasi Anda sebelumnya
    },
  },
  // --- Konfigurasi Khusus untuk File Test Jest ---
  {
    files: ["__tests__/**/*.js"], // Terapkan konfigurasi ini HANYA ke file di folder __tests__
    languageOptions: {
      globals: {
        ...globals.jest, // Tambahkan global Jest (describe, test, expect, dll.)
        // Jika Anda masih mendapatkan "'require' is not defined" di file test,
        // Anda mungkin perlu menambahkan globals.node juga:
        // ...globals.node,
      },
      sourceType: "commonjs", // File test Jest biasanya menggunakan CommonJS (`require`)
    },
    plugins: {
      jest: jest, // Daftarkan plugin Jest
    },
    rules: {
      // Terapkan aturan yang direkomendasikan dari plugin Jest
      ...jest.configs.recommended.rules,
      // Opsional: Aturan khusus untuk tes Jest
      "jest/no-disabled-tests": "warn", // Peringatkan tentang tes yang dinonaktifkan
      "jest/no-focused-tests": "error", // Error jika ada tes yang difokuskan (e.g., test.only)
    },
  },
];