import { Application, Graphics, Rectangle, Renderer, Ticker } from "pixi.js";
import { Page, PageId } from "./page";
import { createPlayerGraphics } from "../playerGraphics";
import { createAsteroidContent, createBulletContent } from "../graphicsContentsFactory";
import Asteroid from "../entities/asteroid";
import Player from "../entities/player";
import BulletSpawner from "../entities/bulletSpawner";
import Bullet from "../entities/bullet";
import Entity from "../entities/entity";

export default class PlayPage implements Page {

    private player: Player = null!;
    private asteroids: Array<Asteroid> = [];
    private app: Application<Renderer> = null!;
    private bulletSpawner: BulletSpawner = null!;
    private bullets: Array<Bullet> = [];

    initialize(app: Application<Renderer>): void {
        this.app = app;
        const playerGraphics = createPlayerGraphics({ x: app.screen.width / 2, y: app.screen.height / 2 });
        this.player = new Player(
            playerGraphics,
            { x: 0, y: -1 },
            0,
            0.1);
        app.stage.addChild(this.player.getGraphics());
        this.asteroids = [...Array(5).keys()].map(_ => {
            const content = createAsteroidContent(15);
            const graphics = new Graphics(content);
            graphics.position.set(Math.random() * app.screen.width, Math.random() * app.screen.height);
            return new Asteroid(Entity.generateNextId(), graphics, { x: 1, y: 1 }, Math.random() * 1.0);
        });
        this.asteroids.forEach(x => app.stage.addChild(x.getGraphics()));
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
        })
    }

    handleKeyDown(evt: KeyboardEvent): void {
        if (evt.key === 'w') {
            this.player.accelerate();
        } else if (evt.key === 'd') {
            this.player.startRotate(true);
        } else if (evt.key === 'a') {
            this.player.startRotate(false);
        } else if (evt.code == 'Space') {
            this.bulletSpawner.startShooting();
        }

    }

    handleKeyUp(evt: KeyboardEvent): void {
        if (evt.key === 'w') {
            this.player.slowDown();
        }
        else if (evt.key == 'd' || evt.key == 'a') {
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
    }

    removeBullet(entityId: number) {
        const bulletToRemove = this.bullets.find(x => x.getEntityId() === entityId);
        if (!bulletToRemove) { throw new Error(`can't find a bullet to remove, entityId: ${entityId}`) }
        const bulletIndex = this.bullets.indexOf(bulletToRemove);
        if (bulletIndex < 0) { throw new Error(`can't find a bullet to remove, index: ${bulletIndex}, entityId: ${entityId}`) }
        this.bullets.splice(bulletIndex, 1);
        bulletToRemove.getGraphics().destroy();
    }
}