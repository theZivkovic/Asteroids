import { Bounds, Container, ContainerChild, PointData, Rectangle, Sprite, Ticker, ViewContainer } from "pixi.js";
import MovableEntity from "./movableEntity";
import EntityThatPassedThroughWalls from "./entityThatPassedThroughWalls";
import Entity from "./entity";
import { Collidable } from "./collidable";
import { TextureId, textureLoader } from "../textureLoader";

enum AsteroidSize {
    BIG = 2,
    MEDIUM = 1,
    SMALL = 0
};

class Asteroid implements Collidable {
    private entity: Entity;
    private movableEntity: MovableEntity;
    private entityThatPassesThroughtWalls: EntityThatPassedThroughWalls;
    private asteroidSize: AsteroidSize;
    private graphics: ViewContainer;
    private textureId: TextureId;

    constructor(entityId: number, bodyWidth: number, textureId: TextureId, asteroidSize: AsteroidSize, direction: PointData, speed: number) {
        this.textureId = textureId;
        this.asteroidSize = asteroidSize;
        this.graphics = this.createSprite(bodyWidth, textureId);
        this.entity = new Entity(entityId);
        this.movableEntity = new MovableEntity(this.graphics.position, direction, speed);
        this.entityThatPassesThroughtWalls = new EntityThatPassedThroughWalls(this.graphics.position, direction);
    }

    getBounds(): Bounds | undefined {
        return this.graphics.destroyed ? undefined : this.graphics.getBounds();
    }

    getTexture(): TextureId {
        return this.textureId;
    }

    addToStage(stage: Container<ContainerChild>) {
        stage.addChild(this.graphics);
    }

    destroy() {
        this.graphics.destroy();
    }

    setPosition(newPosition: PointData) {
        this.movableEntity.setPosition(newPosition);
    }

    getPosition() {
        return this.movableEntity.getPosition();
    }

    private createSprite(bodyWidth: number, textureId: TextureId) {
        const sprite = new Sprite(textureLoader.getTexture(textureId));
        sprite.width = bodyWidth;
        sprite.height = bodyWidth;
        sprite.anchor = 0.5;
        return sprite;
    }

    getAsteroidSize() {
        return this.asteroidSize;
    }

    getMovableEntity() {
        return this.movableEntity;
    }

    advance(time: Ticker, screen: Rectangle) {
        this.movableEntity.advance(time);
        this.entityThatPassesThroughtWalls.advance(screen);
        this.graphics.rotation += time.deltaTime * 0.01 * Math.random();
    }

    getEntityId() {
        return this.entity.getId();
    }
}

export {
    Asteroid, AsteroidSize
}