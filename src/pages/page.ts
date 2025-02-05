import { Application, Renderer, Ticker } from "pixi.js";

enum PageId {
    WelcomePage,
    PlayPage
};

interface Page {
    initialize(app: Application<Renderer>): void;
    cleanUp(): void;
    animate(time: Ticker): void;
    handleKeyDown(evt: KeyboardEvent): void;
    handleKeyUp(evt: KeyboardEvent): void;
    handleMouseDown(evt: MouseEvent): void;
    handleMouseUp(evt: MouseEvent): void;
    getPageId(): PageId
}
export { type Page, PageId };