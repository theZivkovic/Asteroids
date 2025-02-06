import { GraphicsContext } from "pixi.js";

const createTriangleContent = (width: number, height: number, color: number) => {
  return new GraphicsContext()
    .moveTo(-width / 2.0, height / 2.0)
    .lineTo(width / 2.0, height / 2.0)
    .lineTo(0, -height / 2.0)
    .lineTo(-width / 2.0, height / 2.0)
    .stroke({ color, pixelLine: true });
}

const createCircleContent = (radius: number) => {
  return new GraphicsContext()
    .circle(0, 0, radius)
    .stroke({ color: 0xFFFFFF, pixelLine: true });
}

export {
  createTriangleContent,
  createCircleContent
}