import Bullet from "../helpers/bullet";
export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: "Game"
        });
        this.backgroundImage;
        this.ship;
        this.shipControls;
        this.bullets;
        this.lastFired;
    }


    preload() {
        this.load.image("backgound", "src/assets/background.jpeg");
        this.load.image("ship", "src/assets/blue_ship.png");
        this.load.image("bullet", "src/assets/blue_bullet.png");
    }
    
    create() {
        this.add.image(0, 0, "backgound").setOrigin(0);
        this.add.image(window.innerWidth, 0, "backgound").setOrigin(0).setFlipX(true);
        this.add.image(0, window.innerHeight, "backgound").setOrigin(0).setFlipY(true);
        this.add.image(window.innerWidth, window.innerHeight, "backgound").setOrigin(0).setFlipX(true).setFlipY(true);
        this.addShip();
        this.cameras.main.setBounds(0, 0, window.innerWidth * 2, window.innerHeight * 2);
        this.cameras.main.startFollow(this.ship);
    }

    update(time, delta) {
        this.steerShip(time);
    }


    addShip() {
        this.ship = this.physics.add.sprite(this.cameras.main.width/2, this.cameras.main.height/2, "ship").setDepth(2);
        this.ship.setDrag(300);
        this.ship.setAngularDrag(400);
        this.ship.setMaxVelocity(600);
        this.shipControls = this.input.keyboard.createCursorKeys();
        this.fire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.bullets = this.physics.add.group({
            classType: Bullet,
            maxSize: 100,
            runChildUpdate: true
        });
        this.lastFired = 100;
    }

    steerShip(time) {
        if(this.shipControls.left.isDown) {
            this.ship.setAngularVelocity(-150);
        }
        else if (this.shipControls.right.isDown) {
            this.ship.setAngularVelocity(+150);
        }
        else {
            this.ship.setAngularVelocity(0);
        }
        if(this.shipControls.up.isDown) {
            this.physics.velocityFromRotation(this.ship.rotation, 750, this.ship.body.acceleration);
        }
        else {
            this.ship.setAcceleration(0);
        }
        if(this.fire.isDown && time > this.lastFired) {
            var bullet = this.bullets.get();
            if(bullet) {
                bullet.fire(this.ship);
                this.lastFired = time + 100;
            }
        }
        this.physics.world.wrap(this.ship);
    }
}