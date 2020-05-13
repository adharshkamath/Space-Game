const express = require('express')();
const server = require('http').createServer(express);
const io = require('socket.io')(server);
const playersPerRoom = 3;
var rooms = [null];

io.on('connection', (socket) => {
    var firstPlayer = "";
    console.log("Client connected w ID: " + socket.id);
    if(rooms[rooms.length - 1] == null) {
        rooms[rooms.length - 1] = [];
        rooms[rooms.length - 1].push(socket.id);
        firstPlayer = socket.id;
        console.log(rooms);
    }

    else if(rooms[rooms.length - 1].length < playersPerRoom - 1) {
        rooms[rooms.length - 1].push(socket.id);
        firstPlayer = rooms[rooms.length - 1][0];
        socket.join(firstPlayer);
        console.log(rooms);
    }

    else if(rooms[rooms.length - 1].length == playersPerRoom - 1) {
        rooms[rooms.length - 1].push(socket.id);
        firstPlayer = rooms[rooms.length - 1][0];
        socket.join(firstPlayer);
        rooms.push(null);
        console.log(rooms);
    }

    console.log(firstPlayer);

    socket.on('playerMoved', function(locationInfo) {
        console.log(locationInfo);
        socket.broadcast.emit('playerMoved', locationInfo, socket.id);
        console.log(socket.adapter.rooms[socket.id].length);
    });

    socket.on('shotFired', function(bulletInfo) {
        console.log(bulletInfo);
        console.log(socket.id);
        socket.broadcast.emit('shotFired', bulletInfo, socket.id);
    });

    socket.on('disconnect', function() {
        console.log(socket.id + " disconnected");
    });

});

server.listen(3000, () => {
    console.log("Server listening on port 3000");
});