import React from "react";
import { startOfYear, addDays, differenceInDays, format, addHours } from "date-fns";
import "./GameTime.scss";

interface GameTimeProps {
  tick: number;
}

// N.B doesn't matter when - just used for calculations with date-fns
// Start at 6am
const baseDate = startOfYear(new Date()).setHours(6);

export const GameTime = ({ tick }: GameTimeProps) => {

  // 6 ticks to 1 day
  const gameDate = addHours(baseDate, (tick / 12) * 24);
  const dayNumber = differenceInDays(gameDate, baseDate) + 1;

  return (
    <div className="pal-time noclip" title={`Tick ${tick}`}>
      <div className="pal-time__day">Day {dayNumber}</div>
      <div className="pal-time__time">{format(gameDate, "h aaaa")}</div>
    </div>
  );
}