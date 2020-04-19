
export const throwIfDefined = (val: never) => {
  throw new Error(`Unknown value ${val}!`);
};
