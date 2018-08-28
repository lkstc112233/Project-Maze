import { Scene, Sprite } from "./Scene";
import { Character } from "./Character";
import { Key } from "./Key";
import { Point } from "./xyTuple";

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

    playerInitial: Point = new Point();
    keyInitial: Point = new Point();

    build(): Game {
        const result = new Game(
            this.width, 
            this.height,
            this.playerInitial,
            this.keyInitial,
            new Point(
                this.left, 
                this.top, ),
        );
        return result;
    }
}

class Boundry implements Sprite {
    readonly decay = false;
    constructor(
        private readonly width: number,
        private readonly height: number,
    ) {

    }

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
    private m_status = Status.IDLE;
    private m_accelerate: Point = new Point();

    constructor(
        private readonly width: number,
        private readonly height: number,
        readonly playerInitial: Point,
        readonly keyInitial: Point,
        private leftTopPoint: Point,
    ) {
        this.player.position = playerInitial.clone();
        this.key.position = keyInitial.clone();
        this.scene.add(this.player);
        this.scene.add(this.key);
        this.scene.add(new Boundry(this.width, this.height));
    }

    get scene(): Scene {
        return this.m_scene;
    }

    get status(): Status {
        return this.m_status;
    }

    set accelerate(accelerate: Point) {
        this.m_accelerate = accelerate.clone();
        this.m_accelerate.mul(0.2);
    }

    private get playerKeyDistance(): number {
        const dx = this.key.position.x - this.player.position.x;
        const dy = this.key.position.y - this.player.position.y - 20;
        return Math.sqrt(dx * dx + dy * dy);
    }

    begin() {
        this.m_status = Status.PLAYING;
    }

    update() {
        if (this.status != Status.PLAYING) {
            return;
        }
        this.player.velocity.plus(this.m_accelerate);
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

        this.scene.update();
    }

    draw(context: CanvasRenderingContext2D) {
        context.save();
        context.translate(this.leftTopPoint.x, this.leftTopPoint.y);
        this.scene.draw(context);
        context.restore();
    }
}