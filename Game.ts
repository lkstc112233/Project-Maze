import {Character} from './Character';
import {Chest} from './Chest';
import {Controller} from './Controller';
import {Key} from './Key';
import {Scene, Sprite} from './Scene';
import {TimeSlider} from './Time';
import {Point} from './xyTuple';

export enum Status {
  IDLE,
  PLAYING,
  TIMEUP,
  WIN,
}

export class Builder {
  left: number = 0;
  top: number = 0;
  width: number = 100;
  height: number = 100;
  timelimit: number = 600;

  playerInitial: Point = new Point();
  keyInitial: Point = new Point();
  chestInitial: Point = new Point();

  build(): Game {
    const result = new Game(
        this.width, this.height, this.timelimit, this.playerInitial,
        this.keyInitial, this.chestInitial, new Point(this.left, this.top));
    return result;
  }
}

class Boundry implements Sprite {
  readonly decay = false;
  constructor(
      private readonly width: number,
      private readonly height: number,
  ) {}

  get z(): number {
    return 0;
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();

    context.beginPath();
    context.lineWidth = 5;
    context.strokeStyle = 'black';
    context.rect(0, 0, this.width, this.height);
    context.stroke();

    context.restore();
  }
}

class Game {
  private m_scene: Scene = new Scene();
  private player: Character = new Character();
  private key: Key = new Key();
  private chest: Chest = new Chest();
  private m_status = Status.IDLE;
  private controller: Controller = new Controller();
  private useController = false;
  private touching?: Point;

  constructor(
      private readonly width: number,
      private readonly height: number,
      private readonly timelimit: number,
      private readonly playerInitial: Point,
      private readonly keyInitial: Point,
      private readonly chestInitial: Point,
      private leftTopPoint: Point,
  ) {
    this.reset();
  }

  reset(): Game {
    this.player.reset();
    this.player.position = this.playerInitial.clone();
    this.key.reset();
    this.key.position = this.keyInitial.clone();
    this.chest.reset();
    this.chest.position = this.chestInitial.clone();
    this.scene.clear();
    this.scene.add(this.player);
    this.scene.add(this.key);
    this.scene.add(this.chest);
    this.scene.add(new Boundry(this.width, this.height));
    this.scene.add(
        new TimeSlider(this.width, this.height + 10, this.timelimit));
    return this;
  }

  get scene(): Scene {
    return this.m_scene;
  }

  get status(): Status {
    return this.m_status;
  }

  touchBegin(point: Point) {
    this.touching = point.clone();
    this.touching.minus(this.leftTopPoint);
    this.controller.touchBegin(point);
  }

  touchUpdate(point: Point) {
    if (this.touching) {
      this.touching = point.clone();
      this.touching.minus(this.leftTopPoint);
    }
    this.controller.touchUpdate(point);
  }

  touchEnd() {
    if (!this.useController) {
      this.touching = undefined;
    }
    this.controller.touchEnd();
  }

  private get playerKeyDistance(): number {
    if (this.key.gone) {
      return Infinity;
    }
    const dx = this.key.position.x - this.player.position.x;
    const dy = this.key.position.y - this.player.position.y - 20;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private get playerChestDistance(): number {
    const dx = this.chest.position.x - this.player.position.x;
    const dy = this.chest.position.y - this.player.position.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  begin() {
    this.m_status = Status.PLAYING;
  }

  private win() {
    this.m_status = Status.WIN;
  }

  update() {
    if (this.status != Status.PLAYING) {
      this.scene.update();
      return;
    }
    let accelerator: Point;
    if (this.useController) {
      accelerator = this.controller.getControllerValue();
      accelerator.mul(0.2);
    } else if (this.touching) {
      accelerator = this.touching.clone();
      accelerator.minus(this.player.position);
      accelerator.normalize();
      accelerator.mul(0.2);
    } else {
      accelerator = new Point();
    }
    this.player.velocity.plus(accelerator);
    this.player.update();
    // Boundry check
    if (this.player.position.x < 20) {
      this.player.velocity.x = 0;
      this.player.position.x = 20;
    }
    if (this.player.position.y < 0) {
      this.player.velocity.y = 0;
      this.player.position.y = 0;
    }
    if (this.player.position.x > this.width - 20) {
      this.player.velocity.x = 0;
      this.player.position.x = this.width - 20;
    }
    if (this.player.position.y > this.height - 20) {
      this.player.velocity.y = 0;
      this.player.position.y = this.height - 20;
    }
    if (this.playerKeyDistance < 20) {
      this.key.taken();
      this.player.taken();
    }
    if (this.playerChestDistance < 20 && this.player.holding) {
      this.chest.open();
      this.player.untaken();
      this.player.velocity.zero();
      this.win();
    }

    this.scene.update();
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.translate(this.leftTopPoint.x, this.leftTopPoint.y);
    this.scene.draw(context);
    context.restore();
    if (this.useController) {
      this.controller.draw(context);
    }
  }
}