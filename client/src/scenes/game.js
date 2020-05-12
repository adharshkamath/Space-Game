import Phaser from "phaser";
import io from "socket.io-client";
import { PlayerShip, EnemyShip } from "../helpers/ship";
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
		this.player = {};
		this.enemies;
	}

	preload() {}

	create() {
		this.setBackground(CST.ASSETS.BACKGROUNDS.GAME_BG);
		this.player = new PlayerShip(
			this,
			this.player,
			window.innerWidth,
			window.innerHeight
		);
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
		this.player.steerShip(this, this.player, time);
	}

	setBackground(image) {
		this.add.image(0, 0, image).setOrigin(0);
		this.add.image(window.innerWidth, 0, image).setOrigin(0).setFlipX(true);
		this.add
			.image(0, window.innerHeight, image)
			.setOrigin(0)
			.setFlipY(true);
		this.add
			.image(window.innerWidth, window.innerHeight, image)
			.setOrigin(0)
			.setFlipX(true)
			.setFlipY(true);
	}
}
