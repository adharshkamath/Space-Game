import { PlayerBullet, EnemyBullet } from "./bullet";
import CST from "../cst";

export default class Ship {
	constructor(scene, player, shipSprite, x, y, exhaustSprite) {
		player.ship = scene.physics.add.sprite(x, y, shipSprite).setDepth(2);
		player.ship.setDrag(300);
		player.ship.setAngularDrag(400);
		player.ship.setMaxVelocity(600);
		player.ship.body.setCollideWorldBounds(true);
		player.emitter = scene.add.particles(exhaustSprite).createEmitter({
			speed: 100,
			lifespan: {
				onEmit: function () {
					if (player.alive) {
						return (
							Phaser.Math.Percent(
								player.ship.body.speed,
								0,
								300
							) * 500
						);
					}
				},
			},
			alpha: {
				onEmit: function () {
					if (player.alive) {
						return Phaser.Math.Percent(
							player.ship.body.speed,
							0,
							300
						);
					}
				},
			},
			angle: {
				onEmit: function () {
					if (player.alive) {
						return (
							player.ship.angle -
							180 +
							Phaser.Math.Between(-10, 10)
						);
					}
				},
			},
			scale: { start: 0.4, end: 0 },
			blendMode: "ADD",
		});
		player.emitter.startFollow(player.ship);
	}
}

class PlayerShip extends Ship {
	constructor(scene, player, x, y) {
		super(
			scene,
			player,
			CST.ASSETS.SHIPS.PLAYER_SHIP,
			x,
			y,
			CST.ASSETS.SHIPS.PLAYER_EXHAUST
		);
		player.steerShip = this.steerShip;
		player.shipControls = scene.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			right: Phaser.Input.Keyboard.KeyCodes.D,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			fire: Phaser.Input.Keyboard.KeyCodes.SPACE,
		});
		player.bullets = scene.physics.add.group({
			classType: PlayerBullet,
			maxsize: 100,
			runChildUpdate: true,
		});
		player.lastFired = 100;
		return player;
	}

	steerShip(scene, player, time) {
		var moved = false;
		if (player.shipControls.left.isDown) {
			moved = true;
			player.ship.setAngularVelocity(-150);
		} else if (player.shipControls.right.isDown) {
			moved = true;
			player.ship.setAngularVelocity(+150);
		} else {
			player.ship.setAngularVelocity(0);
		}
		if (player.shipControls.up.isDown) {
			moved = true;
			scene.physics.velocityFromRotation(
				player.ship.rotation,
				750,
				player.ship.body.acceleration
			);
		} else {
			player.ship.setAcceleration(0);
		}
		if (player.shipControls.fire.isDown && time > player.lastFired) {
			var bullet = player.bullets.get();
			if (bullet) {
				bullet.fire(player.ship);
				player.lastFired = time + 100;
				scene.socket.emit("shotFired", [
					bullet.x,
					bullet.y,
					bullet.angle,
					bullet.speed,
					bullet.rotation,
				]);
			}
			if (player.powerups > 0) {
				player.powerups -= 1;
				var bullet = player.bullets.get();
				if (bullet) {
					bullet.fire(player.ship);
					scene.socket.emit("shotFired", [
						bullet.x,
						bullet.y,
						bullet.angle,
						bullet.speed,
						bullet.rotation,
					]);
				}
			}
		}
		if (moved) {
			scene.socket.emit("playerMoved", [
				player.ship.x,
				player.ship.y,
				player.ship.angle,
			]);
		}
	}
}

class EnemyShip extends Ship {
	constructor(scene, player, x, y) {
		super(
			scene,
			player,
			CST.ASSETS.SHIPS.PLAYER_SHIP,
			x,
			y,
			CST.ASSETS.SHIPS.ENEMY_EXHAUST
		);
		player.bullets = scene.physics.add.group({
			classType: EnemyBullet,
			maxsize: 100,
			runChildUpdate: true,
		});
		return player;
	}

	moveShip(player, newLocation) {
		player.ship.x = newLocation.x;
		player.ship.y = newLocation.y;
		player.ship.angle = newLocation.angle;
	}

	fireBullet(player) {
		var bullet = player.bullets.get();
		if (bullet) {
			bullet.fire(player.ship);
		}
	}
}

export { PlayerShip, EnemyShip };
