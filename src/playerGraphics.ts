import { Graphics, PointData } from 'pixi.js';
import { createTriangleContent } from './graphicsContentsFactory';

const createPlayerGraphics = (initialPosition: PointData, color: number) => {
    const content = createTriangleContent(15, 30, color);
    const graphics = new Graphics(content);
    graphics.x = initialPosition.x;
    graphics.y = initialPosition.y;
    return graphics;
}

const createFireEngineGraphics = () => {
    const content = createTriangleContent(10, 10, 0xFFFF00);
    const graphics = new Graphics(content);
    graphics.position.set(0, 20);
    graphics.rotation = Math.PI;
    return graphics;
}

export { createPlayerGraphics, createFireEngineGraphics }