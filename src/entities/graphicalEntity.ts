import { Graphics } from "pixi.js";
import Entity from "./entity";

export default class GraphicalEntity {

    private entity: Entity;
    private graphics: Graphics;

    constructor(entityId: number, graphics: Graphics) {
        this.entity = new Entity(entityId);
        this.graphics = graphics;
    }

    getId() {
        return this.entity.getId();
    }

    getGraphics() {
        return this.graphics;
    }
}