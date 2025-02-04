import { GraphicsContext } from "pixi.js";

const createPlayerTriangleContent = (width: number, height: number) => {
  return new GraphicsContext()
    .moveTo(0, height)
    .lineTo(width, height)
    .lineTo(width / 2.0, 0)
    .lineTo(0, height)
    .stroke({ color: 0xFFFFFF, pixelLine: true });
}

const createAsteroidContent = (radius: number) => {
  return new GraphicsContext()
    .circle(0, 0, radius)
    .stroke({ color: 0xFFFFFF, pixelLine: true });
}

export {
  createPlayerTriangleContent,
  createAsteroidContent
}