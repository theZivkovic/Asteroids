import { Application, BitmapText, Renderer } from "pixi.js";

export default class ScoreLabel {

    label: BitmapText = null!;
    score: number = 0;

    initialize(app: Application<Renderer>) {
        this.label = new BitmapText({
            text: 'Score: 0',
            style: {
                fontFamily: 'Arial',
                fontSize: 20,
                align: 'left',
            },
        });
        this.label.anchor.set(0, 0);
        this.label.position.set(5, 5);
        app.stage.addChild(this.label);
    }

    updateScore(deltaScore: number) {
        this.score += deltaScore;
        this.label.text = `Score: ${this.score}`;
    }
}