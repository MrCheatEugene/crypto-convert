(async ()=>{
    const express = require('express');
    const app = express();
    const CryptoConvert = require("crypto-convert").default;
    let cc = new CryptoConvert({
    	cryptoInterval: 5000, //Crypto prices update interval in ms (default 5 seconds on Node.js & 15 seconds on Browsers)
    	fiatInterval: (60 * 1e3 * 60), //Fiat prices update interval (default every 1 hour)
    	calculateAverage: true, //Calculate the average crypto price from exchanges
    	binance: true, //Use binance rates
    	bitfinex: true, //Use bitfinex rates
    	coinbase: true, //Use coinbase rates
    	kraken: true, //Use kraken rates
    	HTTPAgent: null //HTTP Agent for server-side proxies (Node.js only)
    });
    
    let PORT = 1981;
    await cc.ready();
    app.get('/convert/:coin1/:coin2', (req, res) => {
        const coin1 = req.params.coin1.toUpperCase();
        const coin2 = req.params.coin2.toUpperCase();

        const amount = parseFloat(req.query.amount) || 1; // Default to 1 if not provided

        if (cc[coin1] && cc[coin1][coin2]) {
            const convertedAmount = cc[coin1][coin2](amount);
            return res.json({ [coin2]: convertedAmount });
        } else {
            return res.status(404).json({ error: 'Conversion rate not found' });
        }
    });

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})();
