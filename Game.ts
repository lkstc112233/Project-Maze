import { Scene, Sprite } from "./Scene";
import { Character } from "./Character";
import { Key } from "./Key";
import { Point } from "./xyTuple";
import { Chest } from "./Chest";

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
    chestInitial: Point = new Point();

    build(): Game {
        const result = new Game(
            this.width, 
            this.height,
            this.playerInitial,
            this.keyInitial,
            this.chestInitial,
            new Point(this.left, this.top)
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
    private chest: Chest = new Chest();
    private m_status = Status.IDLE;
    private m_accelerate: Point = new Point();

    constructor(
        private readonly width: number,
        private readonly height: number,
        readonly playerInitial: Point,
        readonly keyInitial: Point,
        readonly chestInitial: Point,
        private leftTopPoint: Point,
    ) {
        this.player.position = playerInitial.clone();
        this.key.position = keyInitial.clone();
        this.chest.position = chestInitial.clone();
        this.scene.add(this.player);
        this.scene.add(this.key);
        this.scene.add(this.chest);
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
    }
}