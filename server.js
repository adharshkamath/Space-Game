const express = require("express")();
const server = require("http").createServer(express);
const io = require("socket.io")(server);
const playersPerRoom = 3;
let rooms = [null];

io.on("connection", (socket) => {
	let firstPlayer = "";
	let roomNumber = -1;
	if (rooms[rooms.length - 1] == null) {
		if (
			rooms.length < 2 ||
			rooms[rooms.length - 2].length == playersPerRoom
		) {
			rooms[rooms.length - 1] = [];
			rooms[rooms.length - 1].push([socket.id, false]);
			firstPlayer = socket.id;
			roomNumber = rooms.length - 1;
			io.sockets.to(firstPlayer).emit("firstPlayer");
		} else {
			rooms[rooms.length - 2].push([socket.id, false]);
			firstPlayer = rooms[rooms.length - 2][0][0];
			roomNumber = rooms.length - 2;
		}
	} else if (rooms[rooms.length - 1].length < playersPerRoom - 1) {
		rooms[rooms.length - 1].push([socket.id, false]);
		firstPlayer = rooms[rooms.length - 1][0][0];
		socket.join(firstPlayer);
		roomNumber = rooms.length - 1;
	} else if (rooms[rooms.length - 1].length == playersPerRoom - 1) {
		rooms[rooms.length - 1].push([socket.id, false]);
		firstPlayer = rooms[rooms.length - 1][0][0];
		socket.join(firstPlayer);
		roomNumber = rooms.length - 1;
		rooms.push(null);
	}

	socket.on("newPlayerJoined", function (locationInfo) {
		socket.broadcast
			.to(firstPlayer)
			.emit("newPlayerJoined", locationInfo, socket.id);
		console.log(rooms);
		if (rooms[roomNumber].length == playersPerRoom) {
			console.log(rooms[roomNumber].length, playersPerRoom);
			io.sockets.to(firstPlayer).emit("roomFull");
			console.log(rooms);
		}
	});

	socket.on("extrasData", function (data) {
		socket.broadcast.to(firstPlayer).emit("extrasData", data);
	});

	socket.on("roomPlayerDetails", function (locationInfo) {
		socket.broadcast
			.to(firstPlayer)
			.emit("roomPlayerDetails", locationInfo, socket.id);
	});
	socket.on("playerReady", function () {
		let index = -1;
		for (let j = 0; j < rooms[roomNumber].length; j++) {
			if (rooms[roomNumber][j][0] == socket.id) {
				index = j;
			}
		}
		console.log(index);
		rooms[roomNumber][index][1] = true;
		let flag = true;
		for (let i = 0; i < rooms[roomNumber].length; i++) {
			if (rooms[roomNumber][i][1] == false) {
				flag = false;
			}
		}
		if (flag) {
			io.sockets.to(firstPlayer).emit("startGame");
		}
	});

	socket.on("playerMoved", function (moveMade) {
		socket.broadcast
			.to(firstPlayer)
			.emit("playerMoved", moveMade, socket.id);
	});
	socket.on("disconnect", function () {
		rooms[roomNumber] = rooms[roomNumber].filter(function (value) {
			return value[0] != socket.id;
		});
		if (rooms[roomNumber].length == 0) {
			rooms.splice(roomNumber, 1);
			if (rooms[rooms.length - 1] != null || rooms.length == 0) {
				rooms.push(null);
			}
		}
		console.log(rooms.length, rooms);
		console.log(socket.id + " disconnected");
	});
});

server.listen(3000, (port) => {
	console.log("Server listening on port " + port);
});
