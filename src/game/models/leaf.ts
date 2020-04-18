
import chroma from "chroma-js";
import * as geometric from "geometric";

export class LeafModel {
  currentTick: number;
  points: geometric.Polygon;

  constructor(
    private scene: Phaser.Scene,
    private gfx: Phaser.GameObjects.Graphics,
    private stalk: Phaser.Curves.Spline,
    private originPointIndex: number,
    clockwise: boolean
  ) {
    this.points = [
      [0, 0],
      clockwise ? [10, 5] : [-10, 5],
      clockwise ? [20, 0] : [-20, 0],
      clockwise ? [10, -5] : [-10, -5],
      [0, 0]
    ];
  }

  update(tick: number) {
    if (tick <= this.currentTick) {
      return;
    }
    this.currentTick = tick;
    this.points = geometric.polygonScale(this.points, 1.1, [0, 0]);

    const leafOrigin = this.stalk.points[this.originPointIndex];
    fillPolygon(this.gfx, leafOrigin, this.points);
  }
}

const fillPolygon = (gfx: Phaser.GameObjects.Graphics, origin: Phaser.Math.Vector2, poly: geometric.Polygon) => {
  gfx.fillStyle(chroma("green").num());
  gfx.beginPath();
  gfx.moveTo(origin.x, origin.y);
  for (var i = 1; i < poly.length; i++) {
    const [x, y] = poly[i]
    gfx.lineTo(origin.x + x, origin.y + y);
  }
  gfx.closePath();
  gfx.fillPath();
}