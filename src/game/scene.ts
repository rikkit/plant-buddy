import Phaser from "phaser";
import { SoilModel } from "./models/soil";
import { PlantModel } from "./models/plant";

const Vector2 = Phaser.Math.Vector2;

export default class extends Phaser.Scene {
  loam: SoilModel;
  plant: PlantModel;
  tick: number = 0;

  constructor() {
    super("PlayGame");
  }

  preload() {
  }

  create() {
    this.loam = new SoilModel(this);
    this.plant = new PlantModel(this, this.game.scale.width / 2, 2 * (this.game.scale.height / 3));

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
