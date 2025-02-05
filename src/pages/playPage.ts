import { Application, Graphics, Rectangle, Renderer, Ticker } from "pixi.js";
import Page from "./page";
import { createPlayerGraphics } from "../playerGraphics";
import { createAsteroidContent } from "../graphicsContentsFactory";
import Asteroid from "../entities/asteroid";
import Player from "../entities/player";

export default class PlayPage implements Page {

    private player: Player = null!;
    private asteroids: Array<Asteroid> = [];
    private screen: Rectangle = null!;

    initialize(app: Application<Renderer>): void {
        this.screen = app.screen;
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
            return new Asteroid(graphics, { x: 1, y: 1 }, Math.random() * 1.0);
        });
        this.asteroids.forEach(x => app.stage.addChild(x.getGraphics()));

    }

    cleanUp(): void {
        this.player.getGraphics().destroy();
        this.asteroids.forEach(x => x.getGraphics().destroy());
    }

    animate(time: Ticker): void {
        this.asteroids.forEach(asteriod => {
            asteriod.advance(time.deltaTime, this.screen);
        });
        this.player.advance(time.deltaTime, this.screen);
    }

    handleKeyDown(evt: KeyboardEvent): void {
        if (evt.key === 'w') {
            this.player.accelerate();
            console.log(evt.key);
        } else if (evt.key === 'd') {
            this.player.startRotate(true);
        } else if (evt.key === 'a') {
            this.player.startRotate(false);
        }

    }

    handleKeyUp(evt: KeyboardEvent): void {
        if (evt.key === 'w') {
            this.player.slowDown();
        }
        else if (evt.key == 'd' || evt.key == 'a') {
            this.player.endRotate();
        }
    }

}