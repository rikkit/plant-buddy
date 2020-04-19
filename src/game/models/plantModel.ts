
import chroma from "chroma-js";
import * as geometric from "geometric";
import { PlantNode } from "./plantNode";
import { debug } from "./debug";

export class PlantModel {
  currentTick: number = 0;
  gfx: Phaser.GameObjects.Graphics;
  seed: Phaser.GameObjects.Sprite;
  root: PlantNode;
  plantInfo: PlantInfo;
  soilY: number;

  constructor(private scene: Phaser.Scene, x: number, y: number) {

    this.plantInfo = {
      growthFactor: 0.5,
      seedDepth: 30,
    };

    this.soilY = y;
    const seedX = x;
    const seedY = y + this.plantInfo.seedDepth;
    debug("curve", `soilY ${this.soilY}`);
    debug("curve", `seedY ${seedY}`);
    debug("curve", `seed depth ${this.plantInfo.seedDepth}`);

    this.gfx = scene.add.graphics();
    this.gfx.fillStyle(chroma("yellow").num());
    this.gfx.fillRect(0, 0, 10, 20);
    this.gfx.generateTexture("seed", 10, 20);
    this.gfx.clear();
    this.seed = scene.add.sprite(seedX, seedY, "seed");

    const root = PlantNode.New(this.plantInfo, 0, 0);
    const next = root.addNode(0, 1);
    next.addLeaf();
    next.addLeaf();
    this.root = root;
  }

  update(tick: number) {
    if (tick <= this.currentTick) {
      return;
    }

    this.currentTick = tick;

    // consider each segment of our curve
    // growth occurs most rapidly at the end, but also there's a slight scale to the whole plant

    // Traverse the tree, growing on the way

    this.gfx.clear();

    let gp = 10; // TODO get from scene, moisture, sun, temp, etc
    let node = this.root;
    let cursor = new Phaser.Math.Vector2(this.seed);
    const points: Phaser.Math.Vector2[] = [cursor];
    debug("growth", gp);
    debug("curve", points);

    while (gp > 0 && node != null) {
      const currentNodePoint = cursor.clone().add(node.inScreenSpace());
      const growthParams = this.getGrowthParams(currentNodePoint);
      debug("growth", growthParams);
      gp = node.grow(growthParams, gp);

      // Node x and y are relative to parent node - translate into screen space for curve
      const newNodePoint = cursor.clone().add(node.inScreenSpace());
      const midpoint = cursor.clone().lerp(newNodePoint, 0.5);
      points.push(midpoint, newNodePoint);
      cursor = newNodePoint;

      if (node.leaves.length > 0) {
        for (let i = 0; i < node.leaves.length; i++) {
          // TODO this probably only works for 2 leaves - 4 leaves form like >< not \||/
          const range = 160;
          const angle = -range + (i * ((range - 180 + range) / (node.leaves.length - 1)));
          debug("leaf", `Leaf ${i} ${angle}deg`);
          rotateVector(node.direction, angle);
          const polygon = geometric.polygonRotate(node.leaves[i]._points, angle, [0, 0])

          fillPolygon(this.gfx, cursor, polygon);
        }
      }

      debug("growth", gp);
      debug("curve", points);
      node = node.next;
    }

    this.gfx.moveTo(this.root.x, this.root.y);
    this.gfx.lineStyle(2, chroma("green").num(), 0.8);
    const curve = new Phaser.Curves.Spline(points);
    curve.draw(this.gfx, 64);
  }

  getGrowthParams = (atPoint: Phaser.Math.Vector2): GrowthParams => {
    // Grow towards the light
    // TODO day/night cycle, use cursor for now
    const lightPoint = new Phaser.Math.Vector2(this.scene.input);
    const lightPointPlant = new Phaser.Math.Vector2(this.seed)
      .subtract(new Phaser.Math.Vector2(lightPoint))
      .multiply(new Phaser.Math.Vector2(-1, 1));

    return {
      lightPoint: lightPointPlant,
      soilDistance: this.soilY - atPoint.y,
    };
  }
}

const fillPolygon = (gfx: Phaser.GameObjects.Graphics, origin: Phaser.Types.Math.Vector2Like, poly: geometric.Polygon) => {
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

const rotateVector = (vector: Phaser.Types.Math.Vector2Like, angle: number) => {
  const theta = Phaser.Math.DegToRad(angle);

  const { x, y } = vector;
  const cs = Math.cos(theta);
  const sn = Math.sin(theta);
  return new Phaser.Math.Vector2(x * cs - y * sn, x * sn + y * cs);
}