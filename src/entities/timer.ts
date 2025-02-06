export default class Timer {

    currentTime: number = 0;
    endTime: number = 0;
    stopped: boolean;

    constructor() {
        this.stopped = true;
    }

    restart(endTime: number) {
        this.currentTime = 0;
        this.endTime = endTime;
        this.stopped = false;
    }

    animate(deltaTime: number) {
        if (this.isRunning()) {
            this.currentTime += deltaTime;
            if (this.currentTime >= this.endTime) {
                this.stopped = true;
            }
        }

    }

    isRunning() {
        return !this.stopped;
    }
}