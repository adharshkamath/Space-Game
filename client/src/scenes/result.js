import Phaser from "phaser";

export default class Result extends Phaser.Scene {
    constructor() {
        super({
            key: "result"
        });
        this.result;
    }

    init(data) {
        this.result = data.result;
    }

    preload() {

    }

    create() {
        this.cameras.main.setBackgroundColor("#0000");
        if(this.result) {
            this.add.text(window.innerWidth/2 - 50, window.innerHeight/2, "You Won! :)").setFontSize(50);
        }
        else {
            this.add.text(window.innerWidth/2- 50, window.innerHeight/2, "You Died :(").setFontSize(50);
        }
    }

    update() {

    }

}