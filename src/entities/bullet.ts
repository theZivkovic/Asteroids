import { Container, ContainerChild, Graphics, PointData, Rectangle } from "pixi.js";
import MovableEntity from "./movableEntity";
import eventEmitter from "../eventEmitter";
import Events from "../events";
import GraphicalEntity from "./graphicalEntity";

export default class Bullet {
    private graphicalEntity: GraphicalEntity;
    private movableEntity: MovableEntity;

    constructor(entityId: number, graphics: Graphics, direction: PointData, speed: number) {
        this.graphicalEntity = new GraphicalEntity(entityId, graphics);
        this.movableEntity = new MovableEntity(graphics, { x: direction.x, y: direction.y }, speed);
    }

    addToStage(stage: Container<ContainerChild>) {
        stage.addChild(this.graphicalEntity.getGraphics());
    }

    destroy() {
        this.getGraphicalEntity().getGraphics().destroy();
    }

    getGraphicalEntity() {
        return this.graphicalEntity;
    }

    advance(delta: number, screen: Rectangle,) {
        this.movableEntity.advance(delta);
        const position = this.getGraphicalEntity().getGraphics().position;
        if (position.x >= screen.width || position.x < 0 ||
            position.y >= screen.height || position.y < 0) {
            eventEmitter.emit(Events.BULLET_REACHED_A_WALL, { bulletEntityId: this.graphicalEntity.getId() });
        }
    }

    getEntityId() {
        return this.graphicalEntity.getId();
    }
}