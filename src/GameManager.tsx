import React, { useState, useEffect, useCallback } from "react";
import Phaser from "phaser";
import scene from "./game/scene";

/**
 * React manager for <canvas> element with Phaser
 */
export const GameManager: React.FC = () => {
  const [time, setTime] = useState(new Date());

  const initPhaser = useCallback(() => {

    const config = {
      type: Phaser.AUTO,
      parent: "phaser",
      width: 800,
      height: 600,
      scene: scene
    };

    const game = new Phaser.Game(config);
  }, []);

  useEffect(() => {
    setInterval(() => setTime(new Date()), 1000);
    console.log("yo");
  }, []);

  console.log("wololo")
  return (
    <div>
      {time.toLocaleString()}

    </div>
  );
}