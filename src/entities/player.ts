import { Bounds, Container, ContainerChild, Graphics, PointData, Rectangle, Ticker } from "pixi.js";
import MovableEntity from "./movableEntity";
import EntityThatPassedThroughWalls from "./entityThatPassedThroughWalls";
import { createFireEngineGraphics, createPlayerGraphics } from "../playerGraphics";
import Timer from "./timer";
import Entity from "./entity";
import { Collidable } from "./collidable";

export default class Player implements Collidable {
    private currentAcceleration: number;
    private rotationSpeed: number;
    private shouldRotate: boolean = false;
    private counterClockwiseRotation: boolean = false;
    private initialDirection: PointData;
    private entity: Entity;
    private movableEntity: MovableEntity;
    private entityThatPassesThroughtWalls: EntityThatPassedThroughWalls;
    private fireEngineGraphics: Graphics;
    private cooldownTimer: Timer;
    private playerCooldownGraphics: Graphics;
    private acceleration: number;
    private maxSpeed: number;
    private graphics: Graphics;
    private bodyHeight: number;

    constructor(entityId: number, initialPosition: PointData, direction: PointData, rotationSpeed: number,
        bodyWidth: number, bodyHeight: number, bodyColor: number, fireColor: number, cooldownColor: number,
        cooldownTimeMs: number, acceleration: number, maxSpeed: number
    ) {
        const playerGraphics = createPlayerGraphics(initialPosition, bodyWidth, bodyHeight, bodyColor);
        this.graphics = playerGraphics;

        this.playerCooldownGraphics = createPlayerGraphics(initialPosition, bodyWidth, bodyHeight, cooldownColor);
        this.playerCooldownGraphics.position.set(0, 0);
        this.playerCooldownGraphics.visible = false;
        playerGraphics.addChild(this.playerCooldownGraphics);

        this.fireEngineGraphics = createFireEngineGraphics(bodyWidth, bodyHeight, fireColor);
        playerGraphics.addChild(this.fireEngineGraphics);

        this.entity = new Entity(entityId);
        this.movableEntity = new MovableEntity(playerGraphics.position, direction, 0);
        this.entityThatPassesThroughtWalls = new EntityThatPassedThroughWalls(playerGraphics.position, direction);
        this.initialDirection = { x: direction.x, y: direction.y };
        this.currentAcceleration = 0;
        this.rotationSpeed = rotationSpeed;
        this.cooldownTimer = new Timer(cooldownTimeMs);
        this.acceleration = acceleration;
        this.maxSpeed = maxSpeed;
        this.bodyHeight = bodyHeight;
    }

    getBounds(): Bounds | undefined {
        return this.graphics.destroyed ? undefined : this.graphics.getBounds();
    }

    addToStage(stage: Container<ContainerChild>) {
        stage.addChild(this.graphics);
    }

    destroy() {
        this.graphics.destroy();
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
        this.graphics.rotation = newAngle - initialGraphicsRotation;
    }

    startCooldown() {
        this.cooldownTimer.restart();
    }

    isInCooldown() {
        return this.cooldownTimer.isRunning();
    }

    advance(time: Ticker, screen: Rectangle) {
        if (this.cooldownTimer.isRunning()) {
            this.cooldownTimer.advance(time);
            this.playerCooldownGraphics.visible = !this.playerCooldownGraphics.visible;
            this.graphics.visible = true;
        }
        else {
            this.graphics.visible = true;
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

    getEntityId() {
        return this.entity.getId();
    }

    setPosition(newPosition: PointData) {
        this.movableEntity.setPosition(newPosition);
    }

    getPosition() {
        return this.movableEntity.getPosition();
    }

    getTopPoint() {
        return {
            x: this.movableEntity.getPosition().x + this.getDirection().x * this.bodyHeight / 2.0,
            y: this.movableEntity.getPosition().y + this.getDirection().y * this.bodyHeight / 2.0
        }
    }
}