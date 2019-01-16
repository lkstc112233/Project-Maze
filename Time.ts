import {Sprite} from './Scene'

export class TimeSlider implements Sprite {
  get z(): number {
    return 0;
  }

  readonly decay = false;

  draw(context: CanvasRenderingContext2D) {
  }
}