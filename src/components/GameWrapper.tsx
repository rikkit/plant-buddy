import React, { useState, useEffect, useCallback } from "react";
import initGame from "../game/init";
import { SceneName, Data_Tick, Data_TickMs, GameSpeed } from "../game/scene";
import { SpeedButton } from "./SpeedButton";
import { GameTime } from "./GameTime";
import "./GameWrapper.scss";

interface GameWrapperProps {
  exitGame: () => void;
}

export const GameWrapper = ({ exitGame }: GameWrapperProps) => {
  const [game, setGame] = useState<Phaser.Game>();
  const [tick, setTick] = useState(0);
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

      setTick(currentTick ?? 0);
      setGameSpeedUI(speed);
      setIsPaused(game.scene.isPaused(SceneName)); // N.B. When pausing scene.time.paused isn't updated
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
      <GameTime tick={tick} />
      <div className="pal-game__speed">
        <button className="game-button" onClick={exitGame}>🔙</button>
        {isPaused
          ? <button className="game-button" onClick={playGame}>▶️</button>
          : <button className="game-button" onClick={pauseGame}>⏸️</button>
        }
        <SpeedButton speed={gameSpeed} setSpeed={setGameSpeed} />
      </div>

      <div id="phaser"></div>
    </div>
  )
};