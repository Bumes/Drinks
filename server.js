const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const cors = require('cors');
app.use(cors());

// Middleware to parse JSON body
app.use(bodyParser.json());

let lastOrder = '';

// Endpoint to receive data from client
app.post('/master', (req, res) => {
    lastOrder = req.body.input;
    console.log('Received data:', lastOrder);
    res.sendStatus(200);
});

// Endpoint to serve HTML page with last order
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Last Order</title>
        </head>
        <body>
            <h1>Last Order:</h1>
            <label id="lastOrderLabel">${lastOrder}</label>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://drinks.lukas-bumes:${PORT}`);
});
