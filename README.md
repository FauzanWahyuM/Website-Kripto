# Website Kripto

## Installation

No installation required. The website is hosted and can be accessed directly through a web browser.

## Usage

1. Open the website in a web browser.
2. Use the search input to search for a specific cryptocurrency by name or symbol.
3. Click on a cryptocurrency row to view detailed information about the coin.
4. Use the theme toggle button to switch between light and dark mode.

## API

The website uses the CoinGecko API to fetch cryptocurrency data. The API endpoint used is:

```
https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false
```

## Contributing

This project is not open for public contributions at the moment.

## License

This project is licensed under the [MIT License](LICENSE).

## Testing

The project includes unit tests for the utility functions in the `utils.js` file. The tests can be run using Jest.

To run the tests, follow these steps:

1. Install the project dependencies:
   ```
   npm install
   ```
2. Run the tests:
   ```
   npm test
   ```

The tests cover the following functionality:

- `formatCurrentPrice`: Ensures the function correctly formats the current price of a cryptocurrency.
- `filterCryptoData`: Verifies the function filters the cryptocurrency data based on the search term.
- `getPriceChangeClass`: Checks the function correctly determines the CSS class for the price change percentage.
