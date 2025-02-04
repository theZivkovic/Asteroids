import { Application, Renderer, Ticker } from "pixi.js";

export default interface Page {
    initialize(app: Application<Renderer>): void;
    cleanUp(): void;
    animate(time: Ticker): void;
    handleKeyboardEvent(evt: KeyboardEvent): void;
}