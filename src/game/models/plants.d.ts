

interface PlantInfo {

  /**
   * Inherent growthiness of the plant 0 -1
   */
  growth: number;

  /**
   * Density of nodes 0 - 1
   */
  nodeDensity: number;

  /**
   * Growth factor for leaves 0 - 1
   */
  leafGrowth: number;

  /**
   * Planting depth of the seed
   */
  seedDepth: number;
}

interface GrowthParams {
  lightPoint: Phaser.Math.Vector2;
  soilDistance: number;
}
