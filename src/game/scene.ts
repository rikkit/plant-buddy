import Phaser, { Data } from "phaser";
import { SoilModel } from "./models/soil";
import { PlantModel } from "./models/plantModel";

export const SceneName = "Game";
export const Data_Tick = "_tick";
export const Data_TickMs = "_tickMs";
export const enum GameSpeed {
  Normal = 1000,
  Speedy = 500,
  Speedier = 300,
  Speediest = 150,
  Speedierest = 75,
}

export default class extends Phaser.Scene {
  loam: SoilModel;
  plant: PlantModel;
  currentTickMs = GameSpeed.Normal;

  constructor() {
    super(SceneName);
  }

  preload() {
  }

  create() {
    this.loam = new SoilModel(this);
    this.plant = new PlantModel(this, this.game.scale.width / 2, 2 * (this.game.scale.height / 3));

    this.data.set(Data_Tick, 0);
    this.data.set(Data_TickMs, GameSpeed.Normal);

    this.time.addEvent({
      delay: this.data.get(Data_TickMs),
      loop: true,
      callback: () => this.tickCallback(),
    });
  }

  update(time: number, delta: number) {
    this.plant.update(this.data.get(Data_Tick));
  }

  private tickCallback() {
    const setTime = this.data.get(Data_TickMs);
    if (this.currentTickMs != setTime) {
      this.time.removeAllEvents();
      this.time.addEvent({
        delay: setTime,
        loop: true,
        callback: () => this.tickCallback()
      })
    };

    const nextTick = this.data.get(Data_Tick) + 1;
    this.data.set(Data_Tick, nextTick);
    console.debug(`Tick ${nextTick} (${setTime})`);
  }
};
