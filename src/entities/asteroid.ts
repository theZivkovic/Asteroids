import { Bounds, Container, ContainerChild, PointData, Rectangle, Sprite, Ticker, ViewContainer } from "pixi.js";
import MovableEntity from "./movableEntity";
import EntityThatPassedThroughWalls from "./entityThatPassedThroughWalls";
import { AsteroidScalesConfig, AsteroidSpeedsConfig } from "../config";
import Entity from "./entity";
import { Collidable } from "./collidable";
import { AssetId, assetLoader } from "../assetLoader";

enum AsteroidSize {
    BIG,
    MEDIUM,
    SMALL
};

class Asteroid implements Collidable {
    private entity: Entity;
    private movableEntity: MovableEntity;
    private entityThatPassesThroughtWalls: EntityThatPassedThroughWalls;
    private asteroidSize: AsteroidSize;
    private graphics: ViewContainer;

    constructor(entityId: number, baseAsteroidWidth: number, asteroidSize: AsteroidSize, direction: PointData, baseAsteroidSpeed: number, scales: AsteroidScalesConfig, speeds: AsteroidSpeedsConfig) {
        this.asteroidSize = asteroidSize;
        const speed = this.calculateSpeedBaseOnSize(baseAsteroidSpeed, asteroidSize, speeds);
        this.graphics = this.createGraphicsBySize(baseAsteroidWidth, asteroidSize, scales);
        this.entity = new Entity(entityId);
        this.movableEntity = new MovableEntity(this.graphics.position, direction, speed);
        this.entityThatPassesThroughtWalls = new EntityThatPassedThroughWalls(this.graphics.position, direction);
    }

    getBounds(): Bounds | undefined {
        return this.graphics.destroyed ? undefined : this.graphics.getBounds();
    }

    calculateSpeedBaseOnSize(baseSpeed: number, asteriodSize: AsteroidSize, speeds: AsteroidSpeedsConfig) {
        switch (asteriodSize) {
            case AsteroidSize.BIG: return baseSpeed * speeds.big;
            case AsteroidSize.MEDIUM: return baseSpeed * speeds.medium;
            case AsteroidSize.SMALL: return baseSpeed * speeds.small;
            default: return baseSpeed;
        }
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

    createGraphicsBySize(bigAsteroidWidth: number, asteroidSize: AsteroidSize, scales: AsteroidScalesConfig) {



        switch (asteroidSize) {

            case AsteroidSize.BIG: {
                const sprite = new Sprite(assetLoader.getTexture(AssetId.ASTEROID));
                sprite.width = bigAsteroidWidth;
                sprite.height = bigAsteroidWidth;
                sprite.anchor = 0.5;
                return sprite;
            }
            case AsteroidSize.MEDIUM: {
                const sprite = new Sprite(assetLoader.getTexture(AssetId.ASTEROID));
                sprite.width = bigAsteroidWidth;
                sprite.height = bigAsteroidWidth;
                sprite.scale.x *= scales.medium;
                sprite.scale.y *= scales.medium;
                sprite.anchor = 0.5;
                return sprite;
            }
            case AsteroidSize.SMALL: {
                const sprite = new Sprite(assetLoader.getTexture(AssetId.ASTEROID));
                sprite.width = bigAsteroidWidth;
                sprite.height = bigAsteroidWidth;
                sprite.scale.x *= scales.small;
                sprite.scale.y *= scales.small;
                sprite.anchor = 0.5;
                return sprite;
            }
            default: throw new Error(`asteroid size: ${asteroidSize} not supported for creation`);
        }
    }

    getAsteroidSize() {
        return this.asteroidSize;
    }

    getMovableEntity() {
        return this.movableEntity
            ;
    }

    advance(time: Ticker, screen: Rectangle) {
        this.movableEntity.advance(time);
        this.entityThatPassesThroughtWalls.advance(screen);
        this.graphics.rotation += time.deltaTime * 0.01 * Math.random();
    }

    getEntityId() {
        return this.entity.getId();
    }

    static SmallerAsteroidSize(asteroidSize: AsteroidSize) {
        switch (asteroidSize) {
            case AsteroidSize.BIG: return AsteroidSize.MEDIUM;
            case AsteroidSize.MEDIUM: return AsteroidSize.SMALL;
            default: throw new Error(`There are no smaller asteroid sizes than ${asteroidSize}`);
        }
    }

    getGraphics() {
        return this.graphics;
    }
}

export {
    Asteroid, AsteroidSize
}