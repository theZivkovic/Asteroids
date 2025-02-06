import { Container, ContainerChild, Graphics, PointData, Rectangle, Ticker } from "pixi.js";
import MovableEntity from "./movableEntity";
import EntityThatPassedThroughWalls from "./entityThatPassedThroughWalls";
import GraphicalEntity from "./graphicalEntity";
import { createFireEngineGraphics, createPlayerGraphics } from "../playerGraphics";
import Timer from "./timer";

export default class Player {
    private currentAcceleration: number;
    private rotationSpeed: number;
    private shouldRotate: boolean = false;
    private counterClockwiseRotation: boolean = false;
    private initialDirection: PointData;
    private graphicalEntity: GraphicalEntity;
    private movableEntity: MovableEntity;
    private entityThatPassesThroughtWalls: EntityThatPassedThroughWalls;
    private fireEngineGraphics: Graphics;
    private cooldownTimer: Timer;
    private playerCooldownGraphics: Graphics;
    private acceleration: number;
    private maxSpeed: number;

    constructor(entityId: number, initialPosition: PointData, direction: PointData, rotationSpeed: number,
        bodyWidth: number, bodyHeight: number, bodyColor: number, fireColor: number, cooldownColor: number,
        cooldownTimeMs: number, acceleration: number, maxSpeed: number
    ) {
        const playerGraphics = createPlayerGraphics(initialPosition, bodyWidth, bodyHeight, bodyColor);

        this.playerCooldownGraphics = createPlayerGraphics(initialPosition, bodyWidth, bodyHeight, cooldownColor);
        this.playerCooldownGraphics.position.set(0, 0);
        this.playerCooldownGraphics.visible = false;
        playerGraphics.addChild(this.playerCooldownGraphics);

        this.fireEngineGraphics = createFireEngineGraphics(bodyWidth, bodyHeight, fireColor);
        playerGraphics.addChild(this.fireEngineGraphics);

        this.graphicalEntity = new GraphicalEntity(entityId, playerGraphics);
        this.movableEntity = new MovableEntity(playerGraphics, direction, 0);
        this.entityThatPassesThroughtWalls = new EntityThatPassedThroughWalls(playerGraphics, direction);
        this.initialDirection = { x: direction.x, y: direction.y };
        this.currentAcceleration = 0;
        this.rotationSpeed = rotationSpeed;
        this.cooldownTimer = new Timer(cooldownTimeMs);
        this.acceleration = acceleration;
        this.maxSpeed = maxSpeed;
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
        this.currentAcceleration = this.acceleration;
    }

    slowDown() {
        this.currentAcceleration = -this.acceleration;
    }

    startRotate(counterClockwiseRotation: boolean) {
        this.shouldRotate = true;
        this.counterClockwiseRotation = counterClockwiseRotation;
    }

    endRotate() {
        this.shouldRotate = false;
    }

    rotate(time: Ticker, counterClockwise: boolean) {
        const sign = counterClockwise ? 1 : -1;
        const angle = Math.atan2(this.movableEntity.getDirection().y, this.movableEntity.getDirection().x);
        const newAngle = (angle + time.deltaTime * sign * this.rotationSpeed);
        this.movableEntity.setDirection({
            x: Math.cos(newAngle),
            y: Math.sin(newAngle)
        });
        const initialGraphicsRotation = Math.atan2(this.initialDirection.y, this.initialDirection.x)
        this.graphicalEntity.getGraphics().rotation = newAngle - initialGraphicsRotation;
    }

    startCooldown() {
        this.cooldownTimer.restart();
    }

    isInCooldown() {
        return this.cooldownTimer.isRunning();
    }

    advance(time: Ticker, screen: Rectangle) {
        if (this.cooldownTimer.isRunning()) {
            this.cooldownTimer.animate(time);
            this.playerCooldownGraphics.visible = !this.playerCooldownGraphics.visible;
            this.graphicalEntity.getGraphics().visible = true;
        }
        else {
            this.graphicalEntity.getGraphics().visible = true;
            this.playerCooldownGraphics.visible = false;
        }
        if (this.currentAcceleration > 0) {
            this.fireEngineGraphics.visible = !this.fireEngineGraphics.visible;
        }
        if (this.currentAcceleration <= 0) {
            this.fireEngineGraphics.visible = false;
        }
        if (this.shouldRotate) {
            this.rotate(time, this.counterClockwiseRotation);
        }

        let newSpeed = this.movableEntity.getSpeed() + this.currentAcceleration * time.deltaTime;
        if (newSpeed > this.maxSpeed) {
            newSpeed = this.maxSpeed;
        }
        else if (newSpeed < 0.0) {
            newSpeed = 0;
        }
        this.movableEntity.setSpeed(newSpeed);

        this.movableEntity.advance(time);
        this.entityThatPassesThroughtWalls.advance(screen);
    }
}