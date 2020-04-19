
import chroma from "chroma-js";
import * as geometric from "geometric";

export class LeafModel {
  _points: geometric.Polygon;

  constructor(private info: PlantInfo) {
    this._points = [
      [0, 0],
      [2, 1],
      [4, 0],
      [2, -1],
      [0, 0]
    ];
  }

  grow(points: number): number {
    const maxLeafLength = this.info.growthFactor * 120;
    const base = this._points[0];
    const tip = this._points[2];
    const leafLength = Phaser.Math.Distance.Between(base[0], base[1], tip[0], tip[1]);
    if (leafLength < maxLeafLength) {
      this._points = geometric.polygonScale(this._points, 1 + (this.info.growthFactor / 5), base);
      points -= 3;
    }

    return points;
  }
}