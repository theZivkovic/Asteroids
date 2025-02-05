import { Graphics, PointData } from "pixi.js";

export default class MovableEntity {
    private graphics: Graphics = null!;
    private direction: PointData = null!;
    private speed: number = 1;

    constructor(graphics: Graphics, direction: PointData, speed: number) {
        this.graphics = graphics;
        this.direction = direction;
        this.speed = speed;
    }

    getGraphics() {
        return this.graphics
    };

    getDirection() {
        return this.direction;
    }

    getSpeed() {
        return this.speed;
    }

    setSpeed(speed: number) {
        this.speed = speed;
    }

    advance(delta: number) {
        const newPosition: PointData = {
            x: this.graphics.position.x + this.direction.x * this.speed * delta,
            y: this.graphics.position.y + this.direction.y * this.speed * delta
        };

        this.graphics.position.set(
            newPosition.x,
            newPosition.y
        );
    }
}