import { Point, Direction } from './xyTuple';
import { drawCharacterImage, drawKeyImage } from './DrawingHelper';
import { Sprite } from './Scene';

const CHARACTER_SIZE = 40;
const CHARACTER_WALKING_CONSTANT = 30;
const WALKING_STEPS = [0, 1, 0, 2];

function drawCharacter(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    headOffset: number,
    step: number,
    holdingKey: boolean,
    direction: Direction,
    size: number = CHARACTER_SIZE) {
    const drawBody = (type: 'BODY_HOLDING' | 'BODY') => {
        drawCharacterImage(context, type, step, direction, x, y, size);
        drawCharacterImage(context, 'HEAD', 0, direction, x, y + headOffset, size);
    }
    const drawKey = (x: number, y: number, flip?: boolean) => {
        drawKeyImage(context, x, y, size, flip);
    }
    if (holdingKey) {
        if (direction == Direction.UP) {
            drawKey(x, y - size / 2);
            drawBody('BODY_HOLDING');
        } else if (direction == Direction.DOWN) {
            drawBody('BODY_HOLDING');
            drawKey(x, y + size / 2);
        } else if (direction == Direction.LEFT) {
            drawBody('BODY_HOLDING');
            drawKey(x - size * 0.7, y, true);
        } else if (direction == Direction.RIGHT) {
            drawBody('BODY_HOLDING');
            drawKey(x + size * 0.7, y);
        }
    } else {
        drawBody('BODY');
    }
}

class CharacterAfterImage implements Sprite {
    private lifeCountdown = 20;
    constructor(
        private readonly position: Point,
        private readonly frame: number,
        private readonly headOffset: number,
        private readonly direction: Direction,
        private readonly holdingKey: boolean,
    ) { }

    get z(): number {
        return this.position.y - 10;
    }

    get decay(): boolean {
        return this.lifeCountdown <= 0;
    }

    draw(context: CanvasRenderingContext2D) {
        // Draw spirit
        const size = CHARACTER_SIZE + 20 - this.lifeCountdown;

        context.save();
        context.globalAlpha = this.lifeCountdown / 40;
        drawCharacter(
            context,
            this.position.x,
            this.position.y,
            this.headOffset,
            WALKING_STEPS[Math.floor(this.frame / CHARACTER_WALKING_CONSTANT)],
            this.holdingKey,
            this.direction,
            size);
        context.restore();

        // Count down
        this.lifeCountdown -= 1;
    }
}

export class Character implements Sprite {
    private frame = 0;
    private headSpin = 0;
    private headOffset = 0;
    private afterImageCooldown = 0;
    private m_taken = false;
    position = new Point();
    velocity = new Point();

    reset() {
        this.velocity.zero();
        this.frame = 0;
        this.headSpin = 0;
        this.headOffset = 0;
        this.afterImageCooldown = 0;
        this.m_taken = false;
    }

    get z(): number {
        return this.position.y + 40;
    }

    get decay(): boolean {
        return false;
    }

    get holding(): boolean {
        return this.m_taken;
    }

    generate(): Sprite[] {
        if (this.velocity.length > 6) {
            if (this.afterImageCooldown <= 0) {
                this.afterImageCooldown = 5;
                return [new CharacterAfterImage(
                    this.position.clone(),
                    this.frame,
                    this.headOffset,
                    this.velocity.direction,
                    this.holding)];
            }
        }
        this.afterImageCooldown -= 1;
        return [];
    }

    taken() {
        this.m_taken = true;
    }

    untaken() {
        this.m_taken = false;
    }

    update() {
        // Update status
        this.velocity.mul(0.97);
        this.position.plus(this.velocity);
    }

    draw(context: CanvasRenderingContext2D) {
        // Draw spirit
        this.frame += this.velocity.length;
        while (this.frame > CHARACTER_WALKING_CONSTANT * 4) {
            this.frame -= CHARACTER_WALKING_CONSTANT * 4;
        }

        // Update headOffset
        this.headOffset = (this.velocity.length * 0.2 + 1) * (Math.sin(this.headSpin += Math.PI / 60) + 1);

        drawCharacter(
            context,
            this.position.x,
            this.position.y,
            this.headOffset,
            WALKING_STEPS[Math.floor(this.frame / CHARACTER_WALKING_CONSTANT)],
            this.holding,
            this.velocity.direction);
    }
}