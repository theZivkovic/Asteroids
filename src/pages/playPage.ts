import { Application, Graphics, Renderer, Ticker } from "pixi.js";
import Page from "./page";
import { createPlayerGraphics } from "../playerGraphics";

export default class PlayPage implements Page {

    private player: Graphics = null!;

    initialize(app: Application<Renderer>): void {
        this.player = createPlayerGraphics({ x: app.screen.width / 2, y: app.screen.height / 2 });
        app.stage.addChild(this.player);
    }

    cleanUp(): void {
    }

    animate(time: Ticker): void {

    }

    handleKeyboardEvent(evt: KeyboardEvent): void {
    }

}