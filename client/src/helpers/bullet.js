import CST from "../cst";

export default class Bullet extends Phaser.Physics.Arcade.Image {
	constructor(scene) {
		super(scene, 0, 0, CST.ASSETS.SHIPS.PLAYER_BULLET);
		this.setBlendMode(1);
		this.setDepth(1);
		this.speed = 1000;
		this.lifeSpan = 1000;
	}

	fire(ship) {
		this.lifeSpan = 1000;
		this.setVisible(true);
		this.setActive(true);
		this.setAngle(ship.body.rotation);
		this.setPosition(ship.x, ship.y);
		this.body.reset(ship.x, ship.y);
		this.scene.physics.velocityFromRotation(
			Phaser.Math.DegToRad(ship.body.rotation),
			this.speed,
			this.body.velocity
		);
		this.body.velocity.x *= 2;
		this.body.velocity.y *= 2;
	}

	update(time, delta) {
		this.lifeSpan -= delta;
		if (this.lifeSpan <= 0) {
			this.setActive(false);
			this.setVisible(false);
			this.body.stop();
		}
	}
}
