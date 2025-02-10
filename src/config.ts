type AsteroidScalesConfig = {
    big: number;
    medium: number;
    small: number
}

type AsteroidSpeedsConfig = {
    big: number,
    medium: number,
    small: number
}

const config = {
    initialLives: 3,
    player: {
        rotationSpeed: 0.1,
        bodyWidth: 20,
        bodyHeight: 40,
        bodyColor: 0xFFFFFF,
        cooldownColor: 0xFF0000,
        fireColor: 0xFFFF00,
        cooldownTimeMs: 3000,
        acceleration: 0.15,
        maxSpeed: 6
    },
    asteroids: {
        initialCount: 5,
        baseAsteroidWidth: 150,
        scales: {
            big: 1.5,
            medium: 0.7,
            small: 0.2
        },
        speeds: {
            big: 0.7,
            medium: 1.0,
            small: 1.2
        },
        points: {
            big: 10,
            medium: 20,
            small: 30
        }
    }
}

export { config, type AsteroidScalesConfig, type AsteroidSpeedsConfig };