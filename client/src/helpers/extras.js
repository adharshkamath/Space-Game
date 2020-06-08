import Phaser from "phaser";
import CST from "../cst";

const addAsteroids = (scene) => {
	let velocity_x = Phaser.Math.Between(-300, 300);
	let velocity_y = Phaser.Math.Between(-300, 300);
	let asteroids = scene.physics.add.group({
		key: CST.ASSETS.EXTRAS.BIG_ASTEROID,
		quantity: 2,
		bounceX: 0.6,
		bounceY: 0.6,
		collideWorldBounds: true,
		velocityX: velocity_x,
		velocityY: velocity_y,
	});
	Phaser.Actions.RandomRectangle(
		asteroids.getChildren(),
		scene.physics.world.bounds
	);
	asteroids.velocity_x = velocity_x;
	asteroids.velocity_y = velocity_y;
	scene.physics.add.collider(asteroids);
	scene.anims.create({
		key: CST.ASSETS.EXTRAS.BIG_ASTEROID_EXPLOSION,
		duration: 1000,
		repeat: 0,
		frames: scene.anims.generateFrameNames(
			CST.ASSETS.EXTRAS.BIG_ASTEROID_EXPLOSION
		),
	});
	return asteroids;
};

const addExtras = (scene) => {
	let extras = {};
	extras.asteroids = addAsteroids(scene);
	scene.physics.add.collider(
		extras.asteroids,
		scene.player.bullets,
		function (asteroid, bullet) {
			bullet.destroy();
		}
	);
	scene.physics.add.collider(extras.asteroids, scene.player.ship, function (
		ship,
		asteroid
	) {
		if (scene.player.powerups == 0) {
			scene.add
				.sprite(ship.x, ship.y, "dummySprite")
				.setScale(3, 3)
				.play(CST.ASSETS.SHIPS.EXPLOSION);
			scene.sound.play(CST.ASSETS.SHIPS.EXPLOSION_AUDIO);
			scene.player.alive = false;
			ship.setActive(false);
		} else {
			scene.player.powerups--;
			scene.add
				.sprite(asteroid.x, asteroid.y, "dummySprite")
				.setScale(1.5, 1.5)
				.play(CST.ASSETS.EXTRAS.BIG_ASTEROID_EXPLOSION);
			scene.sound.play(CST.ASSETS.SHIPS.EXPLOSION_AUDIO);
			asteroid.destroy();
		}
	});
	return extras;
};

const getLocations = (group, array) => {
	for (let i = 0; i < group.length; i++) {
		array.push([group[i].x, group[i].y]);
	}
};

const setLocations = (group, locs) => {
	for (let i = 0; i < group.length; i++) {
		console.log(group[i], locs[i]);
		group[i].x = locs[i][0];
		group[i].y = locs[i][1];
	}
};

const getExtrasConfig = (extras) => {
	let config = {};
	config.asteroids = {};
	config.asteroids.locs = [];
	getLocations(extras.asteroids.getChildren(), config.asteroids.locs);
	config.asteroids.velocity_x = extras.asteroids.velocity_x;
	config.asteroids.velocity_y = extras.asteroids.velocity_y;
	return config;
};

const addExtrasFromConfig = (scene, config) => {
	let extras = {};
	extras.asteroids = scene.physics.add.group({
		key: CST.ASSETS.EXTRAS.BIG_ASTEROID,
		quantity: 2,
		bounceX: 0.6,
		bounceY: 0.6,
		collideWorldBounds: true,
		velocityX: config.asteroids.velocity_x,
		velocityY: config.asteroids.velocity_y,
	});
	scene.physics.add.collider(extras.asteroids);
	scene.anims.create({
		key: CST.ASSETS.EXTRAS.BIG_ASTEROID_EXPLOSION,
		duration: 1000,
		repeat: 0,
		frames: scene.anims.generateFrameNames(
			CST.ASSETS.EXTRAS.BIG_ASTEROID_EXPLOSION
		),
	});

	scene.physics.add.collider(
		extras.asteroids,
		scene.player.bullets,
		function (asteroid, bullet) {
			bullet.destroy();
		}
	);
	scene.physics.add.collider(extras.asteroids, scene.player.ship, function (
		ship,
		asteroid
	) {
		if (scene.player.powerups == 0) {
			scene.add
				.sprite(ship.x, ship.y, "dummySprite")
				.setScale(3, 3)
				.play(CST.ASSETS.SHIPS.EXPLOSION);
			scene.sound.play(CST.ASSETS.SHIPS.EXPLOSION_AUDIO);
			scene.player.alive = false;
			ship.setActive(false);
		} else {
			scene.player.powerups--;
			scene.add
				.sprite(asteroid.x, asteroid.y, "dummySprite")
				.setScale(1.5, 1.5)
				.play(CST.ASSETS.EXTRAS.BIG_ASTEROID_EXPLOSION);
			scene.sound.play(CST.ASSETS.SHIPS.EXPLOSION_AUDIO);
			asteroid.destroy();
		}
	});

	setLocations(extras.asteroids.getChildren(), config.asteroids.locs);
	return extras;
};

const addCollisions = (enemy, scene) => {
	scene.physics.add.collider(scene.extras.asteroids, enemy.bullets, function (
		asteroid,
		bullet
	) {
		bullet.destroy();
	});
	scene.physics.add.collider(scene.extras.asteroids, enemy, function (
		ship,
		asteroid
	) {
		if (enemy.powerups == 0) {
			scene.add
				.sprite(ship.x, ship.y, "dummySprite")
				.setScale(3, 3)
				.play(CST.ASSETS.SHIPS.EXPLOSION);
			scene.sound.play(CST.ASSETS.SHIPS.EXPLOSION_AUDIO);
			enemy.alive = false;
			enemy.ship.setActive(false);
		} else {
			enemy.powerups--;
			scene.add
				.sprite(asteroid.x, asteroid.y, "dummySprite")
				.setScale(1.5, 1.5)
				.play(CST.ASSETS.EXTRAS.BIG_ASTEROID_EXPLOSION);
			scene.sound.play(CST.ASSETS.SHIPS.EXPLOSION_AUDIO);
			asteroid.destroy();
		}
	});

	scene.physics.add.collider(enemy.bullets, scene.player.ship, function (
		bullet,
		ship
	) {
		if (scene.player.powerups == 0) {
			scene.add
				.sprite(ship.x, ship.y, "dummySprite")
				.setScale(3, 3)
				.play(CST.ASSETS.SHIPS.EXPLOSION);
			scene.sound.play(CST.ASSETS.SHIPS.EXPLOSION_AUDIO);
			scene.player.alive = false;
			ship.setActive(false);
			bullet.destroy();
		} else {
			scene.player.powerups--;
		}
	});
	scene.physics.add.collider(scene.player.bullets, enemy.ship, function (
		bullet,
		ship
	) {
		if (enemy.powerups == 0) {
			scene.add
				.sprite(ship.x, ship.y, "dummySprite")
				.setScale(3, 3)
				.play(CST.ASSETS.SHIPS.EXPLOSION);
			scene.sound.play(CST.ASSETS.SHIPS.EXPLOSION_AUDIO);
			enemy.alive = false;
			enemy.ship.setActive(false);
			bullet.destroy();
		} else {
			enemy.powerups--;
		}
	});
};
export { addExtras, getExtrasConfig, addExtrasFromConfig, addCollisions };
