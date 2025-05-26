// utils.js

/**
 * Memformat angka menjadi format mata uang USD dengan presisi tertentu.
 * Digunakan untuk tampilan harga saat ini.
 * @param {number} price
 * @returns {string}
 */
function formatCurrentPrice(price) {
    if (typeof price !== 'number' || isNaN(price)) {
        return 'N/A';
    }
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
}

/**
 * Memfilter daftar koin berdasarkan istilah pencarian (nama atau simbol).
 * @param {Array<Object>} coins - Array objek koin (misal: dari API CoinGecko).
 * @param {string} searchTerm - Istilah pencarian dari input pengguna.
 * @returns {Array<Object>} - Array koin yang sudah difilter.
 */
function filterCryptoData(coins, searchTerm) {
    if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim() === '') {
        return coins; // Jika tidak ada istilah pencarian, kembalikan semua koin
    }
    const cleanedSearchTerm = searchTerm.trim();
    const lowerCaseSearchTerm = cleanedSearchTerm.toLowerCase();
    
    return coins.filter(coin => {
        const coinNameLower = (coin.name || '').toString().trim().toLowerCase();
        const coinSymbolLower = (coin.symbol || '').toString().trim().toLowerCase();

        const nameMatch = coinNameLower.includes(lowerCaseSearchTerm);
        const symbolMatch = coinSymbolLower.includes(lowerCaseSearchTerm);
        
        return nameMatch || symbolMatch;
    });
}

/**
 * Fungsi pembantu untuk menentukan kelas CSS perubahan harga.
 * @param {number|null} priceChangePercentage - Persentase perubahan harga.
 * @returns {string} - Kelas CSS ('price-up' atau 'price-down').
 */
function getPriceChangeClass(priceChangePercentage) {
    if (priceChangePercentage === null || priceChangePercentage === undefined) {
        return ''; // Tidak ada kelas jika data tidak tersedia
    }
    return priceChangePercentage >= 0 ? 'price-up' : 'price-down';
}

// --- Kode untuk Kompatibilitas Node.js (Jest) dan Browser ---

// Untuk Node.js (Jest), kita menggunakan module.exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatCurrentPrice,
        filterCryptoData,
        getPriceChangeClass
    };
}

// Untuk Browser, kita lampirkan ke objek global window agar bisa diakses oleh script.js
if (typeof window !== 'undefined') {
    window.myAppUtils = {
        formatCurrentPrice,
        filterCryptoData,
        getPriceChangeClass
    };
}