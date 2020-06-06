import CST from "../cst";
class Bullet extends Phaser.Physics.Arcade.Image {
  constructor(scene, sprite) {
    super(scene, 0, 0, sprite);
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

  defenseFire(turret) {
    this.lifeSpan = 1000;
    this.setVisible(true);
    this.setActive(true);
    this.setAngle(ship.body.rotation);
    this.setPosition(turret.body.x, turret.body.y);
    this.body.reset(turret.body.x, turret.body.y);
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
class PlayerBullet extends Bullet {
  constructor(scene) {
    super(scene, CST.ASSETS.SHIPS.PLAYER_BULLET);
  }

  fire(ship) {
    super.fire(ship);
  }

  update(time, delta) {
    super.update(time, delta);
  }
}
class EnemyBullet extends Bullet {
  constructor(scene) {
    super(scene, CST.ASSETS.SHIPS.ENEMY_BULLET);
  }

  fire(ship) {
    super.fire(ship);
  }

  update(time, delta) {
    super.update(time, delta);
  }
}

class TurretBullet extends Bullet {
  constructor(scene) {
    super(scene, CST.ASSETS.SHIPS.ENEMY_BULLET);
  }

  fire(turret) {
    super.defenseFire(turret);
  }

  update(time, delta) {
    super.update(time, delta);
  }
}

export { PlayerBullet, EnemyBullet, TurretBullet };
