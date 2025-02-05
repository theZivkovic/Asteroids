import { PointData } from "pixi.js"

const rotateVector = (vector: PointData, radians: number) => {
    const currentRadians = Math.atan2(vector.y, vector.x);
    const newRadians = currentRadians + radians;
    return { x: Math.cos(newRadians), y: Math.sin(newRadians) }
}

export { rotateVector }