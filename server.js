const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const cors = require('cors');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const add_drink = require("./master-script")

app.use(cors());

// Middleware to parse JSON body
app.use(bodyParser.json());

let lastOrder = '';

// Endpoint to receive data from client
app.post('/master', (req, res) => {
    lastOrder = req.body;
    console.log('Received data:', lastOrder);
    // Emit an event when new data is received
    eventEmitter.emit('newData', lastOrder);
    add_drink(lastOrder)
    res.sendStatus(200);
});

// Endpoint to serve HTML page with last order
app.get('/', (req, res) => {
    // Assuming you have a master.html file in the same directory
    res.sendFile(__dirname + '/master.html');
});

app.use(express.static(__dirname))

// Endpoint to subscribe to last order updates using SSE
app.get('/lastOrder', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send current last order immediately
    res.write(`data: ${JSON.stringify(lastOrder)}\n\n`);

    // Subscribe to new data events
    const onData = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };
    eventEmitter.on('newData', onData);

    // Clean up event listener when connection closes
    req.on('close', () => {
        eventEmitter.off('newData', onData);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
