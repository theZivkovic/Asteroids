import { Graphics, PointData, Rectangle } from "pixi.js";
import MovableEntity from "./movableEntity";
import eventEmitter from "../eventEmitter";
import Events from "../events";
import Entity from "./entity";

export default class Bullet {
    private entity: Entity;
    private movableEntity: MovableEntity;

    constructor(entityId: number, graphics: Graphics, direction: PointData, speed: number) {
        this.entity = new Entity(entityId);
        this.movableEntity = new MovableEntity(graphics, { x: direction.x, y: direction.y }, speed);
    }

    getGraphics() {
        return this.movableEntity.getGraphics();
    };

    advance(delta: number, screen: Rectangle,) {
        this.movableEntity.advance(delta);
        const position = this.getGraphics().position;
        if (position.x >= screen.width || position.x < 0 ||
            position.y >= screen.height || position.y < 0) {
            eventEmitter.emit(Events.BULLET_REACHED_A_WALL, { bulletEntityId: this.entity.getId() });
        }
    }

    getEntityId() {
        return this.entity.getId();
    }
}