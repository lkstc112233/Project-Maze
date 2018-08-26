import { Scene } from "./Scene";
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
    boundryLeft: number = 0;
    boundryTop: number = 0;
    boundryRight: number = 100;
    boundryBottom: number = 100;

    playerInitial: Point = new Point();
    keyInitial: Point = new Point();

    build(): Game {
        const result = new Game(
            this.boundryLeft, 
            this.boundryTop, 
            this.boundryRight, 
            this.boundryBottom,
            this.playerInitial,
            this.keyInitial);
        return result;
    }
}

export class Game {
    private m_scene: Scene = new Scene();
    private player: Character = new Character();
    private key: Key = new Key();
    private m_status = Status.IDLE;
    private m_accelerate: Point = new Point();

    constructor(
        private readonly boundryLeft: number, 
        private readonly boundryTop: number,
        private readonly boundryRight: number,
        private readonly boundryBottom: number,
        readonly playerInitial: Point,
        readonly keyInitial: Point
    ) {
        this.player.position = playerInitial.clone();
        this.key.position = keyInitial.clone();
        this.scene.add(this.player);
        this.scene.add(this.key);
    }

    get scene(): Scene {
        return this.m_scene;
    }

    get status(): Status {
        return this.m_status;
    }

    set accelerate(accelerate: Point) {
        this.m_accelerate = accelerate.clone();
        this.m_accelerate.mul(0.3);
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
        if (this.player.position.x < this.boundryLeft) {
            this.player.velocity.x = 0;
            this.player.position.x = this.boundryLeft;
        }
        if (this.player.position.y < this.boundryTop) {
            this.player.velocity.y = 0;
            this.player.position.y = this.boundryTop;
        }
        if (this.player.position.x > this.boundryRight) {
            this.player.velocity.x = 0;
            this.player.position.x = this.boundryRight;
        }
        if (this.player.position.y > this.boundryBottom) {
            this.player.velocity.y = 0;
            this.player.position.y = this.boundryBottom;
        }
        this.scene.update();
    }

    draw(context: CanvasRenderingContext2D) {
        this.scene.draw(context);
    }
}