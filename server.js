const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

let connectedUsers = 0;
let userColors = {};

io.on('connection', function (socket) {
    connectedUsers++;
    console.log(`A user has connected. Total connected users: ${connectedUsers}`);

    socket.on('user color', function (color) {
        console.log('socket server side color: ', color)
        userColors[socket.id] = color;
    });

    socket.on('disconnect', function () {
        connectedUsers--;
        console.log(`A user has disconnected. Total connected users: ${connectedUsers}`);
        delete userColors[socket.id];
    });

    socket.on('marker placed', function (coords) {
        io.emit('marker placed', { coords });
    });

    socket.on('clear markers', function () {
        io.emit('clear markers');
    });
});

app.use(express.static('public'));
app.use('/media', express.static(__dirname + '/media'));
app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io/client-dist/'));

app.get('/', function (_, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/css/style.css', function (req, res) {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(__dirname + '/css/style.css');
});

app.get('/js/script.js', function (req, res) {
    res.setHeader('Content-Type', 'text/javascript');
    res.sendFile(__dirname + '/js/script.js');
});

server.listen(3000, function () {
    console.log('Server started on port 3000');
});