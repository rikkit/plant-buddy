
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
    const maxLeafLength = this.info.leafGrowth * 200;;
    const base = this._points[0];
    const tip = this._points[2];
    const leafLength = Phaser.Math.Distance.Between(base[0], base[1], tip[0], tip[1]);
    if (leafLength < maxLeafLength * 0.6) {
      this._points = geometric.polygonScale(this._points, 1 + (this.info.leafGrowth / 5), base);
      points -= 3;
    }
    else if (leafLength < maxLeafLength) {
      this._points = geometric.polygonScale(this._points, 1 + 0.015, base);
      points -= 0.5;
    }

    return points;
  }
}