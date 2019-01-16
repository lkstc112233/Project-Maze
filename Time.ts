import {Sprite} from './Scene'

export class TimeSlider implements Sprite {
  current: number = 0;
  constructor(
      private readonly width: number, private readonly y: number,
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

    context.save();

    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(0, this.y);
    context.lineTo(this.width * rate, this.y);
    context.strokeStyle = 'red';
    context.stroke();

    context.beginPath();
    context.moveTo(this.width * rate, this.y);
    context.lineTo(this.width, this.y);
    context.strokeStyle = 'gray';
    context.stroke();

    context.restore();
  }
}