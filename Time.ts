import {Sprite} from './Scene'

export class TimeSlider implements Sprite {
  current: number = 0;
  constructor(
      private readonly timelimit: number) {}

  reset() {
    this.current = 0;
  }

  get z(): number {
    return 0;
  }

  readonly decay = false;

  draw(context: CanvasRenderingContext2D) {
    this.current += 1;
    var rate: number = this.current / this.timelimit;
    rate = Math.min(rate, 1);

  }
}