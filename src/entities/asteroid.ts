import { Graphics, PointData, Rectangle } from "pixi.js";
import MovableEntity from "./movableEntity";
import EntityThatPassedThroughWalls from "./entityThatPassedThroughWalls";
import Entity from "./entity";

export default class Asteroid {
    private entity: Entity;
    private movableEntity: MovableEntity;
    private entityThatPassesThroughtWalls: EntityThatPassedThroughWalls;

    constructor(entityId: number, graphics: Graphics, direction: PointData, speed: number) {
        this.entity = new Entity(entityId);
        this.movableEntity = new MovableEntity(graphics, direction, speed);
        this.entityThatPassesThroughtWalls = new EntityThatPassedThroughWalls(graphics, direction);
    }

    getGraphics() {
        return this.movableEntity.getGraphics();
    };

    advance(delta: number, screen: Rectangle) {
        this.movableEntity.advance(delta);
        this.entityThatPassesThroughtWalls.advance(screen);
    }

    getEntityId() {
        return this.entity.getId();
    }
}