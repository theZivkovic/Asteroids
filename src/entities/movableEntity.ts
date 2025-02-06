import { Graphics, PointData, Ticker } from "pixi.js";

export default class MovableEntity {
    private graphics: Graphics = null!;
    private direction: PointData = null!;
    private speed: number = 1;

    constructor(graphics: Graphics, direction: PointData, speed: number) {
        this.graphics = graphics;
        this.direction = direction;
        this.speed = speed;
    }

    getDirection() {
        return this.direction;
    }

    setDirection(direction: PointData) {
        this.direction.x = direction.x;
        this.direction.y = direction.y;
    }

    getSpeed() {
        return this.speed;
    }

    setSpeed(speed: number) {
        this.speed = speed;
    }

    advance(time: Ticker) {
        if (this.graphics.destroyed) { return; }
        const newPosition: PointData = {
            x: this.graphics.position.x + this.direction.x * this.speed * time.deltaTime,
            y: this.graphics.position.y + this.direction.y * this.speed * time.deltaTime
        };

        this.graphics.position.set(
            newPosition.x,
            newPosition.y
        );
    }
}