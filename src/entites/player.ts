import { Graphics, PointData, Rectangle } from "pixi.js";

enum ScreenSide {
    TOP,
    RIGHT,
    LEFT,
    BOTTOM
};

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

    calculateEntryPointOnSide(screenSide: ScreenSide, exitingPosition: PointData, screen: Rectangle, direction: PointData): PointData {
        switch (screenSide) {
            case ScreenSide.TOP: return { x: exitingPosition.x - exitingPosition.y * direction.x / direction.y, y: 0 };
            case ScreenSide.LEFT: return { x: 0, y: exitingPosition.y - exitingPosition.x * direction.y / direction.x };
            case ScreenSide.BOTTOM: return { x: exitingPosition.x + (screen.height - exitingPosition.y) * direction.x / direction.y, y: screen.height };
            case ScreenSide.RIGHT: return { x: screen.width, y: exitingPosition.y + (screen.width - exitingPosition.x) * direction.y / direction.x };
            default: throw new Error(`unhandled side ${screenSide}`);
        }
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
            const intersectionCandidatesWithThreeOtherSidesOfScreen = [
                { x: newPosition.x - newPosition.y * this.direction.x / this.direction.y, y: 0 },
                { x: 0, y: newPosition.y - newPosition.x * this.direction.y / this.direction.x },
                { x: newPosition.x + (screen.height - newPosition.y) * this.direction.x / this.direction.y, y: screen.height }
            ];

            const candidateWithinScreenBounds = intersectionCandidatesWithThreeOtherSidesOfScreen
                .filter(candidate => candidate.x >= 0 && candidate.x <= screen.width &&
                    candidate.y >= 0 && candidate.y <= screen.height)[0];

            newPosition.x = candidateWithinScreenBounds.x
            newPosition.y = candidateWithinScreenBounds.y;
        }
        else if (newPosition.x < 0) {
            const intersectionCandidatesWithThreeOtherSidesOfScreen = [
                { x: newPosition.x - newPosition.y * this.direction.x / this.direction.y, y: 0 },

            ];

            const candidateWithinScreenBounds = intersectionCandidatesWithThreeOtherSidesOfScreen
                .filter(candidate => candidate.x >= 0 && candidate.x <= screen.width &&
                    candidate.y >= 0 && candidate.y <= screen.height)[0];

            newPosition.x = candidateWithinScreenBounds.x
            newPosition.y = candidateWithinScreenBounds.y;
        }
        else if (newPosition.y > screen.height) {
            const intersectionCandidatesWithThreeOtherSidesOfScreen = [
                { x: newPosition.x - newPosition.y * this.direction.x / this.direction.y, y: 0 },
                { x: 0, y: newPosition.y - newPosition.x * this.direction.y / this.direction.x },
                { x: screen.width, y: newPosition.y + (screen.width - newPosition.x) * this.direction.y / this.direction.x }
            ];

            const candidateWithinScreenBounds = intersectionCandidatesWithThreeOtherSidesOfScreen
                .filter(candidate => candidate.x >= 0 && candidate.x <= screen.width &&
                    candidate.y >= 0 && candidate.y <= screen.height)[0];

            newPosition.x = candidateWithinScreenBounds.x
            newPosition.y = candidateWithinScreenBounds.y;
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