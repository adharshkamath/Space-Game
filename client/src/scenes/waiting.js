import Phaser from "phaser";
import io from "socket.io";
import CST from "../cst";

export default class Waiting extends Phaser.Scene {
    constructor() {
        super({
            key: "waiting"
        });
        this.socket;
    }

    init(data) {
        this.socket = data;
    }

    preload() {

    }

    create() {

    }

    update() {

    }

}