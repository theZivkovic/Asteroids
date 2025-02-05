import { Graphics, PointData, Rectangle } from "pixi.js";
import MovableEntity from "./movableEntity";
import EntityThatPassedThroughWalls from "./entityThatPassedThroughWalls";
import GraphicalEntity from "./graphicalEntity";
import { createAsteroidContent } from "../graphicsContentsFactory";

enum AsteroidSize {
    BIG,
    MEDIUM,
    SMALL
};

class Asteroid {
    private graphicalEntity: GraphicalEntity;
    private movableEntity: MovableEntity;
    private entityThatPassesThroughtWalls: EntityThatPassedThroughWalls;
    private asteroidSize: AsteroidSize;

    constructor(entityId: number, asteroidSize: AsteroidSize, direction: PointData, speed: number) {
        this.asteroidSize = asteroidSize;
        const graphics = this.createGraphicsBySize(asteroidSize);
        this.graphicalEntity = new GraphicalEntity(entityId, graphics);
        this.movableEntity = new MovableEntity(graphics, direction, speed);
        this.entityThatPassesThroughtWalls = new EntityThatPassedThroughWalls(graphics, direction);
    }

    createGraphicsBySize(asteroidSize: AsteroidSize) {
        const content = createAsteroidContent(30);
        const graphics = new Graphics(content);
        switch (asteroidSize) {
            case AsteroidSize.BIG: return graphics;
            case AsteroidSize.MEDIUM: {
                graphics.scale.x *= 0.5;
                graphics.scale.y *= 0.5;
                return graphics;
            }
            case AsteroidSize.SMALL: {
                graphics.scale.x *= 0.3;
                graphics.scale.y *= 0.3;
                return graphics;
            }
            default: return graphics;
        }
    }

    getGraphics() {
        return this.movableEntity.getGraphics();
    };

    getAsteroidSize() {
        return this.asteroidSize;
    }

    getMovableEntity() {
        return this.movableEntity
            ;
    }

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

    static SmallerAsteroidSize(asteroidSize: AsteroidSize) {
        switch (asteroidSize) {
            case AsteroidSize.BIG: return AsteroidSize.MEDIUM;
            case AsteroidSize.MEDIUM: return AsteroidSize.SMALL;
            default: throw new Error(`There are no smaller asteroid sizes than ${asteroidSize}`);
        }
    }
}

export {
    Asteroid, AsteroidSize
}