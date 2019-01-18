import {Sprite} from './Scene'
import {Point} from './xyTuple'

export class Obstacle implements Sprite {
  constructor(
      private readonly radious: number, private readonly position: Point) {}

  get z(): number {
    return this.position.y;
  }

  readonly decay: boolean = false;

  generate(): Sprite[] {
    return [];
  }

  draw(context: CanvasRenderingContext2D) {}
}