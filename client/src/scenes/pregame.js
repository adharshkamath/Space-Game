export default class PreGame extends Phaser.Scene {
    constructor() {
        super({
            key: "PreGame"
        });
    }

    preload() {
        this.load.image("Image2", "src/assets/contra2.png");
    }
    
    create() {
        this.add.image(100, 100, "Image2");
        this.input.on("pointerdown", function() {
            this.scene.start("Game");
        }, this);
    }

    update() {
        
    }
}