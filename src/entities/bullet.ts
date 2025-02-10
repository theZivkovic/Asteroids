import { Bounds, Container, ContainerChild, Graphics, PointData, Rectangle, Ticker } from "pixi.js";
import MovableEntity from "./movableEntity";
import eventEmitter from "../eventEmitter";
import Events from "../events";
import Entity from "./entity";
import { Collidable } from "./collidable";

export default class Bullet implements Collidable {
    private entity: Entity;
    private movableEntity: MovableEntity;
    private graphics: Graphics;

    constructor(entityId: number, graphics: Graphics, direction: PointData, speed: number) {
        this.entity = new Entity(entityId);
        this.movableEntity = new MovableEntity(graphics.position, { x: direction.x, y: direction.y }, speed);
        this.graphics = graphics;
    }

    getBounds(): Bounds | undefined {
        return this.graphics.destroyed ? undefined : this.graphics.getBounds();
    }

    setPosition(newPosition: PointData) {
        this.movableEntity.setPosition(newPosition);
    }

    getPosition() {
        return this.movableEntity.getPosition();
    }

    addToStage(stage: Container<ContainerChild>) {
        stage.addChild(this.graphics);
    }

    destroy() {
        this.graphics.destroy();
    }

    advance(time: Ticker, screen: Rectangle,) {
        this.movableEntity.advance(time);
        const position = this.movableEntity.getPosition();
        if (position.x >= screen.width || position.x < 0 ||
            position.y >= screen.height || position.y < 0) {
            eventEmitter.emit(Events.BULLET_REACHED_A_WALL, { bulletEntityId: this.entity.getId() });
        }
    }

    getEntityId() {
        return this.entity.getId();
    }

    getGraphics() {
        return this.graphics;
    }
}