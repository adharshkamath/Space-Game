import Phaser from "phaser";
import CST from "../cst";

class Asteroids {
	constructor(scene) {
		var asteroids = scene.physics.add.group({
			key: CST.ASSETS.EXTRAS.BIG_ASTEROID,
			quantity: 2,
			bounceX: 0.6,
			bounceY: 0.6,
			collideWorldBounds: true,
			velocityX: Phaser.Math.Between(-300, 300),
			velocityY: Phaser.Math.Between(-300, 300),
		});
		Phaser.Actions.RandomRectangle(
			asteroids.getChildren(),
			scene.physics.world.bounds
		);
		scene.physics.add.collider(asteroids);
		scene.anims.create({
			key: CST.ASSETS.EXTRAS.BIG_ASTEROID_EXPLOSION,
			duration: 1000,
			repeat: 0,
			frames: scene.anims.generateFrameNames(CST.ASSETS.EXTRAS.BIG_ASTEROID_EXPLOSION)
		});
		return asteroids;
	}
}

class Meteors {
	constructor(scene) {
		var asteroids = scene.physics.add.group({
			key: CST.ASSETS.EXTRAS.MED_ASTROID,
			quantity: 3,
			bounceX: 0.8,
			bounceY: 0.8,
			collideWorldBounds: true,
			velocityX: Phaser.Math.Between(-500, 500),
			velocityY: Phaser.Math.Between(-500, 500),
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
		scene.physics.add.collider(extras.rocks, scene.player.bullets, function(bullet, rock) {
			rock.destroy();
			bullet.destroy();
		});
		scene.physics.add.collider(extras.meteors, scene.player.bullets, function(bullet, meteor) {
			meteor.destroy();
			bullet.destroy();
		});
		scene.physics.add.collider(extras.powerups, scene.player.bullets, function(bullet, powerup) {
			powerup.destroy();
			bullet.destroy();
		});
		scene.physics.add.collider(extras.asteroids, scene.player.bullets, function(asteroid, bullet) {
			bullet.destroy();
		});
		scene.physics.add.collider(
			extras.asteroids,
			scene.player.ship,
			function (ship, asteroid) {
				if (scene.player.powerups == 0) {
					scene.add.sprite(ship.x, ship.y, "dummySprite").setScale(3, 3).play(CST.ASSETS.SHIPS.EXPLOSION);
					scene.sound.play(CST.ASSETS.SHIPS.EXPLOSION_AUDIO);
					scene.player.alive = false;
					ship.setActive(false);
				} else {
					scene.player.powerups--;
					scene.add.sprite(asteroid.x, asteroid.y, "dummySprite").setScale(1.5, 1.5).play(CST.ASSETS.EXTRAS.BIG_ASTEROID_EXPLOSION);
					scene.sound.play(CST.ASSETS.SHIPS.EXPLOSION_AUDIO);
					asteroid.destroy();
				}
			}
		);
		scene.physics.add.collider(
			extras.powerups,
			scene.player.ship,
			function (ship, powerup) {
				scene.sound.play(CST.ASSETS.EXTRAS.BOOST_AUDIO);
				scene.player.powerups++;
				powerup.destroy();
			}
		);
		return extras;
	}
}

export { Extras };
