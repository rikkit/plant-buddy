
import scene from "./scene";

export default () => {

  const config = {
    type: Phaser.AUTO,
    parent: "phaser",
    width: 800,
    height: 600,
    scene: scene
  };

  const game = new Phaser.Game(config);
}