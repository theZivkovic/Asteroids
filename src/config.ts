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
    player: {
        rotationSpeed: 0.1,
        bodyWidth: 10,
        bodyHeight: 18,
        bodyColor: 0xFFFFFF,
        cooldownColor: 0xFF0000,
        fireColor: 0xFFFF00,
        cooldownTimeMs: 2000,
        acceleration: 0.15,
        maxSpeed: 6
    },
    asteroids: {
        initialCount: 15,
        baseAsteroidWidth: 50,
        scales: {
            big: 1,
            medium: 0.7,
            small: 0.4
        },
        speeds: {
            big: 0.7,
            medium: 1.0,
            small: 1.2
        }
    }
}

export { config, type AsteroidScalesConfig, type AsteroidSpeedsConfig };