import Phaser from "phaser";
import chroma from "chroma-js";
const Vector2 = Phaser.Math.Vector2;

export default class extends Phaser.Scene {
  loam: Phaser.GameObjects.Rectangle;
  plant: PlantModel;
  tick: number = 0;

  constructor() {
    super("PlayGame");
  }

  preload() {

  }

  create() {
    const height = this.game.scale.height / 3;
    const width = this.game.scale.width;

    this.loam = this.add.rectangle(width / 2, this.game.scale.height - height / 2, width, height, chroma("sandybrown").darken(3).num());

    this.plant = new PlantModel(this, width / 2, 2 * (this.game.scale.height / 3));

    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        this.tick += 1;
        console.debug(this.tick);
      }
    });
  }

  update(time: number, delta: number) {
    this.plant.update(this.tick);
  }
};


class PlantModel {
  currentTick: number = 0;
  gfx: Phaser.GameObjects.Graphics;
  seed: Phaser.GameObjects.Sprite;
  stalk: Phaser.Curves.Spline;
  leaves: LeafModel[];

  constructor(private scene: Phaser.Scene, x: number, y: number) {
    this.gfx = scene.add.graphics();

    const seedX = x;
    const seedY = y + 30;
    this.gfx.fillStyle(chroma("yellow").num());
    this.gfx.fillRect(0, 0, 10, 20);
    this.gfx.generateTexture("seed", 10, 20);
    this.gfx.clear();
    this.seed = scene.add.sprite(seedX, seedY, "seed");

    this.stalk = new Phaser.Curves.Spline([
      [seedX, seedY],
      [seedX, seedY],
    ])

    this.leaves = [
      new LeafModel(scene, this.gfx, this.stalk, 1, false),
      new LeafModel(scene, this.gfx, this.stalk, 1, true),
    ]
  }

  update(tick: number) {
    if (tick <= this.currentTick) {
      return;
    }

    this.currentTick = tick;
    const growthFactor = 0.5; // 0 - 1 per species

    // consider each segment of our curve
    // growth occurs most rapidly at the end, but also there's a slight scale to the whole plant

    this.stalk.points[1].y -= (10 * Math.min(Math.max(growthFactor, 0), 1));


    this.gfx.clear();
    this.gfx.lineStyle(2, chroma("green").num(), 0.8);
    this.stalk.draw(this.gfx, 64);

    for (const leaf of this.leaves) {
      leaf.update(tick);
    }
  }
}

class LeafModel {
  currentTick: number;
  poly: Phaser.Geom.Polygon;

  constructor(
    private scene: Phaser.Scene,
    private gfx: Phaser.GameObjects.Graphics,
    private stalk: Phaser.Curves.Spline,
    private originPointIndex: number,
    clockwise: boolean
  ) {
    const points = [
      [0, 0],
      clockwise ? [10, 5] : [-10, 5],
      clockwise ? [20, 0] : [-20, 0],
      clockwise ? [10, -5] : [-10, -5],
      [0, 0]
    ]

    this.poly = new Phaser.Geom.Polygon(points as any);
  }

  update(tick: number) {
    if (tick <= this.currentTick) {
      return;
    }
    this.currentTick = tick;

    const leafOrigin = this.stalk.points[this.originPointIndex];
    fillPolygon(this.gfx, leafOrigin, this.poly);
  }
}

const fillPolygon = (gfx: Phaser.GameObjects.Graphics, origin: Phaser.Math.Vector2, poly: Phaser.Geom.Polygon) => {
  gfx.fillStyle(chroma("green").num());
  gfx.beginPath();
  gfx.moveTo(origin.x, origin.y);
  for (var i = 1; i < poly.points.length; i++) {
    gfx.lineTo(origin.x + poly.points[i].x, origin.y + poly.points[i].y);
  }
  gfx.closePath();
  gfx.fillPath();
}