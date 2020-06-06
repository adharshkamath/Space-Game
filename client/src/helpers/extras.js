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

const addMeteors = (scene) => {
  let velocity_x = Phaser.Math.Between(-500, 500);
  let velocity_y = Phaser.Math.Between(-500, 500);
  let meteors = scene.physics.add.group({
    key: CST.ASSETS.EXTRAS.MED_ASTROID,
    quantity: 3,
    bounceX: 0.8,
    bounceY: 0.8,
    collideWorldBounds: true,
    velocityX: velocity_x,
    velocityY: velocity_y,
  });
  Phaser.Actions.RandomRectangle(
    meteors.getChildren(),
    scene.physics.world.bounds
  );
  meteors.velocity_x = velocity_x;
  meteors.velocity_y = velocity_y;
  scene.physics.add.collider(meteors);
  return meteors;
};

const addRocks = (scene) => {
  let velocity_x = Phaser.Math.Between(-700, 700);
  let velocity_y = Phaser.Math.Between(-700, 700);
  let rocks = scene.physics.add.group({
    key: CST.ASSETS.EXTRAS.SMALL_ASTEROID,
    quantity: 4,
    bounceX: 1,
    bounceY: 1,
    collideWorldBounds: true,
    velocityX: velocity_x,
    velocityY: velocity_y,
  });
  Phaser.Actions.RandomRectangle(
    rocks.getChildren(),
    scene.physics.world.bounds
  );
  rocks.velocity_x = velocity_x;
  rocks.velocity_y = velocity_y;
  scene.physics.add.collider(rocks);
  return rocks;
};

const addPowerups = (scene) => {
  let powerups = scene.physics.add.group({
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
};

// Add turrets
const addTurrets = (scene) => {
  let turrets = scene.physics.add.staticGroup({
    key: CST.ASSETS.EXTRAS.TURRET,
    quantity: 2,
    runChildUpdate: true,
  });
  Phaser.Actions.RandomRectangle(
    turrets.getChildren(),
    scene.physics.world.bounds
  );
  return turrets;
};

const addExtras = (scene) => {
  let extras = {};
  extras.asteroids = addAsteroids(scene);
  extras.powerups = addPowerups(scene);
  extras.meteors = addMeteors(scene);
  extras.rocks = addRocks(scene);
  // extras.turrets = addTurrets(scene);
  scene.physics.add.collider(extras.asteroids, extras.powerups);
  scene.physics.add.collider(extras.asteroids, extras.meteors);
  scene.physics.add.collider(extras.asteroids, extras.rocks);
  scene.physics.add.collider(extras.powerups, extras.meteors);
  scene.physics.add.collider(extras.powerups, extras.rocks);
  scene.physics.add.collider(extras.meteors, extras.rocks);
  scene.physics.add.collider(extras.meteors, scene.player.ship);
  scene.physics.add.collider(extras.rocks, scene.player.ship);
  scene.physics.add.collider(extras.rocks, scene.player.bullets, function (
    bullet,
    rock
  ) {
    rock.destroy();
    bullet.destroy();
  });
  scene.physics.add.collider(extras.meteors, scene.player.bullets, function (
    bullet,
    meteor
  ) {
    meteor.destroy();
    bullet.destroy();
  });
  scene.physics.add.collider(extras.powerups, scene.player.bullets, function (
    bullet,
    powerup
  ) {
    powerup.destroy();
    bullet.destroy();
  });
  scene.physics.add.collider(extras.asteroids, scene.player.bullets, function (
    asteroid,
    bullet
  ) {
    bullet.destroy();
  });
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
  scene.physics.add.collider(extras.powerups, scene.player.ship, function (
    ship,
    powerup
  ) {
    scene.sound.play(CST.ASSETS.EXTRAS.BOOST_AUDIO);
    scene.player.powerups++;
    powerup.destroy();
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
  config.meteors = {};
  config.meteors.locs = [];
  getLocations(extras.meteors.getChildren(), config.meteors.locs);
  config.meteors.velocity_x = extras.meteors.velocity_x;
  config.meteors.velocity_y = extras.meteors.velocity_y;
  config.rocks = {};
  config.rocks.locs = [];
  getLocations(extras.rocks.getChildren(), config.rocks.locs);
  config.rocks.velocity_x = extras.rocks.velocity_x;
  config.rocks.velocity_y = extras.rocks.velocity_y;
  config.powerups = {};
  config.powerups.locs = [];
  getLocations(extras.powerups.getChildren(), config.powerups.locs);
  return config;
};

const addExtrasFromConfig = (scene, config) => {
  let extras = {};
  extras.powerups = addPowerups(scene);
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
  extras.meteors = scene.physics.add.group({
    key: CST.ASSETS.EXTRAS.MED_ASTROID,
    quantity: 3,
    bounceX: 0.8,
    bounceY: 0.8,
    collideWorldBounds: true,
    velocityX: config.meteors.velocity_x,
    velocityY: config.meteors.velocity_y,
  });
  scene.physics.add.collider(extras.meteors);
  extras.rocks = scene.physics.add.group({
    key: CST.ASSETS.EXTRAS.MED_ASTROID,
    quantity: 3,
    bounceX: 0.8,
    bounceY: 0.8,
    collideWorldBounds: true,
    velocityX: config.rocks.velocity_x,
    velocityY: config.rocks.velocity_y,
  });
  scene.physics.add.collider(extras.rocks);
  scene.physics.add.collider(extras.asteroids, extras.powerups);
  scene.physics.add.collider(extras.asteroids, extras.meteors);
  scene.physics.add.collider(extras.asteroids, extras.rocks);
  scene.physics.add.collider(extras.powerups, extras.meteors);
  scene.physics.add.collider(extras.powerups, extras.rocks);
  scene.physics.add.collider(extras.meteors, extras.rocks);
  scene.physics.add.collider(extras.meteors, scene.player.ship);
  scene.physics.add.collider(extras.rocks, scene.player.ship);
  scene.physics.add.collider(extras.rocks, scene.player.bullets, function (
    bullet,
    rock
  ) {
    rock.destroy();
    bullet.destroy();
  });
  scene.physics.add.collider(extras.meteors, scene.player.bullets, function (
    bullet,
    meteor
  ) {
    meteor.destroy();
    bullet.destroy();
  });
  scene.physics.add.collider(extras.powerups, scene.player.bullets, function (
    bullet,
    powerup
  ) {
    powerup.destroy();
    bullet.destroy();
  });
  scene.physics.add.collider(extras.asteroids, scene.player.bullets, function (
    asteroid,
    bullet
  ) {
    bullet.destroy();
  });
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
  scene.physics.add.collider(extras.powerups, scene.player.ship, function (
    ship,
    powerup
  ) {
    scene.sound.play(CST.ASSETS.EXTRAS.BOOST_AUDIO);
    scene.player.powerups++;
    powerup.destroy();
  });
  setLocations(extras.asteroids.getChildren(), config.asteroids.locs);
  setLocations(extras.meteors.getChildren(), config.meteors.locs);
  setLocations(extras.rocks.getChildren(), config.rocks.locs);
  setLocations(extras.powerups.getChildren(), config.powerups.locs);
  return extras;
};

const addCollisions = (enemy, scene) => {
  scene.physics.add.collider(scene.extras.meteors, enemy.ship);
  scene.physics.add.collider(scene.extras.rocks, enemy.ship);
  scene.physics.add.collider(scene.extras.rocks, enemy.bullets, function (
    bullet,
    rock
  ) {
    rock.destroy();
    bullet.destroy();
  });
  scene.physics.add.collider(scene.extras.meteors, enemy.bullets, function (
    bullet,
    meteor
  ) {
    meteor.destroy();
    bullet.destroy();
  });
  scene.physics.add.collider(scene.extras.powerups, enemy.bullets, function (
    bullet,
    powerup
  ) {
    powerup.destroy();
    bullet.destroy();
  });
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
  scene.physics.add.collider(scene.extras.powerups, enemy, function (
    ship,
    powerup
  ) {
    scene.sound.play(CST.ASSETS.EXTRAS.BOOST_AUDIO);
    enemy.powerups++;
    powerup.destroy();
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
export {
  addExtras,
  getExtrasConfig,
  addExtrasFromConfig,
  addCollisions,
  addTurrets,
};
