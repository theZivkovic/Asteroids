import { Application, BitmapText, Renderer } from "pixi.js";

export default class LivesLabel {

    label: BitmapText = null!;
    lives: number = 5;

    initialize(app: Application<Renderer>) {
        this.label = new BitmapText({
            text: this.generateLivesText(),
            style: {
                fontFamily: 'Arial',
                fontSize: 20,
                align: 'left',
            },
        });
        this.label.anchor.set(0, 0);
        this.label.position.set(100, 5);
        app.stage.addChild(this.label);
    }

    updateLives(deltaLives: number) {
        this.lives += deltaLives;
        this.label.text = this.generateLivesText();
    }

    generateLivesText() {
        return `Lives: ${[...Array(this.lives).keys()].map(_ => '♡').join('')}`;
    }
}