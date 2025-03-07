import { Application, Renderer, Ticker } from "pixi.js";
import { Page, PageId } from "./pages/page";
import eventEmitter from "./eventEmitter";
import PlayPage from "./pages/playPage";
import Events from "./events";
import EndGamePage from "./pages/endGamePage";

export default class GameManager {
    private currentPage: Page;

    constructor(initialPage: Page, app: Application<Renderer>) {
        this.currentPage = initialPage;
        this.currentPage.initialize(app);
        this.handleGameEvents(app);
    }

    changePage(newPage: Page, app: Application<Renderer>) {
        this.currentPage.cleanUp();
        this.currentPage = newPage;
        this.currentPage.initialize(app);
    }

    advance(time: Ticker): void {
        this.currentPage.advance(time);
    }

    handleKeyDown(evt: KeyboardEvent) {
        this.currentPage.handleKeyDown(evt);
    }

    handleKeyUp(evt: KeyboardEvent) {
        this.currentPage.handleKeyUp(evt);
    }

    handleGameEvents(app: Application<Renderer>) {
        eventEmitter.addListener(Events.SPACE_PRESSED_FOR_GAME_START, () => {
            this.changePage(new PlayPage(), app);
        });
        eventEmitter.addListener(Events.SPAWN_A_BULLET, () => {
            if (this.currentPage.getPageId() == PageId.PlayPage) {
                const playPage = this.currentPage as PlayPage;
                playPage.addABullet();
            }
        });
        eventEmitter.addListener(Events.BULLET_REACHED_A_WALL, ({ bulletEntityId }) => {
            if (this.currentPage.getPageId() == PageId.PlayPage) {
                const playPage = this.currentPage as PlayPage;
                playPage.removeBulletById(bulletEntityId);
            }
        });
        eventEmitter.addListener(Events.COLLISION_DETECTED, ({ leftEntityId, rightEntityId }) => {
            if (this.currentPage.getPageId() == PageId.PlayPage) {
                const playPage = this.currentPage as PlayPage;
                playPage.handleCollision(leftEntityId, rightEntityId);
            }
        });
        eventEmitter.addListener(Events.ALL_LIVES_LOST, () => {
            this.changePage(new EndGamePage(), app);
        });

    }
}