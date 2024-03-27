const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const cors = require('cors');
app.use(cors());

app.get('/', function(request, response){
    response.sendFile('master.html');
});

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
    my_label = document.getElementById("my_result_label")
    my_label.textContent = lastOrder
});

app.listen(PORT, () => {
    console.log(`Server is running on https://drinks.lukas-bumes:${PORT}`);
});
