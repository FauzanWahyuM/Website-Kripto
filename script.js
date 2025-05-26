document.addEventListener('DOMContentLoaded', () => {
    const cryptoTableBody = document.getElementById('cryptoTableBody');
    const loadingMessage = document.getElementById('loadingMessage');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const coinDetailModal = document.getElementById('coinDetailModal');
    const closeButton = document.querySelector('.modal .close-button');
    const coinDetailContent = document.getElementById('coinDetailContent');
    
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    let allCryptoData = [];

    // --- Fungsi untuk Mengelola Tema ---
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Ikon matahari untuk dark mode
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Ikon bulan untuk light mode
            localStorage.setItem('theme', 'light');
        }
    };

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            applyTheme('light');
        } else {
            applyTheme('dark');
        }
    });
    // --- Akhir Fungsi Tema ---


    // Fungsi untuk mengambil data koin dari CoinGecko API
    const fetchCryptoData = async () => {
        try {
            loadingMessage.style.display = 'block';
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            allCryptoData = data;
            displayCryptoData(data);
        } catch (error) {
            console.error("Error fetching crypto data:", error);
            // Ubah colspan menjadi 5, karena ada 5 kolom tersisa
            cryptoTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--price-down-color);">Gagal memuat data kripto. Silakan coba lagi nanti.</td></tr>';
        } finally {
            loadingMessage.style.display = 'none';
        }
    };

    // Fungsi untuk menampilkan data koin di tabel
    const displayCryptoData = (cryptos) => {
        cryptoTableBody.innerHTML = '';
        if (cryptos.length === 0) {
            // Ubah colspan menjadi 5
            cryptoTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-color);">Tidak ada koin yang ditemukan.</td></tr>';
            return;
        }

        cryptos.forEach(coin => {
            const row = document.createElement('tr');
            row.setAttribute('data-coin-id', coin.id);
            const priceChangeClass = coin.price_change_percentage_24h >= 0 ? 'price-up' : 'price-down';

            row.innerHTML = `
                <td>${coin.market_cap_rank}</td>
                <td>
                    <img src="${coin.image}" alt="${coin.name} icon">
                    ${coin.name} (${coin.symbol.toUpperCase()})
                </td>
                <td>$${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</td>
                <td class="${priceChangeClass}">${coin.price_change_percentage_24h ? coin.price_change_percentage_24h.toFixed(2) : 'N/A'}%</td>
                <td>$${coin.market_cap.toLocaleString()}</td>
                `;
            cryptoTableBody.appendChild(row);
        });
    };

    // Fungsi untuk mencari koin berdasarkan input pengguna (tetap sama)
    const searchCrypto = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredData = allCryptoData.filter(coin =>
            coin.name.toLowerCase().includes(searchTerm) ||
            coin.symbol.toLowerCase().includes(searchTerm)
        );
        displayCryptoData(filteredData);
    };

    searchButton.addEventListener('click', searchCrypto);

    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            searchCrypto();
        } else {
            searchCrypto();
        }
    });

    cryptoTableBody.addEventListener('click', async (event) => {
        let row = event.target.closest('tr');
        if (row && row.dataset.coinId) {
            const coinId = row.dataset.coinId;
            try {
                coinDetailContent.innerHTML = `
                    <span class="close-button temporary-close-button">&times;</span>
                    <div id="coinDetailInfo"></div>
                `;
                const currentCoinDetailInfo = document.getElementById('coinDetailInfo');
                const currentCloseButton = coinDetailContent.querySelector('.temporary-close-button');

                currentCloseButton.addEventListener('click', () => {
                    coinDetailModal.style.display = 'none';
                });

                currentCoinDetailInfo.innerHTML = '<p class="loading-message">Memuat detail koin...</p>';
                coinDetailModal.style.display = 'flex';

                const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const coinDetail = await response.json();

                const lastUpdatedDate = coinDetail.last_updated ? new Date(coinDetail.last_updated).toLocaleString() : 'N/A';

                currentCoinDetailInfo.innerHTML = `
                    <h2><img src="${coinDetail.image.small}" alt="${coinDetail.name} icon">${coinDetail.name} (${coinDetail.symbol.toUpperCase()})</h2>
                    <p><strong>Harga Saat Ini (USD):</strong> $${coinDetail.market_data.current_price.usd.toLocaleString()}</p>
                    <p><strong>Peringkat Kapitalisasi Pasar:</strong> ${coinDetail.market_cap_rank}</p>
                    <p><strong>Kapitalisasi Pasar (USD):</strong> $${coinDetail.market_data.market_cap.usd.toLocaleString()}</p>
                    <p><strong>Deskripsi:</strong> ${coinDetail.description.en || 'Tidak ada deskripsi tersedia.'}</p>
                    <p><strong>Situs Web:</strong> <a href="${coinDetail.links.homepage[0] || '#'}" target="_blank">${coinDetail.links.homepage[0] ? new URL(coinDetail.links.homepage[0]).hostname : 'N/A'}</a></p>
                    <p><strong>Forum/Komunitas:</strong>
                        ${coinDetail.links.blockchain_site[0] ? `<a href="${coinDetail.links.blockchain_site[0]}" target="_blank">Blockchain</a>` : 'N/A'}
                        ${coinDetail.links.official_forum_url[0] ? ` | <a href="${coinDetail.links.official_forum_url[0]}" target="_blank">Forum Resmi</a>` : ''}
                    </p>
                    <p><strong>Terakhir Diperbarui:</strong> ${lastUpdatedDate}</p>
                `;

            } catch (error) {
                console.error("Error fetching coin detail:", error);
                coinDetailContent.innerHTML = '<p style="text-align: center; color: var(--price-down-color);">Gagal memuat detail koin. Silakan coba lagi nanti.</p>';
            }
        }
    });

    closeButton.addEventListener('click', () => {
        coinDetailModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === coinDetailModal) {
            coinDetailModal.style.display = 'none';
        }
    });

    fetchCryptoData();
});