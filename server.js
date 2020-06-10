const express = require("express")();
const server = require("http").createServer(express);
const io = require("socket.io")(server);
const axios = require("axios").default;
require("dotenv").config();
const handlebars = require("express-handlebars");
const chatServer = require("express")();
const chatHttp = require("http").createServer(chatServer);
const chatApp = require("socket.io")(chatHttp);
const playersPerRoom = 3;
let rooms = [null];

const clientID = process.env.GITHUB_CLIENT;
const clientSecret = process.env.GITHUB_SECRET;
const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  let firstPlayer = "";
  let roomNumber = -1;
  if (rooms[rooms.length - 1] == null) {
    if (rooms.length < 2 || rooms[rooms.length - 2].length == playersPerRoom) {
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

  socket.on("chatMessage", function (message) {
    socket.broadcast.to(firstPlayer).emit("chatMessage", message);
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
    socket.broadcast.to(firstPlayer).emit("playerMoved", moveMade, socket.id);
  });
  socket.on("disconnect", function () {
    if (rooms[roomNumber] != null && rooms[roomNumber].length == 2) {
      io.to(firstPlayer).emit("youWon");
    }
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

const chat = chatApp.of("/chat");

chat.on("connection", (socket) => {
  console.log(socket.id + " connected to chat room");
  socket.broadcast.emit("new user", socket.id.slice(6));
  socket.on("chat message", (message) => {
    console.log(message);
    socket.broadcast.emit("chat message", message, socket.id.slice(6));
  });
  socket.on("typing", () => {
    socket.broadcast.emit("typing", socket.id.slice(6));
  });
  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected from chat room");
    socket.broadcast.emit("playerLeft", socket.id);
  });
});

// Game server stuff

express.use(require("cookie-parser")());
express.set("view engine", "hbs");
express.engine(
  "hbs",
  handlebars({
    layoutsDir: __dirname + "/views/layouts",
    extname: "hbs",
    defaultLayout: "index",
  })
);

express.use(
  require("express").static(require("path").join(__dirname, "public"))
);

express.get("/", (req, res) => {
  res.render("main");
});

express.get("/github-login", (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${clientID}`
  );
});

express.get("/profile", async (req, res) => {
  if (req.query.provider == "github") {
    try {
      const body = {
        client_id: clientID,
        client_secret: clientSecret,
        code: req.query.code,
      };
      const opts = {
        headers: {
          accept: "application/json",
        },
      };
      const accessToken = await (
        await axios.post(
          "https://github.com/login/oauth/access_token",
          body,
          opts
        )
      ).data.access_token;

      const config = {
        method: "get",
        url: "https://api.github.com/user",
        headers: { Authorization: `token ${accessToken}` },
      };

      const userData = await (await axios(config)).data;
      // console.log(userData);

      res.render("profile", { user: userData });
    } catch (error) {
      console.log("ERROR!!");
      console.log(error);
    }
  }
});

// Chatserver stuff

chatServer.set("view engine", "hbs");
chatServer.engine(
  "hbs",
  handlebars({
    layoutsDir: __dirname + "/views/layouts",
    extname: "hbs",
    defaultLayout: "index",
  })
);

chatServer.use(
  require("express").static(require("path").join(__dirname, "public"))
);

chatServer.get("/chat", (req, res) => {
  res.render("chat");
});

chatHttp.listen(4000, () => {
  console.log("Chat server listening on port " + 4000);
});

server.listen(3000, () => {
  console.log("Server listening on port " + 3000);
});
