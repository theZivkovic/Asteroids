import Player from "./player";
import eventEmitter from "../eventEmitter";
import Events from "../events";
import { Ticker } from "pixi.js";

export default class BulletSpawner {

    player: Player;
    spawnIntervalMs: number;
    spawnTimerMs: number;
    isShooting: boolean;

    constructor(player: Player, spawnInterval: number) {
        this.player = player;
        this.spawnIntervalMs = spawnInterval;
        this.spawnTimerMs = 0;
        this.isShooting = true;
    }

    animate(time: Ticker): void {
        if (!this.isShooting) {
            return;
        }
        this.spawnTimerMs += time.deltaMS;
        if (this.spawnTimerMs >= this.spawnIntervalMs) {
            this.spawnBullet();
            this.spawnTimerMs = this.spawnTimerMs - this.spawnIntervalMs;
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