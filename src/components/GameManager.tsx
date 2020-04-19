import React, { useState} from "react";
import { GameWrapper } from "./GameWrapper";
import "./GameManager.scss";

/**
 * React manager for <canvas> element with Phaser
 */
export const GameManager: React.FC = () => {
  const [inGame, setInGame] = useState(false);

  return (
    <div className="pal-man">
      {!inGame && (
        <div className="pal-man__menu">
          <h1>Plant Pal!</h1>
          <p>#LudumDare46 - Keep it Alive</p>
          <button className="game-button pal-man__start" onClick={() => setInGame(true)}>
            Start game
          </button>
        </div>
      )}

      {inGame && (
        <GameWrapper exitGame={() => setInGame(false)} />
      )}
    </div>
  );
}
