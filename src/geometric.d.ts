// https://github.com/HarryStevens/geometric

declare module "geometric" {
  type Point = [number, number];
  type Polygon = [number, number][];
  function polygonScale(polygon: Polygon, scaleFactor: number, origin?: Point): Polygon;
  function polygonRotate(polygon: Polygon, rotate: number, origin?: Point): Polygon;
}