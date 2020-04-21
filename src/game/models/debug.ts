
export type DebugType = "growth" | "nodes" | "leaf" | "curve" | "tick";

const activeTypes: DebugType[] = [
  "tick",
  "growth",
  // "nodes",
  // "curve",
];

export const debug = (type: DebugType, msg: unknown) => {
  if (!activeTypes.some(x => x == type)) {
    return;
  }
  
  if (typeof msg === "object") {
    console.debug(`${type}    | ${JSON.stringify(msg)}`);
  }
  else {
    console.debug(`${type}    | ${msg}`);
  }  
};
