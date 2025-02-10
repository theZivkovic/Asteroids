import { Bounds, ObservablePoint, PointData } from "pixi.js";

export interface Collidable {
    getPosition(): ObservablePoint;
    setPosition(pointData: PointData): void;
    getEntityId(): number;
    getBounds(): Bounds | undefined
}