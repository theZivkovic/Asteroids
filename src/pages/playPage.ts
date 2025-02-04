import { Application, Graphics, Rectangle, Renderer, Ticker } from "pixi.js";
import Page from "./page";
import { createPlayerGraphics } from "../playerGraphics";
import { createAsteroidContent } from "../graphicsContentsFactory";
import Asteroid from "../entites/asteroid";

export default class PlayPage implements Page {

    private player: Graphics = null!;
    private asteroids: Array<Asteroid> = [];
    private screen: Rectangle = null!;

    initialize(app: Application<Renderer>): void {
        this.screen = app.screen;
        this.player = createPlayerGraphics({ x: app.screen.width / 2, y: app.screen.height / 2 });
        app.stage.addChild(this.player);
        this.asteroids = [...Array(5).keys()].map(_ => {
            const content = createAsteroidContent(15);
            const graphics = new Graphics(content);
            graphics.position.set(Math.random() * app.screen.width, Math.random() * app.screen.height);
            return new Asteroid(graphics, { x: 1, y: 1 }, Math.random() * 1.0);
        });
        this.asteroids.forEach(x => app.stage.addChild(x.getGraphics()));

    }

    cleanUp(): void {
        this.player.destroy();
        this.asteroids.forEach(x => x.getGraphics().destroy());
    }

    animate(time: Ticker): void {
        this.asteroids.forEach(asteriod => {
            asteriod.advance(time.deltaTime, this.screen);
        });
    }

    handleKeyboardEvent(evt: KeyboardEvent): void {

    }

}