import {Sprite} from './Scene'
import {Point} from './xyTuple'

export class Obstacle implements Sprite {
  constructor(readonly radius: number, readonly position: Point) {}

  get z(): number {
    return this.position.y;
  }

  readonly decay: boolean = false;

  generate(): Sprite[] {
    return [];
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.fillStyle = 'black';
    context.beginPath();
    context.ellipse(
        this.position.x, this.position.y, this.radius, this.radius, 0, 0, 360);
    context.fill();
    context.restore();
  }
}