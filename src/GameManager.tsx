import React, { useState, useEffect, useCallback } from "react";
import initGame from "./game/init";

/**
 * React manager for <canvas> element with Phaser
 */
export const GameManager: React.FC = () => {
  const [time, setTime] = useState(new Date());

  const initPhaser = useCallback(initGame, []);

  useEffect(() => {
    setInterval(() => setTime(new Date()), 1000);
  }, []);

  useEffect(() => {
    initPhaser();
  }, []);

  return (
    <div>
      {time.toLocaleString()}
    </div>
  );
}