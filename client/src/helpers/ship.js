import Phaser from "phaser";
import { PlayerBullet, EnemyBullet } from "./bullet";
import CST from "../cst";

class Ship {
	constructor(scene, shipSprite, x, y, exhaustSprite) {
		let self = this;
		this.alive = true;
		this.ship = scene.physics.add.sprite(x, y, shipSprite).setDepth(2);
		this.ship.setDrag(300);
		this.ship.setAngularDrag(400);
		this.ship.setMaxVelocity(600);
		this.ship.body.setCollideWorldBounds(true);
		this.emitter = scene.add.particles(exhaustSprite).createEmitter({
			speed: 100,
			lifespan: {
				onEmit: function () {
					if (self.alive) {
						return (
							Phaser.Math.Percent(self.ship.body.speed, 0, 300) *
							500
						);
					}
				},
			},
			alpha: {
				onEmit: function () {
					if (self.alive) {
						return Phaser.Math.Percent(
							self.ship.body.speed,
							0,
							300
						);
					}
				},
			},
			angle: {
				onEmit: function () {
					if (self.alive) {
						return (
							self.ship.angle - 180 + Phaser.Math.Between(-10, 10)
						);
					}
				},
			},
			scale: { start: 0.4, end: 0 },
			blendMode: "ADD",
		});
		this.emitter.startFollow(this.ship);
		scene.anims.create({
			key: CST.ASSETS.SHIPS.EXPLOSION,
			duration: 1000,
			repeat: 0,
			frames: scene.anims.generateFrameNames(CST.ASSETS.SHIPS.EXPLOSION),
		});
		this.powerups = 0;
	}
}

class PlayerShip extends Ship {
	constructor(scene, x, y) {
		super(
			scene,
			CST.ASSETS.SHIPS.PLAYER_SHIP,
			x,
			y,
			CST.ASSETS.SHIPS.PLAYER_EXHAUST
		);
		this.ship.angle = Phaser.Math.Between(0, 360);
		this.shipControls = scene.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			right: Phaser.Input.Keyboard.KeyCodes.D,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			fire: Phaser.Input.Keyboard.KeyCodes.SPACE,
		});
		this.bullets = scene.physics.add.group({
			classType: PlayerBullet,
			maxsize: 100,
			runChildUpdate: true,
		});
		this.lastFired = 100;
	}

	steerShip(scene, time) {
		let moved = false;
		let wasdf = [false, false, false, false];
		if (this.shipControls.left.isDown) {
			moved = true;
			wasdf[1] = true;
			this.ship.setAngularVelocity(-150);
		} else if (this.shipControls.right.isDown) {
			moved = true;
			wasdf[2] = true;
			this.ship.setAngularVelocity(+150);
		} else {
			this.ship.setAngularVelocity(0);
		}
		if (this.shipControls.up.isDown) {
			moved = true;
			wasdf[0] = true;
			scene.physics.velocityFromRotation(
				this.ship.rotation,
				750,
				this.ship.body.acceleration
			);
		} else {
			this.ship.setAcceleration(0);
		}
		if (this.shipControls.fire.isDown && time > this.lastFired) {
			scene.sound.play(CST.ASSETS.SHIPS.LASER_AUDIO);
			var bullet = this.bullets.get();
			if (bullet) {
				bullet.fire(this.ship);
				this.lastFired = time + 100;
			}
			wasdf[3] = true;
		}
		scene.socket.emit("playerMoved", wasdf);
	}
}

class EnemyShip extends Ship {
	constructor(scene, x, y, angle, shipID) {
		super(
			scene,
			CST.ASSETS.SHIPS.ENEMY_SHIP,
			x,
			y,
			CST.ASSETS.SHIPS.ENEMY_EXHAUST
		);
		this.id = shipID;
		this.ship.angle = angle;
		scene.physics.add.collider(scene.player.ship, this.ship);
		this.bullets = scene.physics.add.group({
			classType: EnemyBullet,
			maxsize: 100,
			runChildUpdate: true,
		});
	}

	moveShip(scene, move) {
		if (move[1]) {
			this.ship.setAngularVelocity(-150);
		} else if (move[2]) {
			this.ship.setAngularVelocity(+150);
		} else {
			this.ship.setAngularVelocity(0);
		}
		if (move[0]) {
			scene.physics.velocityFromRotation(
				this.ship.rotation,
				750,
				this.ship.body.acceleration
			);
		} else {
			this.ship.setAcceleration(0);
		}
		if (move[3]) {
			if (this.alive) {
				this.fireBullet(scene);
			} else {
				this.ship.destroy();
				return;
			}
		}
	}

	fireBullet(scene) {
		scene.sound.play(CST.ASSETS.SHIPS.LASER_AUDIO);
		var bullet = this.bullets.get();
		if (bullet) {
			bullet.fire(this.ship);
		}
	}
}

export { PlayerShip, EnemyShip };
