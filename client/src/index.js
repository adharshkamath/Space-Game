import Phaser from "phaser";
import Game from "./scenes/game";
import LoadScene from "./scenes/load";

const config = {
	type: Phaser.AUTO,
	parent: "game",
	width: window.innerWidth,
	height: window.innerHeight,
	scene: [LoadScene, Game],
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 0 },
			debug: false,
		},
	},
};

const game = new Phaser.Game(config);
