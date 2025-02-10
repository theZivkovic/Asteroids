import { Bounds, Container, ContainerChild, PointData, Rectangle, Sprite, Ticker } from "pixi.js";
import MovableEntity from "./movableEntity";
import eventEmitter from "../eventEmitter";
import Events from "../events";
import Entity from "./entity";
import { Collidable } from "./collidable";
import { TextureId, textureLoader } from "../textureLoader";

export default class Bullet implements Collidable {
    private entity: Entity;
    private movableEntity: MovableEntity;
    private sprite: Sprite;

    constructor(entityId: number, bodyWidth: number, bodyHeight: number, playerTopPosition: PointData, direction: PointData, speed: number) {
        const thisPosition = { x: playerTopPosition.x, y: playerTopPosition.y }
        this.entity = new Entity(entityId);

        this.sprite = new Sprite(textureLoader.getTexture(TextureId.HAND));
        this.sprite.width = bodyWidth;
        this.sprite.height = bodyHeight;
        this.sprite.anchor = 0.5;
        this.sprite.rotation = Math.atan2(direction.y, direction.x) + Math.PI / 2;
        this.sprite.position.set(thisPosition.x, thisPosition.y);

        this.movableEntity = new MovableEntity(this.sprite.position, { x: direction.x, y: direction.y }, speed);
    }

    getBounds(): Bounds | undefined {
        return this.sprite.destroyed ? undefined : this.sprite.getBounds();
    }

    setPosition(newPosition: PointData) {
        this.movableEntity.setPosition(newPosition);
    }

    getPosition() {
        return this.movableEntity.getPosition();
    }

    addToStage(stage: Container<ContainerChild>) {
        stage.addChild(this.sprite);
    }

    destroy() {
        this.sprite.destroy();
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
}