export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: "Game"
        });
    }

    preload() {
        this.load.image("Image1", "src/assets/contra1.png");
    }
    
    create() {
        this.add.image(100, 100, "Image1");
        this.input.on("pointerdown", function() {
            this.scene.start("PostGame");
        }, this);
    }

    update() {

    }
}