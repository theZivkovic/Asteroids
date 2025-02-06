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
            console.log(this.currentTime, '->', this.endTime);
            this.currentTime += deltaTime;
            if (this.currentTime >= this.endTime) {
                this.stopped = true;
            }
        }
        else {
            console.log('stopped');
        }

    }

    isRunning() {
        return !this.stopped;
    }
}