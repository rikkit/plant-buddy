import React, { useState, useEffect } from "react";

export const Game: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setInterval(() => setTime(new Date()), 1000);
    console.log("yo");
  }, [])

  console.log("yolo")
  return (
    <div>
      The time is {time.toISOString()}
    </div>
  );
}