import {Sprite} from './Scene';
export class Rewinder implements Sprite {
  private delayCount = 0;
  private playbackCount = 0;
  constructor(
      private readonly positions: Point[],
      private readonly delay: number = 50) {}

  readonly z = 0;
  get decay(): boolean {
    return this.playbackCount >= this.positions.length;
  }

  generate(): Sprite[] {
    return [];
  }

  draw(context: CanvasRenderingContext2D) {}
}