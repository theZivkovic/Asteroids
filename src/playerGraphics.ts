import { Graphics, PointData } from 'pixi.js';
import { createTriangleContent } from './graphicsContentsFactory';

const createPlayerGraphics = (
    initialPosition: PointData,
    width: number,
    height: number,
    color: number) => {
    const content = createTriangleContent(width, height, color); // TODO: make only one content and reuse it always
    const graphics = new Graphics(content);
    graphics.x = initialPosition.x;
    graphics.y = initialPosition.y;
    return graphics;
}

const createFireEngineGraphics = (playerBodyWidth: number, playerBodyHeight: number, color: number) => {
    const content = createTriangleContent(playerBodyWidth * 0.75, playerBodyWidth * 0.75, color);
    const graphics = new Graphics(content);
    graphics.position.set(0, playerBodyHeight / 2 + playerBodyWidth * 0.75 / 2);
    graphics.rotation = Math.PI;
    return graphics;
}

export { createPlayerGraphics, createFireEngineGraphics }