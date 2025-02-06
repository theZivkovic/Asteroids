import { Application, Graphics, PointData, Renderer, Ticker } from "pixi.js";
import { Page, PageId } from "./page";
import { createPlayerGraphics } from "../playerGraphics";
import { createBulletContent } from "../graphicsContentsFactory";
import { Asteroid, AsteroidSize } from "../entities/asteroid";
import Player from "../entities/player";
import BulletSpawner from "../entities/bulletSpawner";
import Bullet from "../entities/bullet";
import Entity from "../entities/entity";
import CollisionDetector from "../collisionDetector";
import { rotateVector } from "../helpers/vectorHelpers";
import ScoreLabel from "../entities/scoreLabel";
import LivesLabel from "../entities/livesLabel";

export default class PlayPage implements Page {

    private player: Player = null!;
    private asteroids: Array<Asteroid> = [];
    private app: Application<Renderer> = null!;
    private bulletSpawner: BulletSpawner = null!;
    private bullets: Array<Bullet> = [];
    private collisionDetector = new CollisionDetector();
    private scoreLabel = new ScoreLabel();
    private livesLabel = new LivesLabel();

    initialize(app: Application<Renderer>): void {
        this.app = app;
        const playerGraphics = createPlayerGraphics({ x: app.screen.width / 2, y: app.screen.height / 2 });
        this.player = new Player(
            Entity.generateNextId(),
            playerGraphics,
            { x: 0, y: -1 },
            0,
            0.1);
        app.stage.addChild(this.player.getGraphics());
        this.asteroids = [...Array(10).keys()].map(_ => this.createAsteroid(
            Math.random() > 0.5 ? AsteroidSize.BIG : AsteroidSize.MEDIUM,
            { x: Math.random(), y: Math.random() },
            { x: Math.random() * app.screen.width, y: Math.random() * app.screen.height },
            0.7 + Math.random() * 0.5
        ));
        this.bulletSpawner = new BulletSpawner(this.player, 10);
        this.bullets = [];
        this.scoreLabel = new ScoreLabel();
        this.scoreLabel.initialize(app);
        this.livesLabel = new LivesLabel();
        this.livesLabel.initialize(app);

    }

    cleanUp(): void {
        this.player.getGraphics().destroy();
        this.asteroids.forEach(x => x.getGraphics().destroy());
    }

    animate(time: Ticker): void {
        this.asteroids.forEach(asteriod => {
            asteriod.advance(time.deltaTime, this.app.screen);
        });
        this.player.advance(time.deltaTime, this.app.screen);
        this.bulletSpawner.animate(time);
        this.bullets.forEach(bullet => {
            bullet.advance(time.deltaTime, this.app.screen);
        });
        this.collisionDetector.checkCollisions();
    }

    handleKeyDown(evt: KeyboardEvent): void {
        if (evt.key === 'w' || evt.code == 'ArrowUp') {
            this.player.accelerate();
        } else if (evt.key === 'd' || evt.code == 'ArrowRight') {
            this.player.startRotate(true);
        } else if (evt.key === 'a' || evt.code == 'ArrowLeft') {
            this.player.startRotate(false);
        } else if (evt.code == 'Space') {
            this.bulletSpawner.startShooting();
        }
    }

    handleKeyUp(evt: KeyboardEvent): void {
        if (evt.key === 'w' || evt.code == 'ArrowUp') {
            this.player.slowDown();
        }
        else if (evt.key == 'd' || evt.key == 'a' || evt.code == 'ArrowLeft' || evt.code == 'ArrowRight') {
            this.player.endRotate();
        } else if (evt.code == 'Space') {
            this.bulletSpawner.endShooting();
        }
    }

    getPageId(): PageId {
        return PageId.PlayPage;
    }

    addABullet() {
        const bulletGraphics = new Graphics(createBulletContent(2));
        bulletGraphics.position = this.player.getGraphics().position;
        const bullet = new Bullet(Entity.generateNextId(), bulletGraphics, this.player.getDirection(), 5);
        this.app.stage.addChild(bullet.getGraphics());
        this.bullets.push(bullet);
        this.asteroids.forEach(asteroid => {
            this.collisionDetector.track(bullet.getGraphicalEntity(), asteroid.getGraphicalEntity());
        })
    }

    createAsteroid(size: AsteroidSize, direction: PointData, position: PointData, speed: number) {
        const asteroid = new Asteroid(
            Entity.generateNextId(),
            size,
            direction,
            speed
        );
        asteroid.getGraphics().position.set(
            position.x,
            position.y
        );

        this.app.stage.addChild(asteroid.getGraphics());
        this.collisionDetector.track(
            this.player.getGraphicalEntity(),
            asteroid.getGraphicalEntity());
        return asteroid;
    }

    removeBullet(bulletToRemove: Bullet) {
        const bulletIndex = this.bullets.indexOf(bulletToRemove);
        if (bulletIndex < 0) { throw new Error(`can't find a bullet to remove, index: ${bulletIndex}, entityId: ${bulletToRemove.getEntityId()}`) }
        this.bullets.splice(bulletIndex, 1);
        this.collisionDetector.untrackLeft(bulletToRemove.getGraphicalEntity());
        bulletToRemove.getGraphics().destroy();
    }

    removeBulletById(entityId: number) {
        const bulletToRemove = this.bullets.find(x => x.getEntityId() === entityId);
        if (!bulletToRemove) { throw new Error(`can't find a bullet to remove, entityId: ${entityId}`) }
        this.removeBullet(bulletToRemove);
    }

    removeAsteroid(asteroid: Asteroid) {
        const asteroidPosition = asteroid.getGraphics().position;
        this.collisionDetector.untrackRight(asteroid.getGraphicalEntity());
        const asteroidToRemoveIndex = this.asteroids.indexOf(asteroid);
        this.asteroids.splice(asteroidToRemoveIndex, 1);
        asteroid.getGraphics().destroy();

        if (asteroid.getAsteroidSize() != AsteroidSize.SMALL) {
            this.asteroids.push(this.createAsteroid(
                Asteroid.SmallerAsteroidSize(asteroid.getAsteroidSize()),
                rotateVector(this.player.getDirection(), Math.PI / 4),
                asteroidPosition,
                asteroid.getMovableEntity().getSpeed() * 2));

            this.asteroids.push(this.createAsteroid(
                Asteroid.SmallerAsteroidSize(asteroid.getAsteroidSize()),
                rotateVector(this.player.getDirection(), -Math.PI / 4),
                asteroidPosition,
                asteroid.getMovableEntity().getSpeed() * 2));
        }
    }

    handleCollision(leftEntityId: number, rightEntityId: number) {
        if (leftEntityId == this.player.getGraphicalEntity().getId()) {
            this.handlePlayerToAsteroidCollision(rightEntityId);
        } else {
            const bulletHit = this.bullets.find(x => x.getEntityId() == leftEntityId);
            if (bulletHit != null) {
                this.handleBulletToAsteroidCollision(bulletHit, rightEntityId);
            }
        }
    }

    handlePlayerToAsteroidCollision(asteroidEntityId: number) {
        const asteroid = this.asteroids.find(x => x.getEntityId() == asteroidEntityId);
        if (asteroid == null) { throw Error('Asteroid should be hit, but it does not exist') }
        this.livesLabel.updateLives(-1);
        this.removeAsteroid(asteroid);
    }

    handleBulletToAsteroidCollision(bullet: Bullet, asteroidEntityId: number) {
        const asteroid = this.asteroids.find(x => x.getEntityId() == asteroidEntityId);
        if (asteroid == null) { throw Error('Asteroid should be hit, but it does not exist') }
        this.scoreLabel.updateScore(this.asteroidToPoints(asteroid.getAsteroidSize()));
        this.removeAsteroid(asteroid);
        this.removeBullet(bullet);
    }

    asteroidToPoints(asteriodSize: AsteroidSize) {
        switch (asteriodSize) {
            case AsteroidSize.BIG: return 10;
            case AsteroidSize.MEDIUM: return 15;
            case AsteroidSize.SMALL: return 20;
        }
    }
}