import { Graphics, PointData } from 'pixi.js';
import { createPlayerTriangleContent } from './graphicsContentsFactory';

const createPlayerGraphics = (initialPosition: PointData) => {
    const content = createPlayerTriangleContent(15, 30);
    const graphics = new Graphics(content);
    graphics.x = initialPosition.x;
    graphics.y = initialPosition.y;
    return graphics;
}

export { createPlayerGraphics }