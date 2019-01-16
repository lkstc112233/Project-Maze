import {Sprite} from './Scene'

export class TimeSlider implements Sprite {
  private m_current: number = 0;
  private stopped: boolean = false;
  constructor(
      private readonly width: number, private readonly y: number,
      private readonly timelimit: number) {}

  get current() {
    return this.m_current;
  }

  get timeout() {
    return this.m_current >= this.timelimit;
  }

  stop() {
    this.stopped = true;
  }

  reset() {
    this.m_current = 0;
    this.stopped = false;
  }

  get z(): number {
    return 0;
  }

  readonly decay = false;

  draw(context: CanvasRenderingContext2D) {
    if (!this.stopped) {
      this.m_current += 1;
    }
    if (this.timeout) {
      this.stop();
    }
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