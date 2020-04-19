
import chroma from "chroma-js";
import * as geometric from "geometric";
import { PlantNode } from "./plantNode";

export class PlantModel {
  currentTick: number = 0;
  gfx: Phaser.GameObjects.Graphics;
  seed: Phaser.GameObjects.Sprite;
  root: PlantNode;

  constructor(private scene: Phaser.Scene, x: number, y: number) {
    this.gfx = scene.add.graphics();

    const seedX = x;
    const seedY = y + 30;
    this.gfx.fillStyle(chroma("yellow").num());
    this.gfx.fillRect(0, 0, 10, 20);
    this.gfx.generateTexture("seed", 10, 20);
    this.gfx.clear();
    this.seed = scene.add.sprite(seedX, seedY, "seed");

    const sunflower: PlantInfo = {
      growthFactor: 0.5,
    };

    const root = PlantNode.New(sunflower, 0, 0);
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

    // Grow towards the light
    // TODO day/night cycle, use cursor for now
    const lightPoint = new Phaser.Math.Vector2(this.scene.input);
    const lightPointPlant = new Phaser.Math.Vector2(this.seed)
      .subtract(new Phaser.Math.Vector2(lightPoint))
      .multiply(new Phaser.Math.Vector2(-1, 1));

    // Traverse the tree, growing on the way
    const curve = new Phaser.Curves.Spline();

    this.gfx.clear();

    let points = 10; // TODO get from scene, moisture, sun, temp, etc
    let node = this.root;
    let nodeX = this.seed.x;
    let nodeY = this.seed.y;
    do {
      console.debug(`Growth ${points}`);

      points = node.grow(lightPointPlant, points);

      // Node x and y are relative to parent node - translate into screen space for curve
      nodeX += node.x;
      nodeY -= node.y; // Plant-growth axis is flipped!
      curve.addPoint(nodeX, nodeY);

      if (node.leaves.length > 0) {
        for (let i = 0; i < node.leaves.length; i++) {
          // TODO this probably only works for 2 leaves - 4 leaves form like >< not \||/
          const range = 160;
          const angle = -range + (i * ((range - 180 + range) / (node.leaves.length - 1)));
          console.debug(`Leaf ${i} ${angle}deg`);
          rotateVector(node.direction, angle); 
          const polygon = geometric.polygonRotate(node.leaves[i]._points, angle, [0, 0])

          fillPolygon(this.gfx, { x: nodeX, y: nodeY }, polygon);
        }
      }

      node = node.next;
    } while (points > 0 && node != null)


    this.gfx.moveTo(this.root.x, this.root.y);
    this.gfx.lineStyle(2, chroma("green").num(), 0.8);
    curve.draw(this.gfx, 64);
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