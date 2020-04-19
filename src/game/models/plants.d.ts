

interface PlantInfo {
  /**
   * Inherent growthiness of this plant, 0 - 1
   */
  growthFactor: number;

  /**
   * Planting depth of the seed
   */
  seedDepth: number;
}

interface GrowthParams {
  lightPoint: Phaser.Math.Vector2;
  soilDistance: number;
}
