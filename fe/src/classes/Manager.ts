import { Ball } from "./Ball";
import {
  BALL_RADIUS,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  getColor,
  MULTIPLIERS,
  OBSTABLE_GAP,
  OBSTACLE_COLOR,
  OBSTACLE_RADIUS,
  SINK_GAP,
} from "./utils/constants";
import { obstaclesArray, sinksArray } from "./utils/functions";

export class Manager {
  private obstacles: { x: number; y: number }[];
  private sinks: { x: number; y: number }[];
  private canvasRef: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D;
  private balls: Ball[];
  onFinish: (index: number, startX: number) => void;

  constructor(
    canvasRef: HTMLCanvasElement,
    onFinish: (sinkIndex: number, startX: number) => void
  ) {
    this.balls = [];
    this.canvasRef = canvasRef;
    this.canvasContext = this.canvasRef.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    this.obstacles = obstaclesArray();
    this.sinks = sinksArray();
    this.onFinish = onFinish;
    this.update();
  }
  drawObstacles() {
    this.obstacles.forEach((obstacle) => {
      this.canvasContext.beginPath();
      this.canvasContext.arc(
        obstacle.x,
        obstacle.y,
        OBSTACLE_RADIUS,
        0,
        2 * Math.PI
      );
      this.canvasContext.fillStyle = OBSTACLE_COLOR;
      this.canvasContext.fill();
      this.canvasContext.closePath();
    });
  }
  drawSinks() {
    this.sinks.forEach((sink, index) => {
      this.canvasContext.beginPath();
      this.canvasContext.rect(sink.x, sink.y, OBSTABLE_GAP - BALL_RADIUS, 30);
      this.canvasContext.fillStyle = getColor(index).background; // Set background color
      this.canvasContext.fill();
      this.canvasContext.closePath();

      this.canvasContext.beginPath();
      this.canvasContext.fillStyle = "black"; // Set text color to black
      this.canvasContext.font = "bold 11px Arial";
      this.canvasContext.fillText(
        `${MULTIPLIERS[index + 1]}x`,
        sink.x - 12 + SINK_GAP / 2,
        sink.y + 18
      );
      this.canvasContext.closePath();
    });
  }
  draw() {
    this.canvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.drawObstacles();
    this.drawSinks();
    this.balls.forEach((ball) => {
      ball.drawBall();
      ball.updateBall();
    });
  }
  update() {
    this.draw();
    requestAnimationFrame(this.update.bind(this));
  }
  addBall(startX?: number) {
    const newBall = new Ball(
      startX || 440,
      10,
      this.obstacles,
      this.sinks,
      this.canvasContext,
      (index: number, startX: number) => {
        this.balls = this.balls.filter((ball) => ball !== newBall);
        this.onFinish(index, startX);
      }
    );
    this.balls.push(newBall);
  }
  stop() {
    this.balls = [];
  }
}
