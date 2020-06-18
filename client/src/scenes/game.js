import Phaser from "phaser";
import io from "socket.io-client";
import { PlayerShip, EnemyShip } from "../helpers/ship";
import {
  addTurrets,
  addExtras,
  getExtrasConfig,
  addExtrasFromConfig,
  addCollisions,
} from "../helpers/extras";
import CST from "../cst";

export default class Game extends Phaser.Scene {
  constructor() {
    super({
      key: CST.SCENES.GAME,
    });
    this.socket;
    this.player;
    this.enemies = [];
    this.enemyMap = new Map();
    this.extras = {};
    this.firstPlayer = false;
    this.sceneCreated = false;
  }

  preload() {}

  create() {
    this.scene.pause(CST.SCENES.GAME);
    let self = this;
    this.setBackground(CST.ASSETS.BACKGROUNDS.GAME_BG);
    let initX = Phaser.Math.Between(0, window.innerWidth * 2);
    let initY = Phaser.Math.Between(0, window.innerHeight * 2);
    this.player = new PlayerShip(this, initX, initY);
    this.cameras.main.setBounds(
      0,
      0,
      window.innerWidth * 2,
      window.innerHeight * 2
    );
    this.physics.world.setBounds(
      0,
      0,
      window.innerWidth * 2,
      window.innerHeight * 2
    );
    this.cameras.main.startFollow(this.player.ship);
    this.socket = io("http://localhost:3000");
    this.socket.emit("newPlayerJoined", [
      this.player.ship.x,
      this.player.ship.y,
      this.player.ship.angle,
    ]);
    this.socket.on("newPlayerJoined", function (locationInfo, shipID) {
      if (shipID != self.socket.id) {
        if (!self.enemyMap.has(shipID)) {
          console.log("Adding Player " + locationInfo);
          self.enemies.push(
            new EnemyShip(
              self,
              locationInfo[0],
              locationInfo[1],
              locationInfo[2],
              shipID
            )
          );
          self.enemyMap.set(shipID, self.enemies.length - 1);
        }
      }
      self.socket.emit("roomPlayerDetails", [
        self.player.ship.x,
        self.player.ship.y,
        self.player.ship.angle,
      ]);
    });
    this.socket.on("roomPlayerDetails", function (locationInfo, shipID) {
      if (!self.enemyMap.has(shipID)) {
        console.log("Adding Player " + locationInfo);
        self.enemies.push(
          new EnemyShip(
            self,
            locationInfo[0],
            locationInfo[1],
            locationInfo[2],
            shipID
          )
        );
        self.enemyMap.set(shipID, self.enemies.length - 1);
      }
    });
    this.socket.on("firstPlayer", function () {
      console.log("firstPlayer");
      self.firstPlayer = true;
    });
    this.socket.on("roomFull", function () {
      console.log("Room full");
      if (self.firstPlayer) {
        self.sceneCreated = true;
        self.extras = addExtras(self);
        let extrasConfig = getExtrasConfig(self.extras);
        self.enemies.forEach((value) => addCollisions(value, self));
        self.socket.emit("extrasData", extrasConfig);
        self.socket.emit("playerReady");
      }
    });
    this.socket.on("extrasData", function (config) {
      if (!self.sceneCreated) {
        self.sceneCreated = true;
        self.extras = addExtrasFromConfig(self, config);
        self.enemies.forEach((value) => addCollisions(value, self));
        self.socket.emit("playerReady");
      }
    });
    this.socket.on("startGame", function () {
      self.scene.resume();
    });
    this.socket.on("playerMoved", function (moveMade, shipID) {
      let enemy = self.enemies[self.enemyMap.get(shipID)];
      enemy.moveShip(self, moveMade);
    });
    this.socket.on("youWon", function () {
      self.scene.start("result", { result: true });
    });
  }

  update(time, delta) {
    if (this.player.alive) {
      this.player.steerShip(this, time);
    } else {
      this.player.ship.destroy();
      this.scene.start("result", { result: false });
      this.socket.disconnect();
      return;
    }
  }

  setBackground(image) {
    this.add.image(0, 0, image).setOrigin(0);
    this.add.image(window.innerWidth, 0, image).setOrigin(0).setFlipX(true);
    this.add.image(0, window.innerHeight, image).setOrigin(0).setFlipY(true);
    this.add
      .image(window.innerWidth, window.innerHeight, image)
      .setOrigin(0)
      .setFlipX(true)
      .setFlipY(true);
  }
}
