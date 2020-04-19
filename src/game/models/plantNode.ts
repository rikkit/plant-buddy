import { LeafModel } from "./leafModel";

export class PlantNode {
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

  get direction() {
    return this._next
      ? new Phaser.Math.Vector2(this).add(new Phaser.Math.Vector2(this._next)).normalize()
      : new Phaser.Math.Vector2(this.parent).add(new Phaser.Math.Vector2(this)).normalize();
  }

  private constructor(
    private species: PlantInfo,
    private _x: number,
    private _y: number,
    public leaves: LeafModel[] = [],
  ) { }

  static New = (info: PlantInfo, x: number, y: number) => {
    return new PlantNode(info, x, y);
  }

  asVector2() {
    return new Phaser.Math.Vector2(this);
  }

  addNode(x: number, y: number) {
    const next = PlantNode.New(this.species, x, y);
    next._parent = this;
    this._next = next;
    return next;
  }

  addLeaf() {
    this.leaves.push(new LeafModel(this.species));
  }

  /**
   * 
   * @param growthPoints 
   */
  grow(lightPoint: Phaser.Math.Vector2, points: number): number {
    const isTip = this._next == null;
    if (isTip) {
      const length = Phaser.Math.Distance.BetweenPoints(this._parent, this);
      const maxLength = this.species.growthFactor * 100;
      if (length < maxLength) {
        // Plant axis Y is up!
        const add = new Phaser.Math.Vector2(this)
          .add(lightPoint)
          .normalize()
          .scale(10 * this.species.growthFactor);
        this._x += add.x;
        this._y += add.y;
        console.log(add);

        points -= 1 - this.species.growthFactor;
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