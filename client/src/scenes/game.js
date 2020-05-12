import Phaser from "phaser";
import Bullet from "../helpers/bullet";
import io from "socket.io-client";
import CST from "../cst";
export default class Game extends Phaser.Scene {
  constructor() {
    super({
      key: CST.SCENES.GAME,
    });
    this.backgroundImage;
    this.ship;
    this.shipControls;
    this.bullets;
    this.lastFired;
    this.socket;
  }

  preload() {
    this.load.image(
      CST.ASSETS.BACKGROUNDS.GAME_BG,
      "src/assets/background.jpeg"
    );
    this.load.image(CST.ASSETS.SHIPS.PLAYER_SHIP, "src/assets/blue_ship.png");
    this.load.image(
      CST.ASSETS.SHIPS.PLAYER_BULLET,
      "src/assets/blue_bullet.png"
    );
  }

  create() {
    this.add.image(0, 0, CST.ASSETS.BACKGROUNDS.GAME_BG).setOrigin(0);
    this.add
      .image(window.innerWidth, 0, CST.ASSETS.BACKGROUNDS.GAME_BG)
      .setOrigin(0)
      .setFlipX(true);
    this.add
      .image(0, window.innerHeight, CST.ASSETS.BACKGROUNDS.GAME_BG)
      .setOrigin(0)
      .setFlipY(true);
    this.add
      .image(
        window.innerWidth,
        window.innerHeight,
        CST.ASSETS.BACKGROUNDS.GAME_BG
      )
      .setOrigin(0)
      .setFlipX(true)
      .setFlipY(true);
    this.addShip();
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
    this.cameras.main.startFollow(this.ship);
    this.socket = io("http://localhost:3000");
    this.socket.on("playerMoved", (locationInfo, shipID) => {
      console.log(locationInfo);
      console.log(shipID);
    });
    this.socket.on("shotFired", (bulletInfo, shipID) => {
      console.log(bulletInfo);
      console.log(shipID);
    });
  }

  update(time, delta) {
    this.steerShip(time);
  }

  addShip() {
    this.ship = this.physics.add
      .sprite(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        CST.ASSETS.SHIPS.PLAYER_SHIP
      )
      .setDepth(2);
    this.ship.setDrag(300);
    this.ship.setAngularDrag(400);
    this.ship.setMaxVelocity(600);
    this.ship.body.setCollideWorldBounds(true);
    this.shipControls = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      fire: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });
    this.bullets = this.physics.add.group({
      classType: Bullet,
      maxSize: 100,
      runChildUpdate: true,
    });
    this.lastFired = 100;
  }

  steerShip(time) {
    var moved = false;
    if (this.shipControls.left.isDown) {
      moved = true;
      this.ship.setAngularVelocity(-150);
    } else if (this.shipControls.right.isDown) {
      moved = true;
      this.ship.setAngularVelocity(+150);
    } else {
      this.ship.setAngularVelocity(0);
    }
    if (this.shipControls.up.isDown) {
      moved = true;
      this.physics.velocityFromRotation(
        this.ship.rotation,
        750,
        this.ship.body.acceleration
      );
    } else {
      this.ship.setAcceleration(0);
    }
    if (this.shipControls.fire.isDown && time > this.lastFired) {
      var bullet = this.bullets.get();
      if (bullet) {
        bullet.fire(this.ship);
        this.lastFired = time + 100;
        this.socket.emit("shotFired", [
          bullet.x,
          bullet.y,
          bullet.angle,
          bullet.speed,
          bullet.rotation,
        ]);
      }
    }
    if (moved) {
      this.socket.emit("playerMoved", [
        this.ship.x,
        this.ship.y,
        this.ship.angle,
      ]);
    }
  }
}
