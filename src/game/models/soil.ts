
import chroma from "chroma-js";

export class SoilModel {
  loam: Phaser.GameObjects.Rectangle;

  constructor(private scene: Phaser.Scene) {
    const height = scene.game.scale.height / 3;
    const width = scene.game.scale.width;

    this.loam = scene.add.rectangle(
      width / 2,
      scene.game.scale.height - height / 2,
      width,
      height,
      chroma("sandybrown").darken(3).num()
    );
  }
}



