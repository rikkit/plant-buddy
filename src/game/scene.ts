import Phaser from "phaser";

export default class extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }

  preload() {
  }

  create() {

    var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xaa0000 }, fillStyle: { color: 0x0000aa } });


    var rect = new Phaser.Geom.Rectangle();

    var square = new Phaser.Geom.Rectangle();

    this.input.on('pointermove', function (pointer: Phaser.Input.Pointer) {
      graphics.clear();

      rect.width = pointer.x;
      rect.height = pointer.y;

      var area = Phaser.Geom.Rectangle.Area(rect);

      square.width = square.height = Math.sqrt(area);

      graphics.fillRectShape(square);

      graphics.strokeRectShape(rect);
    });
  }
};
