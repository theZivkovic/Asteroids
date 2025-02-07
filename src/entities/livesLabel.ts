import { BitmapText } from "pixi.js";
import eventEmitter from "../eventEmitter";
import Events from "../events";

export default class LivesLabel {

    label: BitmapText = null!;
    lives: number;

    constructor(initialLives: number) {
        this.lives = initialLives;
        this.label = new BitmapText({
            text: this.generateLivesText(),
            style: {
                fontFamily: 'Arial',
                fontSize: 20,
                align: 'left',
            },
        });
        this.label.anchor.set(0, 0);
    }

    updateLives(deltaLives: number) {
        this.lives += deltaLives;
        this.label.text = this.generateLivesText();
        if (this.lives == 0) {
            eventEmitter.emit(Events.ALL_LIVES_LOST);
        }
    }

    generateLivesText() {
        return `Lives: ${[...Array(this.lives).keys()].map(_ => '♡').join('')}`;
    }

    getGraphics() {
        return this.label;
    }
}