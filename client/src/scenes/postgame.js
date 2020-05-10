export default class PostGame extends Phaser.Scene {
    constructor() {
        super({
            key: "PostGame"
        });
    }

    preload() {
        this.load.image("Image3", "src/assets/forgotten-worlds.png");
    }
    
    create() {
        this.add.image(100, 100, "Image3");
        this.input.on("pointerdown", function() {
            this.scene.start("PreGame");
        }, this);
    }

    update() {
        
    }
}