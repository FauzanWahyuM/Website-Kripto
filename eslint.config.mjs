// eslint.config.js
import globals from "globals";
import pluginJs from "@eslint/js"; // Ini dari @eslint/js, isinya eslint:recommended
import jest from 'eslint-plugin-jest'; // Plugin Jest

// Mungkin juga perlu impor ini jika Anda memilih Airbnb:
// import airbnbBase from 'eslint-config-airbnb-base'; // Jika ini ada
// import pluginImport from 'eslint-plugin-import'; // Dan ini

export default [
  // --- Konfigurasi Umum ---
  // Ganti `extends: [pluginJs.configs.recommended,]`
  // menjadi memasukkan objek konfigurasi langsung ke array `export default`.
  pluginJs.configs.recommended, // Mengganti `extends` untuk `eslint:recommended`
  // Jika Anda memilih Airbnb, tambahkan objek konfigurasi Airbnb di sini juga:
  // {
  //   files: ["**/*.js"], // Terapkan ini ke semua file JS
  //   extends: [airbnbBase], // Ini masih pakai extends lama, tapi di dalam objek terpisah
  //   plugins: {
  //     import: pluginImport // Jika pakai eslint-plugin-import
  //   },
  //   rules: {
  //     // Aturan Airbnb kustom Anda (jika ada)
  //   }
  // },

  // --- Konfigurasi Default untuk semua file JavaScript (yang bukan test) ---
  // (Ini adalah objek yang sebelumnya memiliki `extends` yang menyebabkan masalah)
  {
    files: ["**/*.js"], // Terapkan konfigurasi ini ke semua file .js
    ignores: ["__tests__/**/*.js"], // ABAIKAN file tes dari konfigurasi umum ini
    languageOptions: {
      globals: {
        ...globals.browser, // Global browser (window, document, dll.)
      },
      sourceType: "module", // Sesuaikan dengan kebutuhan Anda (module/script)
    },
    rules: {
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
        // ...globals.node, // Tetap tambahkan jika masih ada 'require' is not defined
      },
      sourceType: "commonjs", // File test Jest biasanya menggunakan CommonJS (`require`)
    },
    plugins: {
      jest: jest, // Daftarkan plugin Jest
    },
    rules: {
      // Terapkan aturan yang direkomendasikan dari plugin Jest
      ...jest.configs.recommended.rules,
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      // Aturan untuk CommonJS Warning (jika masih muncul):
      "n/no-path-concat": "off",
      "n/no-process-env": "off",
    },
  },
];