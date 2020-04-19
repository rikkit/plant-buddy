import React, { useState, useEffect, useCallback } from "react";
import initGame from "../game/init";
import { SceneName, Data_Tick, Data_TickMs, GameSpeed } from "../game/scene";
import "./GameWrapper.scss";
import { throwIfDefined } from "./utils";
import { SpeedButton } from "./SpeedButton";

interface GameWrapperProps {
  exitGame: () => void;
}

export const GameWrapper = ({ exitGame }: GameWrapperProps) => {
  const [game, setGame] = useState<Phaser.Game>();
  const [time, setTime] = useState(0);
  const [gameSpeed, setGameSpeedUI] = useState<GameSpeed>()
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
      const scene = game.scene.getScene(SceneName);
      const [currentTick, speed] = scene.data.get([Data_Tick, Data_TickMs]);

      setTime(currentTick ?? 0);
      setGameSpeedUI(speed);
      setIsPaused(scene.time.paused);
    }, 100);
    return () => clearInterval(handle);
  }, [game]);

  const setGameSpeed = useCallback((newSpeed: GameSpeed) => {
    const scene = game.scene.getScene(SceneName);
    scene.data.set(Data_TickMs, newSpeed);
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
      <div className="pal-game__speed">
        <button onClick={exitGame}>🔙</button>
        {isPaused
          ? <button onClick={playGame}>▶️</button>
          : <button onClick={pauseGame}>⏸️</button>
        }
        <SpeedButton speed={gameSpeed} setSpeed={setGameSpeed} />
      </div>

      <div id="phaser"></div>
    </div>
  )
};