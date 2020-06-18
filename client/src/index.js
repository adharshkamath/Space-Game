import Phaser from "phaser";
import Game from "./scenes/game";
import LoadScene from "./scenes/load";
import Result from "./scenes/result";

const config = {
	type: Phaser.AUTO,
	parent: "game",
	width: window.innerWidth,
	height: window.innerHeight,
	scene: [LoadScene, Game, Result],
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 0 },
			debug: false,
		},
	},
};

const game = new Phaser.Game(config);
