
import chroma from "chroma-js";
import * as geometric from "geometric";
import { LeafModel } from "./leaf";


interface PlantInfo {
  /**
   * Inherent growthiness of this plant, 0 - 1
   */
  growthFactor: number;
}


class PlantNode {
  private _parent: PlantNode;
  private _next: PlantNode;

  get parent() {
    return this._parent;
  }

  get next() {
    return this._next;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  private constructor(
    private info: PlantInfo,
    private _x: number,
    private _y: number,
    private leaves: LeafModel[] = [],
  ) { }

  static New = (info: PlantInfo, x: number, y: number) => {
    return new PlantNode(info, x, y);
  }

  addNode(x: number, y: number) {
    const next = PlantNode.New(this.info, x, y);
    next._parent = this;
    this._next = next;
    return next;
  }

  addLeaf() {
    this.leaves.push(new LeafModel());
  }

  /**
   * 
   * @param growthPoints 
   */
  grow(points: number): number {
    const isTip = this._next == null;
    if (isTip) {
      const length = Phaser.Math.Distance.BetweenPoints(this._parent, this);
      if (length < 50) {
        // Plant axis Y is up!
        // TODO grow towards the light
        this._y += (10 * Math.min(Math.max(this.info.growthFactor, 0), 1));
        points -= 1 - this.info.growthFactor;
      }
      else {
        // Enough growth here - make a new segment
        const next = this.addNode(0, 1);
        next.addLeaf();
        next.addLeaf();
      }
    }

    for (const leaf of this.leaves) {
      points = leaf.grow(points);
    }

    return points;
  }
}


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

    this.gfx.clear();

    // Traverse the tree, growing on the way
    const curve = new Phaser.Curves.Spline();

    let points = 10; // TODO get from scene, moisture, sun, temp, etc
    let node = this.root;
    let nodeX = this.seed.x;
    let nodeY = this.seed.y;
    do {
      console.debug(`Growth ${points}`);
      points = node.grow(points);

      // Node x and y are relative to parent node - translate into screen space for curve
      nodeX += node.x;
      nodeY -= node.y; // Plant-growth axis is flipped!
      curve.addPoint(nodeX, nodeY);

      node = node.next;
    } while (points > 0 && node != null)


    this.gfx.clear();
    this.gfx.moveTo(this.root.x, this.root.y);
    this.gfx.lineStyle(2, chroma("green").num(), 0.8);
    curve.draw(this.gfx, 64);

    // for (const leaf of this.leaves) {
    //   leaf.update(tick);
    //   this.points = geometric.polygonScale(this.points, 2, [0, 0]);

    //   const leafOrigin = this.stalk.points[this.originPointIndex];
    //   fillPolygon(this.gfx, leafOrigin, this.points);
    // }
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