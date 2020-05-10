import Phaser from "phaser";
import PreGame from "./scenes/pregame";
import Game from "./scenes/game";
import PostGame from "./scenes/postgame";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: [ PreGame, Game, PostGame ],
};

const game = new Phaser.Game(config);
