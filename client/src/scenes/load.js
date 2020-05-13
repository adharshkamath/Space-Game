import Phaser from "phaser";
import CST from "../cst";

export default class LoadScene extends Phaser.Scene {
	constructor() {
		super({
			key: CST.SCENES.LOAD,
		});
	}

	preload() {
		this.load.image(
			CST.ASSETS.BACKGROUNDS.GAME_BG,
			"src/assets/background.jpeg"
		);
		this.load.image(
			CST.ASSETS.SHIPS.PLAYER_SHIP,
			"src/assets/blue_ship.png"
		);
		this.load.image(
			CST.ASSETS.SHIPS.PLAYER_BULLET,
			"src/assets/blue_bullet.png"
		);
		this.load.image(CST.ASSETS.SHIPS.ENEMY_SHIP, "src/assets/red_ship.png");
		this.load.image(
			CST.ASSETS.SHIPS.ENEMY_BULLET,
			"src/assets/red_bullet.png"
		);

		this.load.image(CST.ASSETS.SHIPS.PLAYER_EXHAUST, "src/assets/blue.png");

		this.load.image(CST.ASSETS.SHIPS.ENEMY_EXHAUST, "src/assets/red.png");

		this.load.image(
			CST.ASSETS.EXTRAS.BIG_ASTEROID,
			"src/assets/meteor_big.png"
		);

		this.load.image(
			CST.ASSETS.EXTRAS.MED_ASTROID,
			"src/assets/meteor_med.png"
		);

		this.load.image(
			CST.ASSETS.EXTRAS.SMALL_ASTEROID,
			"src/assets/meteor_tiny.png"
		);

		this.load.image(CST.ASSETS.EXTRAS.BOOST, "src/assets/powerup_bolt.png");

		this.load.audio(
			CST.ASSETS.SHIPS.LASER_AUDIO,
			"src/assets/laser_audio.ogg"
		);

		this.load.spritesheet(
			CST.ASSETS.SHIPS.EXPLOSION,
			"src/assets/shipExplosion.png",
			{ frameWidth: 100, frameHeight: 100 }
		);

		this.load.audio(
			CST.ASSETS.SHIPS.EXPLOSION_AUDIO,
			"src/assets/explosion.mp3"
		)

		this.load.spritesheet(
			CST.ASSETS.EXTRAS.BIG_ASTEROID_EXPLOSION,
			"src/assets/asteroidExplosion.png",
			{ frameWidth: 100, frameHeight: 100 }
		);

		let loadingBar = this.add.graphics({
			fillStyle: { color: 0xffffff },
		});

		this.load.on("progress", (percent) => {
			loadingBar.fillRect(
				0,
				this.game.renderer.height / 2 - 50,
				this.game.renderer.width * percent,
				50
			);
			console.log(percent);
		});

		this.load.on("complete", () => {
			console.log("Done loading");
			this.scene.start(CST.SCENES.GAME);
		});
	}

	create() {}
}
