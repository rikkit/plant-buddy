
import chroma from "chroma-js";
import * as geometric from "geometric";

export class LeafModel {
  _points: geometric.Polygon;

  constructor() {
    this._points = [
      [0, 0],
      [2, 1],
      [4, 0],
      [2, -1],
      [0, 0]
    ];
  }

  grow(points: number): number {
    return points - 1;
  }
}