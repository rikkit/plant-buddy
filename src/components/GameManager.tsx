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
          <button onClick={() => setInGame(true)}>Start</button>
        </div>
      )}

      {inGame && (
        <GameWrapper exitGame={() => setInGame(false)} />
      )}
    </div>
  );
}
