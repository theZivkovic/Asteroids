import { Graphics, PointData, Rectangle } from "pixi.js";

export default class Asteroid {
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

    advance(delta: number, screen: Rectangle) {
        const newPosition: PointData = {
            x: this.graphics.position.x + this.direction.x * this.speed * delta,
            y: this.graphics.position.y + this.direction.y * this.speed * delta
        };

        if (newPosition.x > screen.width) {
            newPosition.x = screen.width - newPosition.y * this.direction.y / this.direction.x;
            newPosition.y = 0;
        }
        else if (newPosition.x < 0) {
            // todo
        }
        else if (newPosition.y > screen.height) {
            newPosition.y = screen.height - newPosition.x * this.direction.x / this.direction.y;
            newPosition.x = 0;
        }
        else if (newPosition.y < 0) {
            // todo
        }

        this.graphics.position.set(
            newPosition.x,
            newPosition.y
        );
    }
}