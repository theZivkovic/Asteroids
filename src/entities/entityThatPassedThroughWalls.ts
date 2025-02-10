import { ObservablePoint, PointData, Rectangle } from "pixi.js";

enum ScreenSide {
    TOP,
    RIGHT,
    LEFT,
    BOTTOM
};

export default class EntityThatPassedThroughWalls {
    private position: ObservablePoint;
    private direction: PointData = null!;

    constructor(position: ObservablePoint, direction: PointData) {
        this.position = position;
        this.direction = direction;
    }

    calculateEntryPointOnSide(screenSide: ScreenSide, exitingPosition: PointData, screen: Rectangle, direction: PointData): PointData {
        switch (screenSide) {
            case ScreenSide.TOP: return { x: exitingPosition.x - exitingPosition.y * direction.x / direction.y, y: 0 };
            case ScreenSide.LEFT: return { x: 0, y: exitingPosition.y - exitingPosition.x * direction.y / direction.x };
            case ScreenSide.BOTTOM: return { x: exitingPosition.x + (screen.height - exitingPosition.y) * direction.x / direction.y, y: screen.height };
            case ScreenSide.RIGHT: return { x: screen.width, y: exitingPosition.y + (screen.width - exitingPosition.x) * direction.y / direction.x };
            default: throw new Error(`unhandled side ${screenSide}`);
        }
    }

    calculateNewEntryPoint(possibleEntrySides: Set<ScreenSide>, exitingPosition: PointData, screen: Rectangle): PointData {
        const entryPointCandidates = [...possibleEntrySides]
            .map(possibleEntrySide => this.calculateEntryPointOnSide(possibleEntrySide, exitingPosition, screen, this.direction));

        const candidateWithinScreenBounds = entryPointCandidates
            .filter(candidate => candidate.x >= 0 && candidate.x <= screen.width &&
                candidate.y >= 0 && candidate.y <= screen.height)[0];

        return candidateWithinScreenBounds;
    }

    advance(screen: Rectangle) {
        // if (this.graphics.destroyed) { return; }
        const newPosition = { x: this.position.x, y: this.position.y };

        if (newPosition.x > screen.width) {
            const newEntryPoint = this.calculateNewEntryPoint(new Set([
                ScreenSide.TOP,
                ScreenSide.LEFT,
                ScreenSide.BOTTOM
            ]), newPosition, screen);

            newPosition.x = newEntryPoint.x
            newPosition.y = newEntryPoint.y;
        }
        else if (newPosition.x < 0) {
            const newEntryPoint = this.calculateNewEntryPoint(new Set([
                ScreenSide.TOP,
                ScreenSide.RIGHT,
                ScreenSide.BOTTOM
            ]), newPosition, screen);

            newPosition.x = newEntryPoint.x
            newPosition.y = newEntryPoint.y;
        }
        else if (newPosition.y > screen.height) {
            const newEntryPoint = this.calculateNewEntryPoint(new Set([
                ScreenSide.LEFT,
                ScreenSide.TOP,
                ScreenSide.RIGHT
            ]), newPosition, screen);

            newPosition.x = newEntryPoint.x
            newPosition.y = newEntryPoint.y;
        }
        else if (newPosition.y < 0) {
            const newEntryPoint = this.calculateNewEntryPoint(new Set([
                ScreenSide.LEFT,
                ScreenSide.BOTTOM,
                ScreenSide.RIGHT
            ]), newPosition, screen);

            newPosition.x = newEntryPoint.x
            newPosition.y = newEntryPoint.y;
        }

        this.position.set(newPosition.x, newPosition.y);
    }
}