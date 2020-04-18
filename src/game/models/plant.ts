
import chroma from "chroma-js";
import * as geometric from "geometric";
import { LeafModel } from "./leaf";

export class PlantModel {
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