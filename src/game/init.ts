
import scene from "./scene";

export default () => {

  const aspect = 3/4;
  const height = window.innerHeight * window.devicePixelRatio;

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: "phaser",
    width: height * aspect,
    height: height,
    scene: scene,

    scale: {
      mode: Phaser.Scale.ScaleModes.FIT,
    },
  };

  return new Phaser.Game(config);
}