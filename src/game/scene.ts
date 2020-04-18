import Phaser from "phaser";

export default class extends Phaser.Scene {
  loam: Phaser.GameObjects.Rectangle;  

  constructor() {
    super("PlayGame");
  }

  preload() {
  }

  create() {
    const height = this.game.scale.height / 3;
    const width = this.game.scale.width;
    this.loam = this.add.rectangle(width/2, this.game.scale.height - height / 2, width, height, 0xffffff);
  }

  update() {
    this.loam.fillColor = this.loam.fillColor + 0x1;
  }
};
