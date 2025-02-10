import { Application, PointData, Renderer, Ticker } from "pixi.js";
import { Page, PageId } from "./page";
import { Asteroid, AsteroidSize } from "../entities/asteroid";
import Player from "../entities/player";
import BulletSpawner from "../entities/bulletSpawner";
import Bullet from "../entities/bullet";
import Entity from "../entities/entity";
import { CollisionDetector } from "../collisionDetector";
import { rotateVector } from "../helpers/vectorHelpers";
import ScoreLabel from "../entities/scoreLabel";
import LivesLabel from "../entities/livesLabel";
import { config } from "../config";
import { SoundId, soundLoader } from "../soundLoader";
import { AsteroidImageHierarchy } from "../asteroidImageHierarchy";
import defaultAsteroidHierarchy from '../data/defaultAsteroidHierarchy.json';
import AsteroidFactory from "../factories/asteroidFactory";
import { TextureId } from "../textureLoader";

export default class PlayPage implements Page {

    private player: Player = null!;
    private asteroids: Array<Asteroid> = [];
    private app: Application<Renderer> = null!;
    private bulletSpawner: BulletSpawner = null!;
    private bullets: Array<Bullet> = [];
    private collisionDetector = new CollisionDetector();
    private scoreLabel = new ScoreLabel();
    private livesLabel: LivesLabel = null!;
    private hierarchy: AsteroidImageHierarchy = null!;

    initialize(app: Application<Renderer>): void {
        this.app = app;
        this.fillImageHierarchy();
        this.player = new Player(
            Entity.generateNextId(),
            { x: app.screen.width / 2, y: app.screen.height / 2 },
            { x: 0, y: -1 },
            config.player.rotationSpeed,
            config.player.bodyWidth,
            config.player.bodyHeight,
            config.player.bodyColor,
            config.player.fireColor,
            config.player.cooldownColor,
            config.player.cooldownTimeMs,
            config.player.acceleration,
            config.player.maxSpeed);
        this.player.addToStage(app.stage);

        this.asteroids = [...Array(config.asteroids.initialCount).keys()]
            .map(_ => {
                const asteroidSize = Math.random() > 0.5 ? AsteroidSize.BIG : AsteroidSize.MEDIUM
                const textureId = this.hierarchy.getRandomTextureOnLevel(asteroidSize);
                return this.createAsteroid(
                    asteroidSize,
                    textureId!,
                    { x: Math.random(), y: Math.random() },
                    { x: Math.random() * app.screen.width, y: Math.random() * app.screen.height }
                )
            });

        this.bulletSpawner = new BulletSpawner(this.player, config.bullet.spawnInterval);
        this.bullets = [];
        this.scoreLabel = new ScoreLabel();
        this.scoreLabel.getGraphics().position.set(5, 10);
        app.stage.addChild(this.scoreLabel.getGraphics());
        this.livesLabel = new LivesLabel(config.initialLives);
        this.livesLabel.getGraphics().position.set(120, 10);
        app.stage.addChild(this.livesLabel.getGraphics());
    }

    private fillImageHierarchy() {
        this.hierarchy = AsteroidImageHierarchy.fromJson(defaultAsteroidHierarchy);
        console.log(this.hierarchy);
    }

    cleanUp(): void {
        this.player.destroy();
        while (this.bullets.length > 0) this.removeBullet(this.bullets[0]);
        while (this.asteroids.length > 0) this.removeAsteroid(this.asteroids[0]);
        this.livesLabel.getGraphics().destroy();
        this.scoreLabel.getGraphics().destroy();
    }

    advance(time: Ticker): void {
        this.asteroids.forEach(asteriod => {
            asteriod.advance(time, this.app.screen);
        });
        this.player.advance(time, this.app.screen);
        this.bulletSpawner.advance(time);
        this.bullets.forEach(bullet => {
            bullet.advance(time, this.app.screen);
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
        soundLoader.playSound(SoundId.BLASTER);
        const bullet = new Bullet(
            Entity.generateNextId(),
            config.bullet.bodyWidth,
            config.bullet.bodyHeight,
            this.player.getTopPoint(),
            this.player.getDirection(),
            config.bullet.speed);

        bullet.addToStage(this.app.stage);
        this.bullets.push(bullet);
        this.asteroids.forEach(asteroid => {
            this.collisionDetector.track(
                bullet,
                asteroid
            );
        });
    }

    createAsteroid(size: AsteroidSize, textureId: TextureId, direction: PointData, position: PointData) {
        const asteroid = AsteroidFactory.createAsteroid(
            size,
            textureId,
            position,
            direction,
        );

        asteroid.setPosition({
            x: position.x,
            y: position.y
        });

        this.asteroids.push(asteroid);
        asteroid.addToStage(this.app.stage);

        this.collisionDetector.track(this.player, asteroid);

        return asteroid;
    }

    removeBullet(bulletToRemove: Bullet) {
        const bulletIndex = this.bullets.indexOf(bulletToRemove);
        if (bulletIndex < 0) { throw new Error(`can't find a bullet to remove, index: ${bulletIndex}, entityId: ${bulletToRemove.getEntityId()}`) }
        this.bullets.splice(bulletIndex, 1);
        this.collisionDetector.untrackLeft(bulletToRemove);
        bulletToRemove.destroy();
    }

    removeBulletById(entityId: number) {
        const bulletToRemove = this.bullets.find(x => x.getEntityId() === entityId);
        if (!bulletToRemove) { throw new Error(`can't find a bullet to remove, entityId: ${entityId}`) }
        this.removeBullet(bulletToRemove);
    }

    removeAsteroid(asteroid: Asteroid) {
        this.collisionDetector.untrackRight(asteroid);
        const asteroidToRemoveIndex = this.asteroids.indexOf(asteroid);
        this.asteroids.splice(asteroidToRemoveIndex, 1);
        asteroid.destroy();
    }

    breakDownAsteroid(asteroid: Asteroid) {
        const asteroidPosition = {
            x: asteroid.getPosition().x,
            y: asteroid.getPosition().y
        };

        this.removeAsteroid(asteroid);

        if (asteroid.getAsteroidSize() != AsteroidSize.SMALL) {
            this.asteroids.push(this.createAsteroid(
                asteroid.getAsteroidSize() - 1,
                this.hierarchy.getRandomNextLevelTexture(asteroid.getTexture())!,
                rotateVector(this.player.getDirection(), Math.PI / 4),
                asteroidPosition));

            this.asteroids.push(this.createAsteroid(
                asteroid.getAsteroidSize() - 1,
                this.hierarchy.getRandomNextLevelTexture(asteroid.getTexture())!,
                rotateVector(this.player.getDirection(), -Math.PI / 4),
                asteroidPosition));
        }
    }

    handleCollision(leftEntityId: number, rightEntityId: number) {
        if (leftEntityId == this.player.getEntityId()) {
            this.handlePlayerToAsteroidCollision(rightEntityId);
        } else {
            const bulletHit = this.bullets.find(x => x.getEntityId() == leftEntityId);
            if (bulletHit != null) {
                this.handleBulletToAsteroidCollision(bulletHit, rightEntityId);
            }
        }
    }

    handlePlayerToAsteroidCollision(asteroidEntityId: number) {
        if (this.player.isInCooldown()) {
            return;
        }

        const asteroid = this.asteroids.find(x => x.getEntityId() == asteroidEntityId);
        if (asteroid == null) {
            throw Error('Asteroid should be hit, but it does not exist')
        }

        this.livesLabel.updateLives(-1);
        this.breakDownAsteroid(asteroid);
        this.player.startCooldown();
    }

    handleBulletToAsteroidCollision(bullet: Bullet, asteroidEntityId: number) {
        soundLoader.playSound(SoundId.SLAP);
        const asteroid = this.asteroids.find(x => x.getEntityId() == asteroidEntityId);
        if (asteroid == null) {
            throw Error('Asteroid should be hit, but it does not exist')
        }
        this.scoreLabel.updateScore(this.asteroidToPoints(asteroid.getAsteroidSize()));
        this.breakDownAsteroid(asteroid);
        this.removeBullet(bullet);
    }

    asteroidToPoints(asteriodSize: AsteroidSize) {
        switch (asteriodSize) {
            case AsteroidSize.BIG: return config.asteroids.points.big;
            case AsteroidSize.MEDIUM: return config.asteroids.points.medium;
            case AsteroidSize.SMALL: return config.asteroids.points.small;
        }
    }
}