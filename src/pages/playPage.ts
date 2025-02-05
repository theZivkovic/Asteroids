import { Application, Graphics, Renderer, Ticker } from "pixi.js";
import { Page, PageId } from "./page";
import { createPlayerGraphics } from "../playerGraphics";
import { createAsteroidContent, createBulletContent } from "../graphicsContentsFactory";
import Asteroid from "../entities/asteroid";
import Player from "../entities/player";
import BulletSpawner from "../entities/bulletSpawner";
import Bullet from "../entities/bullet";
import Entity from "../entities/entity";
import CollisionDetector from "../collisionDetector";

export default class PlayPage implements Page {

    private player: Player = null!;
    private asteroids: Array<Asteroid> = [];
    private app: Application<Renderer> = null!;
    private bulletSpawner: BulletSpawner = null!;
    private bullets: Array<Bullet> = [];
    private collisionDetector = new CollisionDetector();
    private score = 0;

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
        this.asteroids = [...Array(10).keys()].map(_ => {
            const content = createAsteroidContent(15);
            const graphics = new Graphics(content);
            graphics.position.set(Math.random() * app.screen.width, Math.random() * app.screen.height);
            return new Asteroid(Entity.generateNextId(), graphics, { x: 1, y: 1 }, 1.0);
        });
        this.asteroids.forEach(asteroid => {
            app.stage.addChild(asteroid.getGraphics());
            this.collisionDetector.track(this.player.getGraphicalEntity(),
                asteroid.getGraphicalEntity());
        });
        this.bulletSpawner = new BulletSpawner(this.player, 10);
        this.bullets = [];

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

    handleMouseDown(_: MouseEvent): void {
    }

    handleMouseUp(_: MouseEvent): void {
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
        console.log('Asteroid hit: ', asteroidEntityId);
    }

    handleBulletToAsteroidCollision(bullet: Bullet, asteroidEntityId: number) {
        const asteroid = this.asteroids.find(x => x.getEntityId() == asteroidEntityId);
        if (asteroid == null) { throw Error('Asteroid should be hit, but it does not exist') }
        this.score += 10;
        console.log('Score:', this.score);

        // remove asteroid
        this.collisionDetector.untrackRight(asteroid.getGraphicalEntity());
        const asteroidToRemoveIndex = this.asteroids.indexOf(asteroid);
        this.asteroids.splice(asteroidToRemoveIndex, 1);
        asteroid.getGraphics().destroy();

        // // remove bullet
        this.removeBullet(bullet);
    }
}