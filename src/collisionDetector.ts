import { Bounds } from "pixi.js";
import eventEmitter from "./eventEmitter";
import Events from "./events";
import { Collidable } from "./entities/collidable";

class CollisionDetector {
    tracker: Map<Collidable, Array<Collidable>> = new Map<Collidable, Array<Collidable>>();

    track(leftEntity: Collidable, rightEntity: Collidable) {
        if (!this.tracker.has(leftEntity)) {
            this.tracker.set(leftEntity, []);
        }
        this.tracker.get(leftEntity)!.push(rightEntity);
    }

    untrackRight(rightEntity: Collidable) {
        for (const [leftEntity, rightEntities] of this.tracker) {
            const rightEntityIndex = rightEntities.indexOf(rightEntity);
            if (rightEntityIndex >= 0) {
                rightEntities.splice(rightEntityIndex, 1);
            }
            if (rightEntities.length == 0) {
                this.tracker.delete(leftEntity);
            }
        }
    }

    untrackLeft(leftEntity: Collidable) {
        this.tracker.delete(leftEntity);
    }

    checkCollisions() {
        for (const [leftEntity, rightEntities] of this.tracker) {
            for (const rightEntity of rightEntities) {

                if (!leftEntity.getBounds() || !rightEntity.getBounds()) {
                    continue;
                }

                if (this.areColliding(
                    leftEntity.getBounds()!,
                    rightEntity.getBounds()!
                )) {
                    eventEmitter.emit(Events.COLLISION_DETECTED, {
                        leftEntityId: leftEntity.getEntityId(),
                        rightEntityId: rightEntity.getEntityId()
                    });
                }

            }
        }
    }

    areColliding(a: Bounds, b: Bounds) {
        return a.x < b.x + b.width
            && a.x + a.width > b.x
            && a.y < b.y + b.height
            && a.y + a.height > b.y
    }
}

export { CollisionDetector }