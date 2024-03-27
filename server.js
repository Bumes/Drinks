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
    lastOrder = req.body;
    console.log('Received data:', lastOrder);
    // Emit an event to indicate that a new order has been received
    res.sendStatus(200);
});

// Endpoint to serve HTML page with last order
app.get('/', (req, res) => {
    // Assuming you have a master.html file in the same directory
    res.sendFile(__dirname + '/master.html');
});

app.use(express.static(__dirname))

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
