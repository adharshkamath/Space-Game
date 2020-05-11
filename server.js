const express = require('express')();
const server = require('http').createServer(express);
const io = require('socket.io')(server);

let players = [];

io.on('connection', (socket) => {
    console.log("Client connected w ID: " + socket.id);

    socket.on('playerMoved', function(locationInfo) {
        console.log(locationInfo);
        socket.broadcast.emit('playerMoved', locationInfo, socket.id);
    });

    socket.on('shotFired', function(bulletInfo) {
        console.log(bulletInfo);
        console.log(socket.id);
        socket.broadcast.emit('shotFired', bulletInfo, socket.id);
    });

});

server.listen(3000, () => {
    console.log("Server listening on port 3000");
});