import { Container, ContainerChild, Graphics, PointData, Rectangle, Ticker } from "pixi.js";
import MovableEntity from "./movableEntity";
import EntityThatPassedThroughWalls from "./entityThatPassedThroughWalls";
import GraphicalEntity from "./graphicalEntity";
import { createCircleContent } from "../graphicsContentsFactory";
import { AsteroidScalesConfig, AsteroidSpeedsConfig } from "../config";

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

    constructor(entityId: number, baseAsteroidWidth: number, asteroidSize: AsteroidSize, direction: PointData, baseAsteroidSpeed: number, scales: AsteroidScalesConfig, speeds: AsteroidSpeedsConfig) {
        this.asteroidSize = asteroidSize;
        const speed = this.calculateSpeedBaseOnSize(baseAsteroidSpeed, asteroidSize, speeds);
        const graphics = this.createGraphicsBySize(baseAsteroidWidth, asteroidSize, scales);
        this.graphicalEntity = new GraphicalEntity(entityId, graphics);
        this.movableEntity = new MovableEntity(graphics, direction, speed);
        this.entityThatPassesThroughtWalls = new EntityThatPassedThroughWalls(graphics, direction);
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
        stage.addChild(this.getGraphicalEntity().getGraphics());
    }

    destroy() {
        this.getGraphicalEntity().getGraphics().destroy();
    }

    setPosition(newPosition: PointData) {
        this.graphicalEntity.getGraphics().position.set(newPosition.x, newPosition.y);
    }

    getPosition() {
        return this.graphicalEntity.getGraphics().position;
    }

    createGraphicsBySize(bigAsteroidWidth: number, asteroidSize: AsteroidSize, scales: AsteroidScalesConfig) {

        switch (asteroidSize) {
            case AsteroidSize.BIG:
                const content = createCircleContent(bigAsteroidWidth);
                const graphics = new Graphics(content); return graphics;
            case AsteroidSize.MEDIUM: {
                const content = createCircleContent(bigAsteroidWidth);
                const graphics = new Graphics(content);
                graphics.scale.x *= scales.medium;
                graphics.scale.y *= scales.medium;
                return graphics;
            }
            case AsteroidSize.SMALL: {
                const content = createCircleContent(bigAsteroidWidth);
                const graphics = new Graphics(content);
                graphics.scale.x *= scales.small;
                graphics.scale.y *= scales.small;
                return graphics;
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