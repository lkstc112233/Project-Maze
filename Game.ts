import {Character} from './Character';
import {Chest} from './Chest';
import {Controller} from './Controller';
import {Key} from './Key';
import {Obstacle} from './Obstacle';
import {Rewinder} from './Rewind';
import {Scene, Sprite} from './Scene';
import {TimeSlider} from './Time';
import {Point} from './xyTuple';

export enum Status {
  IDLE,
  PLAYING,
  TIMEUP,
  RESETING,
  WIN,
  REWIND_INITIATED,
  REWINDING,
  REWIND_COMPLETE,
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
  obstacles: Obstacle[] = [];

  build(): Game {
    const result = new Game(
        this.width, this.height, this.timelimit, this.playerInitial,
        this.keyInitial, this.chestInitial, this.obstacles,
        new Point(this.left, this.top));
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

const RESET_PROCESS_LENGTH_HALF = 30;

class Game {
  private m_scene: Scene = new Scene();
  private player: Character = new Character();
  private playerPositionRecord: Point[] = [];
  private key: Key = new Key();
  private chest: Chest = new Chest();
  private m_status = Status.IDLE;
  private controller: Controller = new Controller();
  private useController = false;
  private touching?: Point;
  private rewinder?: Rewinder;
  private resetProcess: number = 0;
  private readonly timeSlider: TimeSlider;

  constructor(
      private readonly width: number,
      private readonly height: number,
      private readonly timelimit: number,
      private readonly playerInitial: Point,
      private readonly keyInitial: Point,
      private readonly chestInitial: Point,
      private readonly obstacles: Obstacle[],
      private leftTopPoint: Point,
  ) {
    this.timeSlider =
        new TimeSlider(this.width, this.height + 10, this.timelimit);
    this.reset();
  }

  beginReset() {
    this.m_status = Status.RESETING;
    if (this.resetProcess > RESET_PROCESS_LENGTH_HALF &&
        this.resetProcess < RESET_PROCESS_LENGTH_HALF * 2) {
      this.resetProcess = RESET_PROCESS_LENGTH_HALF * 2 - this.resetProcess;
    }
    this.resetProcess = 0;
  }

  reset(): Game {
    this.player.reset();
    this.player.position = this.playerInitial.clone();
    this.playerPositionRecord = [];
    this.key.reset();
    this.key.position = this.keyInitial.clone();
    this.chest.reset();
    this.chest.position = this.chestInitial.clone();
    this.timeSlider.reset();
    this.scene.clear();
    this.scene.add(this.player);
    this.scene.add(this.key);
    this.scene.add(this.chest);
    this.obstacles.map((element) => this.scene.add(element));
    this.scene.add(new Boundry(this.width, this.height));
    this.scene.add(this.timeSlider);
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
    this.timeSlider.stop();
    this.m_status = Status.WIN;
  }

  get won(): boolean {
    return this.status == Status.WIN;
  }

  rewind() {
    this.m_status = Status.REWIND_INITIATED;
  }

  get rewindCompleted(): boolean {
    return this.status == Status.REWIND_COMPLETE;
  }

  update() {
    switch (this.status) {
      case Status.PLAYING: {
        if (this.timeSlider.timeout) {
          this.m_status = Status.RESETING;
          this.player.velocity.zero();
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
        if (!this.timeSlider.stopped) {
          this.playerPositionRecord.push(this.player.position.clone());
        }
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
        this.obstacles.map((element) => {
          const dx = element.position.x - this.player.position.x;
          const dy = element.position.y - this.player.position.y - 20;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < element.radius) {
            const ratio = 1 - distance / element.radius;
            this.player.position.x -= ratio * dx;
            this.player.position.y -= ratio * dy;
          }
        });
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
        break;
      }
      case Status.TIMEUP: {
        this.m_status = Status.RESETING;
        break;
      }
      case Status.RESETING: {
        if (this.resetProcess < RESET_PROCESS_LENGTH_HALF * 2) {
          this.resetProcess += 1;
        }
        if (this.resetProcess == RESET_PROCESS_LENGTH_HALF) {
          this.reset();
        }
        if (this.resetProcess == RESET_PROCESS_LENGTH_HALF * 2) {
          this.resetProcess = 0;
          this.begin();
        }
        break;
      }
      case Status.REWIND_INITIATED: {
        this.scene.add(this.rewinder = new Rewinder(this.playerPositionRecord));
        this.m_status = Status.REWINDING;
        break;
      }
      case Status.REWINDING: {
        if (this.rewinder && this.rewinder.completed) {
          this.m_status = Status.REWIND_COMPLETE;
        }
        break;
      }
    }
    this.scene.update();
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();
    if (this.status == Status.RESETING) {
      context.globalAlpha =
          Math.abs(this.resetProcess - RESET_PROCESS_LENGTH_HALF) /
          RESET_PROCESS_LENGTH_HALF;
    }
    context.translate(this.leftTopPoint.x, this.leftTopPoint.y);
    this.scene.draw(context);
    context.restore();
    if (this.useController) {
      this.controller.draw(context);
    }
  }
}