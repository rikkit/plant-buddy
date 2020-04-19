import React, { useState, useEffect, useCallback } from "react";
import initGame from "./game/init";
import { SceneName } from "./game/scene";
import "./GameManager.scss";

/**
 * React manager for <canvas> element with Phaser
 */
export const GameManager: React.FC = () => {
  const [time, setTime] = useState(0);
  const [game, setGame] = useState<Phaser.Game>();
  const [gameInstanceCount, setGameInstanceCount] = useState(0);

  const resetGame = useCallback(() => {
    if (game != null) {
      game.destroy(true, false);
    }

    const newGame = initGame();
    setGame(newGame);
    setGameInstanceCount(gameInstanceCount + 1);
  }, []);
  const pauseGame = useCallback(() => game.scene.pause(SceneName), [game]);
  const playGame = useCallback(() => game.scene.run(SceneName), [game]);

  useEffect(resetGame, []);

  useEffect(() => {
    const handle = setInterval(() => setTime(game?.getTime() ?? 0), 100);
    return () => clearInterval(handle);
  }, [game]);

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
    <div className="pal-man">
      <div className="pal-man__time">
        {time}
      </div>
      <div className="pal-man__speed">
        <button onClick={resetGame}>🔄</button>
        <button onClick={pauseGame}>⏸️</button>
        <button onClick={playGame}>▶️</button>
        <button>⏩</button>
      </div>

      <div id="phaser" key={gameInstanceCount}></div>
    </div>
  );
}