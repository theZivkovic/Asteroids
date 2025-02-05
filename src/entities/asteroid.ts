import { Graphics, PointData, Rectangle } from "pixi.js";
import MovableEntity from "./movableEntity";
import EntityThatPassedThroughWalls from "./entityThatPassedThroughWalls";

export default class Asteroid {
    private movableEntity: MovableEntity;
    private entityThatPassesThroughtWalls: EntityThatPassedThroughWalls;

    constructor(graphics: Graphics, direction: PointData, speed: number) {
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
}