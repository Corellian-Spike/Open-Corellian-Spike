'use strict';

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const Game = require('./lib/game');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let sequentialId = 0;
let game = new Game(2);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('check-id');
  socket.on('no-id', () => {
    socket.emit('new-id', sequentialId);
    console.log('issuing id:', sequentialId++)
  });
  socket.on('show-id', (id) => {
    console.log('showed id:', id);
    if (id === 1) {
      game.start();
      io.emit('gameInfoPublic', game.infoPublic);
      console.log('starting game');
    };
  });
  socket.on('getPlayer', (id) => {
    socket.emit('sendPlayer', game.table.players[id].infoPrivate)
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
