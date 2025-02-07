import {
  BALL_COLOR,
  BALL_RADIUS,
  GRAVITY,
  HORIZONTAL_FRICTION,
  OBSTACLE_RADIUS,
  SINK_GAP,
  VERTICAL_FRICTION,
} from "./utils/constants";

export class Ball {
  private startX?: number;
  private x: number;
  private y: number;
  private vx: number;
  private vy: number;
  private obstacles: { x: number; y: number }[];
  private sinks: { x: number; y: number }[];
  private canvasContext: CanvasRenderingContext2D;
  onFinish: (index: number, startX: number) => void;

  constructor(
    x: number,
    y: number,
    obstacles: { x: number; y: number }[],
    sinks: { x: number; y: number }[],
    canvasContext: CanvasRenderingContext2D,
    onFinish: (index: number, startX: number) => void
  ) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.obstacles = obstacles;
    this.sinks = sinks;
    this.canvasContext = canvasContext;
    this.startX = x;
    this.onFinish = onFinish;
  }

  drawBall() {
    this.canvasContext.beginPath();
    this.canvasContext.arc(this.x, this.y, BALL_RADIUS, 0, 2 * Math.PI);
    this.canvasContext.fillStyle = BALL_COLOR;
    this.canvasContext.fill();
    this.canvasContext.closePath();
  }

  updateBall() {
    this.vy = this.vy + GRAVITY;
    this.x = this.x + this.vx;
    this.y = this.y + this.vy;

    this.obstacles.forEach((obstacle) => {
      const distance = Math.sqrt(
        (this.x - obstacle.x) ** 2 + (this.y - obstacle.y) ** 2
      );
      if (distance < BALL_RADIUS + OBSTACLE_RADIUS) {
        const angle = Math.atan2(this.y - obstacle.y, this.x - obstacle.x);
        const speed = Math.sqrt(this.vx ** 2 + this.vy ** 2);
        this.vx = Math.cos(angle) * HORIZONTAL_FRICTION * speed;
        this.vy = Math.sin(angle) * VERTICAL_FRICTION * speed;

        const overlap = BALL_RADIUS + OBSTACLE_RADIUS - distance;
        this.x = this.x + Math.cos(angle) * overlap;
        this.y = this.y + Math.sin(angle) * overlap;
      }
    });

    this.sinks.forEach((sink, index) => {
      if (
        this.x > sink.x - SINK_GAP / 2 &&
        this.x < sink.x + SINK_GAP / 2 &&
        this.y > sink.y
      ) {
        this.vx = 0;
        this.vy = 0;
        this.onFinish(index, this.startX as number);
      }
    });
  }
}
