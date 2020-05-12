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
		this.load.image(
			CST.ASSETS.SHIPS.ENEMY_SHIP,
			"src/assets/red_ship.png"
		);
		this.load.image(
			CST.ASSETS.SHIPS.ENEMY_BULLET,
			"src/assets/red_bullet.png"
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
