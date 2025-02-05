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

    untrackRight(rightEntity: GraphicalEntity) {
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

    untrackLeft(leftEntity: GraphicalEntity) {
        this.tracker.delete(leftEntity);
    }

    checkCollisions() {
        console.log(this.tracker);
        for (const [leftEntity, rightEntities] of this.tracker) {
            for (const rightEntity of rightEntities) {

                if (leftEntity.getGraphics().destroyed || rightEntity.getGraphics().destroyed) {
                    continue; // see how to remove this check (not sure why entities are not properly destroyed at this moment)
                }

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