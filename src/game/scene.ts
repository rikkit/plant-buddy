import Phaser from "phaser";
import chroma from "chroma-js";

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
    this.add.existing(this.plant);

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


class PlantModel extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {

    var graphics = scene.add.graphics();
    graphics.fillStyle(chroma("yellow").num());
    graphics.fillRect(0, 0, 10, 20);
    graphics.generateTexture("test", 10, 20);
    graphics.destroy();

    super(scene, x, y, "test");
  }

  update(tick: number) {
    const growthFactor = 10;

    this.scale = 1 + (tick * (1 / growthFactor));
  }
}