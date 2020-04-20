import { LeafModel } from "./leafModel";
import { debug } from "./debug";

let instanceId: number = 1;

export class PlantNode {
  private readonly id = instanceId++;
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

  // Plant-growth axis is flipped!
  inScreenSpace() {
    return new Phaser.Math.Vector2(this._x, -this.y);
  }

  addNode = (x: number, y: number) => {
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
  grow(params: GrowthParams, points: number): number {
    const { lightPoint, soilDistance } = params;
    debug("nodes", `${this.id} (next: ${this.next?.id})`);
    debug("nodes", this.asVector2());

    const isTip = this.next == null;
    debug("nodes", `is tip ${isTip}`);
    if (isTip) {
      // If below soil level, grow up
      if (soilDistance < -1) {
        const growth = 5 * this.species.growthFactor; // Slower growth beneath ground
        this._y += growth;

        points -= 3 * (1 / this.species.growthFactor);
        debug("growth", "grew underground");
      }
      else {
        const length = Phaser.Math.Distance.BetweenPoints(this._parent, this);
        const maxLength = this.species.growthFactor * 75;
        if (length < maxLength) {
          // Plant axis Y is up!
          const add = new Phaser.Math.Vector2(this)
            .add(lightPoint)
            .normalize()
            .scale(10 * this.species.growthFactor);
          this._x += add.x;
          this._y += add.y;

          points -= 1 / this.species.growthFactor;
          debug("growth", "grew tip");
        }
        else {
          // Enough growth here - make a new segment
          const next = this.addNode(0, 1);
          next.addLeaf();
          next.addLeaf();
          points -= 2 * (1 / this.species.growthFactor);
          debug("growth", "grew new segment");
        }
      }
    }
    else {
      this._y += 0.02;
      points -= ((1 / this.species.growthFactor) / 10);
      debug("growth", "grew (non-tip)");
    }

    for (const leaf of this.leaves) {
      points = leaf.grow(points);
    }

    debug("nodes", this.asVector2());
    return points;
  }
}