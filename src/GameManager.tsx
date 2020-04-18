import React, { useState, useEffect, useCallback } from "react";
import initGame from "./game/init";

/**
 * React manager for <canvas> element with Phaser
 */
export const GameManager: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [game, setGame] = useState<Phaser.Game>();

  const initPhaser = useCallback(initGame, []);

  useEffect(() => {
    setInterval(() => setTime(new Date()), 1000);
  }, []);

  useEffect(() => {
    const game = initPhaser();
    setGame(game);
  }, []);

  useEffect(() => {
    if (!game) {
      return;
    }

    const refreshGameScale = () => {
      game.scale.refresh()
    };

    window.addEventListener('resize', refreshGameScale);
    return () => window.removeEventListener("resize", refreshGameScale);
  }, [game])

  return (
    <div>
      {time.toLocaleString()}
    </div>
  );
}