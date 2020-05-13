import Phaser from "phaser";
import io from "socket.io-client";
import { PlayerShip, EnemyShip } from "../helpers/ship";
import { Extras } from "../helpers/extras";
import CST from "../cst";

export default class Game extends Phaser.Scene {
  constructor() {
    super({
      key: CST.SCENES.GAME,
    });
    this.socket;
    this.player = {};
    this.player.alive = true;
    this.player.powerups = 0;
    this.enemies = [];
    this.extras = {};
  }

  preload() {}

  create() {
    let self = this;
    this.setBackground(CST.ASSETS.BACKGROUNDS.GAME_BG);
    let initX = window.innerWidth;
    let initY = window.innerHeight;
    this.player = new PlayerShip(this, this.player, initX, initY);
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

    this.socket.emit("newPlayerJoined", [initX, initY]);

    this.socket.on("playerMoved", (locationInfo, shipID) => {
      console.log(locationInfo);
      console.log(shipID);
    });
    this.socket.on("shotFired", (bulletInfo, shipID) => {
      console.log(bulletInfo);
      console.log(shipID);
    });
    this.extras = new Extras(self);
  }

  update(time, delta) {
    if (this.player.alive) {
      this.player.steerShip(this, this.player, time);
    } else {
      this.player.ship.destroy();
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
