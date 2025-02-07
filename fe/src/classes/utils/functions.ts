import {
  CANVAS_WIDTH,
  NUM_OF_ROWS,
  NUM_OF_SINKS,
  OBSTABLE_GAP,
  SINK_GAP,
} from "./constants";

export function obstaclesArray() {
  const obstacleArray: { x: number; y: number }[] = [];
  for (let row = 2; row < NUM_OF_ROWS; row++) {
    const obstacle = row + 1;
    const y = OBSTABLE_GAP * (row - 1);
    for (let col = 0; col < obstacle; col++) {
      const x = CANVAS_WIDTH / 2 - (row / 2 - col) * OBSTABLE_GAP;
      obstacleArray.push({ x, y });
    }
  }
  return obstacleArray;
}

export function sinksArray() {
  const sinkArray: { x: number; y: number }[] = [];
  const y = CANVAS_WIDTH - 270;
  for (let i = 0; i < NUM_OF_SINKS; i++) {
    const x = CANVAS_WIDTH / 2 - (NUM_OF_SINKS / 2 - i) * SINK_GAP;
    sinkArray.push({ x, y });
  }
  return sinkArray;
}
