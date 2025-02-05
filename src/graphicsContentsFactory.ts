import { GraphicsContext } from "pixi.js";

const createPlayerTriangleContent = (width: number, height: number) => {
  return new GraphicsContext()
    .moveTo(-width / 2.0, height / 2.0)
    .lineTo(width / 2.0, height / 2.0)
    .lineTo(0, -height / 2.0)
    .lineTo(-width / 2.0, height / 2.0)
    .stroke({ color: 0xFFFFFF, pixelLine: true });
}

const createAsteroidContent = (radius: number) => {
  return new GraphicsContext()
    .circle(0, 0, radius)
    .stroke({ color: 0xFFFFFF, pixelLine: true });
}

const createBulletContent = (radius: number) => {
  return new GraphicsContext()
    .circle(0, 0, radius)
    .stroke({ color: 0xFFFFFF, pixelLine: true })
    .fill({ color: 0xFFFFFF });
};

export {
  createPlayerTriangleContent,
  createAsteroidContent,
  createBulletContent
}