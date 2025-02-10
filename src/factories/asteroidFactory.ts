import { PointData } from "pixi.js";
import { Asteroid, AsteroidSize } from "../entities/asteroid";
import { TextureId } from "../textureLoader";
import Entity from "../entities/entity";
import { config } from "../config";


export default class AsteroidFactory {

    constructor() {

    }

    static createAsteroid(size: AsteroidSize, textureId: TextureId, position: PointData, direction: PointData) {
        const asteroid = new Asteroid(
            Entity.generateNextId(),
            this.calculateBodyWidthBasedOnSize(size),
            textureId,
            size,
            direction,
            this.calculateSpeedBaseOnSize(size),
        );

        asteroid.setPosition({
            x: position.x,
            y: position.y
        });

        return asteroid;
    }

    static calculateSpeedBaseOnSize(asteriodSize: AsteroidSize) {
        switch (asteriodSize) {
            case AsteroidSize.BIG: return config.asteroids.baseSpeed * config.asteroids.speeds.big;
            case AsteroidSize.MEDIUM: return config.asteroids.baseSpeed * config.asteroids.speeds.medium;
            case AsteroidSize.SMALL: return config.asteroids.baseSpeed * config.asteroids.speeds.small;
            default: return config.asteroids.baseSpeed;
        }
    }

    static calculateBodyWidthBasedOnSize(asteroidSize: AsteroidSize) {
        switch (asteroidSize) {
            case AsteroidSize.BIG: return config.asteroids.baseAsteroidWidth * config.asteroids.scales.big;
            case AsteroidSize.MEDIUM: return config.asteroids.baseAsteroidWidth * config.asteroids.scales.medium;
            case AsteroidSize.SMALL: return config.asteroids.baseAsteroidWidth * config.asteroids.scales.small;
            default: return config.asteroids.baseAsteroidWidth;
        }
    }
}