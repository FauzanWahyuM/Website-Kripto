// __tests__/utils.test.js
// Mengimpor fungsi dari utils.js
const { formatCurrentPrice, filterCryptoData, getPriceChangeClass } = require('../utils'); 

describe('formatCurrentPrice', () => {
    test('should format positive number correctly', () => {
        expect(formatCurrentPrice(123.456789)).toBe('$123.456789');
    });

    test('should format number with less than 2 decimal places with 2 decimals', () => {
        expect(formatCurrentPrice(50)).toBe('$50.00');
    });

    test('should format large number with commas', () => {
        expect(formatCurrentPrice(1234567.89)).toBe('$1,234,567.89');
    });

    test('should handle zero', () => {
        expect(formatCurrentPrice(0)).toBe('$0.00');
    });

    test('should return "N/A" for non-numeric input', () => {
        expect(formatCurrentPrice('abc')).toBe('N/A');
        expect(formatCurrentPrice(null)).toBe('N/A');
        expect(formatCurrentPrice(undefined)).toBe('N/A');
    });

    test('should return "N/A" for NaN', () => {
        expect(formatCurrentPrice(NaN)).toBe('N/A');
    });
});

describe('filterCryptoData', () => {
    const mockCoins = [
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', market_cap_rank: 1 },
        { id: 'ethereum', name: 'Ethereum', symbol: 'eth', market_cap_rank: 2 },
        { id: 'tether', name: 'Tether', symbol: 'usdt', market_cap_rank: 3 },
        { id: 'binancecoin', name: 'Binance Coin', symbol: 'bnb', market_cap_rank: 4 },
        { id: 'solana', name: 'Solana', symbol: 'sol', market_cap_rank: 5 },
        { id: 'cardano', name: 'Cardano', symbol: 'ada', market_cap_rank: 6 },
    ];

    test('should return all coins if search term is empty or invalid', () => {
        expect(filterCryptoData(mockCoins, '')).toEqual(mockCoins);
        expect(filterCryptoData(mockCoins, '   ')).toEqual(mockCoins);
        expect(filterCryptoData(mockCoins, null)).toEqual(mockCoins);
        expect(filterCryptoData(mockCoins, undefined)).toEqual(mockCoins);
        expect(filterCryptoData(mockCoins, 123)).toEqual(mockCoins);
    });

    test('should filter by coin name (case-insensitive)', () => {
        const filtered = filterCryptoData(mockCoins, 'BitCoin');
        expect(filtered).toHaveLength(1);
        expect(filtered[0].name).toBe('Bitcoin');
    });

    test('should filter by coin symbol (case-insensitive) and names containing symbol', () => {
        const filtered = filterCryptoData(mockCoins, 'ETH');
        expect(filtered).toHaveLength(2); // Ethereum (symbol) dan Tether (name)
        expect(filtered.map(c => c.id)).toEqual(expect.arrayContaining(['ethereum', 'tether']));
    });

    // PERBAIKAN PENTING DI SINI: Ubah search term dan ekspektasinya
    test('should filter by partial match for "coin" and return Bitcoin and Binance Coin', () => {
        const filtered = filterCryptoData(mockCoins, 'coin'); // Search for "coin"
        expect(filtered).toHaveLength(2); // Harapkan 2 hasil
        expect(filtered.map(c => c.id)).toEqual(expect.arrayContaining(['bitcoin', 'binancecoin'])); // Harapkan Bitcoin dan Binance Coin
    });

    test('should return empty array if no match found', () => {
        expect(filterCryptoData(mockCoins, 'xyzcoin')).toHaveLength(0);
    });
});

describe('getPriceChangeClass', () => {
    test('should return "price-up" for positive change', () => {
        expect(getPriceChangeClass(1.5)).toBe('price-up');
        expect(getPriceChangeClass(0.0)).toBe('price-up');
    });

    test('should return "price-down" for negative change', () => {
        expect(getPriceChangeClass(-0.5)).toBe('price-down');
    });

    test('should return empty string for null or undefined input', () => {
        expect(getPriceChangeClass(null)).toBe('');
        expect(getPriceChangeClass(undefined)).toBe('');
    });
});