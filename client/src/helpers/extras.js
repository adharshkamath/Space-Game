import Phaser from "phaser";
import CST from "../cst";

class Asteroids {
	constructor(scene) {
		var asteroids = scene.physics.add.group({
			key: CST.ASSETS.EXTRAS.BIG_ASTEROID,
			quantity: 2,
			bounceX: 1,
			bounceY: 1,
			collideWorldBounds: true,
			velocityX: Phaser.Math.Between(-300, 300),
			velocityY: Phaser.Math.Between(-300, 300),
		});
		Phaser.Actions.RandomRectangle(
			asteroids.getChildren(),
			scene.physics.world.bounds
		);
		scene.physics.add.collider(asteroids);
		return asteroids;
	}
}

class Meteors {
	constructor(scene) {
		var asteroids = scene.physics.add.group({
			key: CST.ASSETS.EXTRAS.MED_ASTROID,
			quantity: 3,
			bounceX: 1,
			bounceY: 1,
			collideWorldBounds: true,
			velocityX: Phaser.Math.Between(-700, 700),
			velocityY: Phaser.Math.Between(-700, 700),
		});
		Phaser.Actions.RandomRectangle(
			asteroids.getChildren(),
			scene.physics.world.bounds
		);
		scene.physics.add.collider(asteroids);
		return asteroids;
	}
}

class Rocks {
	constructor(scene) {
		var asteroids = scene.physics.add.group({
			key: CST.ASSETS.EXTRAS.SMALL_ASTEROID,
			quantity: 4,
			bounceX: 1,
			bounceY: 1,
			collideWorldBounds: true,
			velocityX: Phaser.Math.Between(-1000, 1000),
			velocityY: Phaser.Math.Between(-1000, 1000),
		});
		Phaser.Actions.RandomRectangle(
			asteroids.getChildren(),
			scene.physics.world.bounds
		);
		scene.physics.add.collider(asteroids);
		return asteroids;
	}
}

class PowerUps {
	constructor(scene) {
		var powerups = scene.physics.add.group({
			key: CST.ASSETS.EXTRAS.BOOST,
			quantity: 5,
			bounceX: 1,
			bounceY: 1,
			velocityX: 0,
			velocityY: 0,
			angularVelocity: 10,
		});
		Phaser.Actions.RandomRectangle(
			powerups.getChildren(),
			scene.physics.world.bounds
		);
		scene.physics.add.collider(powerups);
		return powerups;
	}
}

class Extras {
	constructor(scene) {
		let extras = {};
		extras.asteroids = new Asteroids(scene);
		extras.powerups = new PowerUps(scene);
		extras.meteors = new Meteors(scene);
		extras.rocks = new Rocks(scene);
		scene.physics.add.collider(extras.asteroids, extras.powerups);
		scene.physics.add.collider(extras.asteroids, extras.meteors);
		scene.physics.add.collider(extras.asteroids, extras.rocks);
		scene.physics.add.collider(extras.powerups, extras.meteors);
		scene.physics.add.collider(extras.powerups, extras.rocks);
		scene.physics.add.collider(extras.meteors, extras.rocks);
		scene.physics.add.collider(extras.meteors, scene.player.ship);
		scene.physics.add.collider(extras.rocks, scene.player.ship);
		scene.physics.add.collider(
			extras.asteroids,
			scene.player.ship,
			function (ship, asteroid) {
				if (scene.player.powerups == 0) {
					scene.player.alive = false;
					ship.setActive(false);
				} else {
					scene.player.powerups--;
					asteroid.destroy();
				}
			}
		);
		scene.physics.add.collider(
			extras.powerups,
			scene.player.ship,
			function (ship, powerup) {
				scene.player.powerups++;
				powerup.destroy();
			}
		);
		return extras;
	}
}

export { Extras };
