
import scene from "./scene";

export default () => {

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: "phaser",
    width: 300,
    height: 400,
    scene: scene,


    scale: {
      mode: Phaser.Scale.ScaleModes.FIT,
    },
  };

  return new Phaser.Game(config);
}