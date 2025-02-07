export const CANVAS_HEIGHT = 800;
export const CANVAS_WIDTH = 800;
export const BALL_RADIUS = 7;
export const OBSTACLE_RADIUS = 5;
export const HORIZONTAL_FRICTION = 0.6;
export const VERTICAL_FRICTION = 0.4;
export const BALL_COLOR = "red";
export const OBSTACLE_COLOR = "white";
export const NUM_OF_ROWS = 16;
export const NUM_OF_SINKS = 15;
export const OBSTABLE_GAP = 36;
export const SINK_GAP = 36;
export const GRAVITY = 0.2;

export function getColor(index: number) {
  if (index < 2 || index > NUM_OF_SINKS - 3) {
    return { background: "#ff003f" };
  }
  if (index < 4 || index > NUM_OF_SINKS - 5) {
    return { background: "#ff7f00" };
  }
  if (index < 6 || index > NUM_OF_SINKS - 7) {
    return { background: "#ffbf00" };
  }
  if (index < 7 || index > NUM_OF_SINKS - 8) {
    return { background: "#ffff00" };
  }
  if (index < 10 || index > NUM_OF_SINKS - 10) {
    return { background: "#bfff00" };
  }
  return { background: "#7fff00" };
}

export const MULTIPLIERS: { [key: number]: number } = {
  1: 16,
  2: 9,
  3: 2,
  4: 1.4,
  5: 1.2,
  6: 1.1,
  7: 1,
  8: 0.5,
  9: 1,
  10: 1.1,
  11: 1.2,
  12: 1.4,
  13: 2,
  14: 9,
  15: 16,
};
