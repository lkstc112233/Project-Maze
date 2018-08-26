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

export class Game {
    private m_scene: Scene = new Scene();
    private player: Character = new Character();
    private key: Key = new Key();
    private m_status = Status.IDLE;
    private m_accelerate: Point = new Point();

    constructor() {
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
        this.scene.update();
    }

    draw(context: CanvasRenderingContext2D) {
        this.scene.draw(context);
    }
}