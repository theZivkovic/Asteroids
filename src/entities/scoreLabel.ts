import { BitmapText } from "pixi.js";

export default class ScoreLabel {

    label: BitmapText = null!;
    score: number = 0;

    constructor() {
        this.label = new BitmapText({
            text: 'Score: 0',
            style: {
                fontFamily: 'Arial',
                fontSize: 20,
                align: 'left',
            },
        });
        this.label.anchor.set(0, 0);
    }

    updateScore(deltaScore: number) {
        this.score += deltaScore;
        this.label.text = `Score: ${this.score}`;
    }

    getGraphics() {
        return this.label;
    }
}