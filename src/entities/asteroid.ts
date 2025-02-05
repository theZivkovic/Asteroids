import { Graphics, PointData, Rectangle } from "pixi.js";
import MovableEntity from "./movableEntity";
import EntityThatPassedThroughWalls from "./entityThatPassedThroughWalls";
import GraphicalEntity from "./graphicalEntity";

export default class Asteroid {
    private graphicalEntity: GraphicalEntity;
    private movableEntity: MovableEntity;
    private entityThatPassesThroughtWalls: EntityThatPassedThroughWalls;

    constructor(entityId: number, graphics: Graphics, direction: PointData, speed: number) {
        this.graphicalEntity = new GraphicalEntity(entityId, graphics);
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
        return this.graphicalEntity.getId();
    }

    getGraphicalEntity() {
        return this.graphicalEntity;
    }
}