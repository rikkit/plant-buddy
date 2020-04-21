import React, { useCallback } from "react";
import { GameSpeed } from "../game/scene";
import { throwIfDefined } from "./utils";
import "./SpeedButton.scss";

interface SpeedButtonProps {
  speed: GameSpeed;
  setSpeed: (speed: GameSpeed) => void;
}

export const SpeedButton = ({ speed, setSpeed }: SpeedButtonProps) => {
  let label: string;
  let nextSpeed: GameSpeed;
  switch (speed) {
    case GameSpeed.Speedy:
      label = "2";
      nextSpeed = GameSpeed.Speedier;
      break;
    case GameSpeed.Speedier:
      label = "3";
      nextSpeed = GameSpeed.Speediest;
      break;
    case GameSpeed.Speediest:
      label = "4";
      nextSpeed = GameSpeed.Speedierest;
      break;
    case GameSpeed.Speedierest:
      label = "5";
      nextSpeed = GameSpeed.Normal;
      break;
    case GameSpeed.Normal:
    default:
      label = "1";
      nextSpeed = GameSpeed.Speedy;
      break;
  }

  const onClick = useCallback(() => setSpeed(nextSpeed), [speed]);

  return (
    <button className="speed-button game-button" onClick={onClick}>
      ⏩<span className="speed-button__label">{label}</span>
    </button>
  )
}
