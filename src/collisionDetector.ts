import { Bounds } from "pixi.js";
import GraphicalEntity from "./entities/graphicalEntity";
import eventEmitter from "./eventEmitter";
import Events from "./events";

export default class CollisionDetector {

    tracker: Map<GraphicalEntity, Array<GraphicalEntity>> = new Map<GraphicalEntity, Array<GraphicalEntity>>();

    track(leftEntity: GraphicalEntity, rightEntity: GraphicalEntity) {
        if (!this.tracker.has(leftEntity)) {
            this.tracker.set(leftEntity, []);
        }
        this.tracker.get(leftEntity)!.push(rightEntity);
    }

    untrack(leftEntity: GraphicalEntity, rightEntity: GraphicalEntity) {
        const rightEntities = this.tracker.get(leftEntity);
        const indexToRemove = rightEntities!.indexOf(rightEntity);
        rightEntities?.splice(indexToRemove, 1);
    }

    untrackMany(leftEntity: GraphicalEntity) {
        this.tracker.set(leftEntity, []);
    }

    checkCollisions() {
        for (const [leftEntity, rightEntities] of this.tracker) {
            for (const rightEntity of rightEntities) {
                if (this.areColliding(
                    leftEntity.getGraphics().getBounds(),
                    rightEntity.getGraphics().getBounds()
                )) {
                    eventEmitter.emit(Events.COLLISION_DETECTED, {
                        leftEntityId: leftEntity.getId(),
                        rightEntityId: rightEntity.getId()
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