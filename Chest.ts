import {drawChestImage} from './DrawingHelper';
import {Sprite} from './Scene'
import {Point} from './xyTuple'

const CHEST_SIZE = 40;

class OpeningChest implements Sprite {
  private decayProcess = 0;
  position: Point = new Point();
  constructor(position: Point) {
    this.position = position.clone();
  }

  get z(): number {
    return this.position.y + 40;
  }

  get decay(): boolean {
    return false;
  }

  draw(context: CanvasRenderingContext2D) {
    drawChestImage(
        context, Math.floor(this.decayProcess / 7), this.position.x,
        this.position.y, CHEST_SIZE);
    this.decayProcess += 1;
  }
}

export class Chest implements Sprite {
  private opening = false;
  position: Point = new Point();

  reset() {
    this.opening = false;
  }

  get z(): number {
    return this.position.y;
  }

  get decay(): boolean {
    return this.opening;
  }

  open() {
    this.opening = true;
  }

  generate(): Sprite[] {
    if (this.opening) {
      return [new OpeningChest(this.position)];
    }
    return [];
  }

  draw(context: CanvasRenderingContext2D) {
    drawChestImage(context, 0, this.position.x, this.position.y, CHEST_SIZE);
  }
}