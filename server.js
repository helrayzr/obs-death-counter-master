// Load the express module.
var express = require('express');
var app = express();
var path = require('path');
var count = 0;
var streamcount = 0;
var fs = require('fs');
var counts = require('./counts.json');
var title = "Death Counter";
var currentgame = "";

// Load in the config.
let rawconfig = fs.readFileSync('config.json');
let config = JSON.parse(rawconfig);

// Set up the static asset directory.
app.use(express.static('public'));

// Respond to requests for / with index.html.
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '', 'index.html'));
});

app.get('/streamdeaths', function(req, res){
    res.sendFile(path.join(__dirname, '', 'streamdeaths.html'));
});


app.get('/debug', function(req, res){
    console.log(count);
	console.log(title);
	console.log(currentgame);
	res.send("Debug sent to console.");
});


// Respond to requests for /current with current count.
app.get('/current', function(req, res){
	res.send(String(count));
});

app.get('/streamdeathscurrent', function(req, res){
	res.send(String(streamcount));
});


app.get('/title', function(req, res){
    res.send(String(title));
});


// Respond to requests for /config with current config.
app.get('/config', function(req, res){
    res.send(config);
});

app.get('/game/:game', (req, res) => {
	let len = counts.length;
	for(i=0;i<len;i++) {
		let game = counts[i].game
		if (req.params.game.toUpperCase() === game) {
			count = counts[i].deaths;
			currentgame = counts[i].game;
			title = `Death Counter (${game})`;
			res.send(`game found - ${game}`);
			return;
		}
	}
	let newgame = {
		"game": req.params.game.toUpperCase(),
		"deaths": "0"
	};
	counts[counts.length] = newgame;
	data = JSON.stringify(counts);
	fs.writeFile("counts.json", data, function(err) {
		if (err) {
			console.log(err);
		};
	});
	title = `Death Counter (${req.params.game.toUpperCase()})`;
	count = 0;
	currentgame = req.params.game.toUpperCase();
	res.send(`New Game: ${currentgame}`);
})

// Incrementing the count by 1 via /death or reset the count via /reset
app.get('/death', function(req, res){
    count++;
    streamcount++;
	res.send('New value: ' + count);
	let len = counts.length;
	for(i=0;i<len;i++) {
		let game = counts[i].game
		if (currentgame === game) {
			counts[i].deaths = count;
		}
	}
	data = JSON.stringify(counts);
	fs.writeFile("counts.json", data, function(err) {
		if (err) {
			console.log(err);
		};
	});
});
app.get('/reset', function(req, res){
    count--;
    streamcount--;
	res.send('New value: ' + count);
	let len = counts.length;
	for(i=0;i<len;i++) {
		let game = counts[i].game
		if (currentgame === game) {
			counts[i].deaths = count;
		}
	}
	data = JSON.stringify(counts);
	fs.writeFile("counts.json", data, function(err) {
		if (err) {
			console.log(err);
		};
	});
});

// Start listening on configured port.
app.listen(config.server_port);
console.log('Server listening on port ' + config.server_port + '.');
