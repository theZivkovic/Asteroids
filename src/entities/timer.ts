import { Ticker } from "pixi.js";

export default class Timer {

    currentTimeMs: number = 0;
    endTimeMs: number = 0;
    stopped: boolean;

    constructor(endTimeMs: number) {
        this.stopped = true;
        this.endTimeMs = endTimeMs;
    }

    restart() {
        this.currentTimeMs = 0;
        this.stopped = false;
    }

    animate(time: Ticker) {
        if (this.isRunning()) {
            this.currentTimeMs += time.deltaMS;
            if (this.currentTimeMs >= this.endTimeMs) {
                this.stopped = true;
            }
        }

    }

    isRunning() {
        return !this.stopped;
    }
}