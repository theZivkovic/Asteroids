import Player from "./player";
import eventEmitter from "../eventEmitter";
import Events from "../events";
import { Ticker } from "pixi.js";

export default class BulletSpawner {

    player: Player;
    spawnInterval: number;
    spawnTimer: number;
    isShooting: boolean;

    constructor(player: Player, spawnInterval: number) {
        this.player = player;
        this.spawnInterval = spawnInterval;
        this.spawnTimer = 0;
        this.isShooting = true;
    }

    animate(time: Ticker): void {
        if (!this.isShooting) {
            return;
        }
        this.spawnTimer += time.deltaTime;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnBullet();
            this.spawnTimer = this.spawnTimer - this.spawnInterval;
        }
    }

    startShooting() {
        this.isShooting = true;
    }

    endShooting() {
        this.isShooting = false;
    }

    private spawnBullet() {
        eventEmitter.emit(Events.SPAWN_A_BULLET);
    }

}