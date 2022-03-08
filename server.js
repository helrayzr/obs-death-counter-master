// Load the express module.
var express = require('express');
var app = express();
var path = require('path');
var count = 0;
var fs = require('fs');

// Load in the config.
let rawconfig = fs.readFileSync('config.json');
let config = JSON.parse(rawconfig);

// Set up the static asset directory.
app.use(express.static('public'));

// Respond to requests for / with index.html.
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '', 'index.html'));
});

// Respond to requests for /current with current count.
app.get('/current', function(req, res){
    res.send(String(count));
});

// Respond to requests for /config with current config.
app.get('/config', function(req, res){
    res.send(config);
});

// Incrementing the count by 1 via /death or reset the count via /reset
app.get('/death', function(req, res){
    count++;
    res.send('New value: ' + count);
});
app.get('/reset', function(req, res){
    count = 0;
    res.send('New value: ' + count);
});

// Start listening on configured port.
app.listen(config.server_port);
console.log('Server listening on port ' + config.server_port + '.');
