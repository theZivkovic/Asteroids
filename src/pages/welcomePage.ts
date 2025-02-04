import { Application, BitmapText, Renderer, Ticker } from "pixi.js";
import Page from "./page";
import eventEmitter from "../eventEmitter";
import Events from "../events";

export default class WelcomePage implements Page {

    private pressSpaceLabel: BitmapText = null!;
    private pressSpaceLabelInitialFontSize = 50;
    private pressSpaceLabelTimeCounter = 0.0;

    initialize(app: Application<Renderer>): void {
        this.pressSpaceLabel = new BitmapText({
            text: 'Press [SPACE] to start a game!',
            style: {
                fontFamily: 'Arial',
                fontSize: this.pressSpaceLabelInitialFontSize,
                align: 'left',
            },
        });
        this.pressSpaceLabel.anchor.set(0.5)
        this.pressSpaceLabel.position.set(app.screen.width / 2, app.screen.height / 2);

        app.stage.addChild(this.pressSpaceLabel);
    }

    cleanUp(): void {
        this.pressSpaceLabel.destroy();
    }

    animate(time: Ticker): void {
        this.pressSpaceLabelTimeCounter = (this.pressSpaceLabelTimeCounter + time.deltaTime * 0.05) % Math.PI;
        this.pressSpaceLabel.style.fontSize = this.pressSpaceLabelInitialFontSize * Math.sin(Math.PI / 3 + this.pressSpaceLabelTimeCounter % Math.PI / 3);
    }

    handleKeyDown(evt: KeyboardEvent): void {
        if (evt.code === 'Space') {
            eventEmitter.emit(Events.WELCOME_PAGE_SPACE_PRESS);
        }
    }

    handleKeyUp(_: KeyboardEvent): void {
    }

}