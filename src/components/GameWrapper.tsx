import React, { useState, useEffect, useCallback } from "react";
import initGame from "../game/init";
import { SceneName } from "../game/scene";
import "./GameWrapper.scss";

interface GameWrapperProps {
  exitGame: () => void;
}

export const GameWrapper = ({ exitGame }: GameWrapperProps) => {
  const [game, setGame] = useState<Phaser.Game>();
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const pauseGame = useCallback(() => game.scene.pause(SceneName), [game]);
  const playGame = useCallback(() => game.scene.run(SceneName), [game]);

  // Start game when this is mounted
  useEffect(() => {
    const newGame = initGame();
    setGame(newGame);
    // Cleanup when unmounted
    return () => newGame.destroy(true, false);
  }, []);

  // Sync React UI with game state
  useEffect(() => {
    const handle = setInterval(() => {
      setTime(game?.getTime() ?? 0);

      const isScenePaused = game.scene.isPaused(SceneName);
      setIsPaused(isScenePaused);
    }, 100);
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
    <div className="pal-game">
      <div className="pal-game__time noclip">
        {time}
      </div>
      <div className="pal-game__speed noclip">
        <button onClick={exitGame}>🔙</button>
        {isPaused
          ? <button onClick={playGame}>▶️</button>
          : <button onClick={pauseGame}>⏸️</button>
        }
        <button>⏩</button>
      </div>

      <div id="phaser"></div>
    </div>
  )
};
