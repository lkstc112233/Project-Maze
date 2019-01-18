import {Sprite} from './Scene';
import {Point} from './xyTuple';

const PATH_WIDTH: number = 5;

class Dotter implements Sprite {
  constructor(private readonly position: Point) {}
  get z(): number {
    return this.position.y;
  }
  readonly decay: boolean = false;
  draw(context: CanvasRenderingContext2D) {
    context.save();

    context.beginPath();
    context.fillStyle = 'red';
    context.ellipse(
        this.position.x, this.position.y, PATH_WIDTH, PATH_WIDTH, 0, 0, 360);
    context.fill();

    context.restore();
  }
}

export class Rewinder implements Sprite {
  private delayCount = 0;
  private playbackCount = 0;
  constructor(
      private readonly positions: Point[],
      private readonly delay: number = 50) {}

  readonly z = 0;
  get decay(): boolean {
    return this.completed;
  }

  get completed(): boolean {
    return this.playbackCount >= this.positions.length;
  }

  generate(): Sprite[] {
    if (this.delayCount++ > this.delay) {
      if (this.playbackCount < this.positions.length) {
        return [new Dotter(this.positions[this.playbackCount++])];
      }
    }
    return [];
  }

  draw(context: CanvasRenderingContext2D) {}
}