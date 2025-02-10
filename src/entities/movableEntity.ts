import { ObservablePoint, PointData, Ticker } from "pixi.js";

export default class MovableEntity {
    private position: ObservablePoint;
    private direction: PointData;
    private speed: number = 1;

    constructor(position: ObservablePoint, direction: PointData, speed: number) {
        this.position = position;
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

    setPosition(newPosition: PointData) {
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }

    getPosition() {
        return this.position;
    }

    advance(time: Ticker) {
        const newPosition: PointData = {
            x: this.position.x + this.direction.x * this.speed * time.deltaTime,
            y: this.position.y + this.direction.y * this.speed * time.deltaTime
        };

        this.position.set(
            newPosition.x,
            newPosition.y
        );
    }
}