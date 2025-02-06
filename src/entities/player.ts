import { Container, ContainerChild, Graphics, PointData, Rectangle } from "pixi.js";
import MovableEntity from "./movableEntity";
import EntityThatPassedThroughWalls from "./entityThatPassedThroughWalls";
import GraphicalEntity from "./graphicalEntity";
import { createFireEngineGraphics, createPlayerGraphics } from "../playerGraphics";
import Timer from "./timer";

export default class Player {
    private acceleration: number;
    private rotationSpeed: number;
    private shouldRotate: boolean = false;
    private counterClockwiseRotation: boolean = false;
    private initialDirection: PointData;
    private graphicalEntity: GraphicalEntity;
    private movableEntity: MovableEntity;
    private entityThatPassesThroughtWalls: EntityThatPassedThroughWalls;
    private fireEngineGraphics: Graphics;
    private cooldownTimer: Timer;

    constructor(entityId: number, initialPosition: PointData, direction: PointData, acceleration: number, rotationSpeed: number) {
        const graphics = createPlayerGraphics(initialPosition);
        this.fireEngineGraphics = createFireEngineGraphics();
        graphics.addChild(this.fireEngineGraphics);

        this.graphicalEntity = new GraphicalEntity(entityId, graphics);
        this.movableEntity = new MovableEntity(graphics, direction, 0);
        this.entityThatPassesThroughtWalls = new EntityThatPassedThroughWalls(graphics, direction);
        this.initialDirection = { x: direction.x, y: direction.y };
        this.acceleration = acceleration;
        this.rotationSpeed = rotationSpeed;
        this.cooldownTimer = new Timer();
    }

    addToStage(stage: Container<ContainerChild>) {
        stage.addChild(this.graphicalEntity.getGraphics());
    }

    destroy() {
        this.graphicalEntity.getGraphics().destroy();
    }

    getGraphicalEntity() {
        return this.graphicalEntity;
    }

    getDirection() {
        return this.movableEntity.getDirection();
    }

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
        const angle = Math.atan2(this.movableEntity.getDirection().y, this.movableEntity.getDirection().x);
        const newAngle = (angle + delta * sign * this.rotationSpeed);
        this.movableEntity.setDirection({
            x: Math.cos(newAngle),
            y: Math.sin(newAngle)
        });
        const initialGraphicsRotation = Math.atan2(this.initialDirection.y, this.initialDirection.x)
        this.graphicalEntity.getGraphics().rotation = newAngle - initialGraphicsRotation;
    }

    startCooldown() {
        this.cooldownTimer.restart(300);
    }

    isInCooldown() {
        return this.cooldownTimer.isRunning();
    }

    advance(delta: number, screen: Rectangle) {
        if (this.cooldownTimer.isRunning()) {
            this.cooldownTimer.animate(delta);
        }
        if (this.acceleration > 0) {
            this.fireEngineGraphics.visible = !this.fireEngineGraphics.visible;
        }
        if (this.acceleration <= 0) {
            this.fireEngineGraphics.visible = false;
        }
        if (this.shouldRotate) {
            this.rotate(delta, this.counterClockwiseRotation);
        }

        let newSpeed = this.movableEntity.getSpeed() + this.acceleration * delta;
        if (newSpeed > 10.0) {
            newSpeed = 10.0;
        }
        else if (newSpeed < 0.0) {
            newSpeed = 0;
        }
        this.movableEntity.setSpeed(newSpeed);

        this.movableEntity.advance(delta);
        this.entityThatPassesThroughtWalls.advance(screen);
    }
}