import { Graphics, PointData, Rectangle } from "pixi.js";

export default class Asteroid {
    private graphics: Graphics = null!;
    private direction: PointData = null!;
    private acceleration: number;
    private speed: number;
    private rotationSpeed: number;
    private shouldRotate: boolean = false;
    private counterClockwiseRotation: boolean = false;
    private initialDirection: PointData;

    constructor(graphics: Graphics, direction: PointData, acceleration: number, rotationSpeed: number) {
        this.graphics = graphics;
        this.direction = direction;
        this.initialDirection = { x: direction.x, y: direction.y };
        this.acceleration = acceleration;
        this.speed = 0;
        this.rotationSpeed = rotationSpeed;
    }

    getGraphics() {
        return this.graphics
    };

    accelerate() {
        this.acceleration = 0.5;
    }

    slowDown() {
        this.acceleration = -0.5;
    }

    startRotate(counterClockwiseRotation: boolean) {
        this.shouldRotate = true;
        this.counterClockwiseRotation = counterClockwiseRotation;
    }

    endRotate() {
        this.shouldRotate = false;
    }

    rotate(delta: number, counterClockwise: boolean) {
        const sign = counterClockwise ? 1 : -1;
        const angle = Math.atan2(this.direction.y, this.direction.x);
        const newAngle = (angle + delta * sign * this.rotationSpeed);
        this.direction.x = Math.cos(newAngle);
        this.direction.y = Math.sin(newAngle);
        const initialGraphicsRotation = Math.atan2(this.initialDirection.y, this.initialDirection.x)
        this.graphics.rotation = newAngle - initialGraphicsRotation;

    }

    advance(delta: number, screen: Rectangle) {
        if (this.shouldRotate) {
            this.rotate(delta, this.counterClockwiseRotation);
        }
        // set speed
        let newSpeed = this.speed + this.acceleration * delta;
        if (newSpeed > 10.0) {
            newSpeed = 10.0;
        }
        else if (newSpeed < 0.0) {
            newSpeed = 0;
        }
        this.speed = newSpeed;

        // set position
        const newPosition: PointData = {
            x: this.graphics.position.x + this.direction.x * this.speed * delta,
            y: this.graphics.position.y + this.direction.y * this.speed * delta
        };

        if (newPosition.x > screen.width) {
            newPosition.x = screen.width - newPosition.y * this.direction.y / this.direction.x;
            newPosition.y = 0;
        }
        else if (newPosition.x < 0) {
            newPosition.x = (screen.height - newPosition.y) * this.direction.y / this.direction.x;
            newPosition.y = screen.height
        }
        else if (newPosition.y > screen.height) {
            newPosition.y = screen.height - newPosition.x * this.direction.x / this.direction.y;
            newPosition.x = 0;
        }
        else if (newPosition.y < 0) {
            newPosition.y = (screen.width - newPosition.x) * this.direction.x / this.direction.y;
            newPosition.x = screen.width;
        }

        this.graphics.position.set(
            newPosition.x,
            newPosition.y
        );
    }
}