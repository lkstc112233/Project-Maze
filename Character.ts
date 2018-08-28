import { Point, Direction } from './xyTuple';
import { drawCharacterImage } from './DrawingHelper';
import { Sprite } from './Scene';

const CHARACTER_SIZE = 40;
const CHARACTER_WALKING_CONSTANT = 30;

class CharacterAfterImage implements Sprite {
    private lifeCountdown = 20;
    constructor(
        private readonly position: Point, 
        private readonly frame: number, 
        private readonly headOffset: number, 
        private readonly direction: Direction,
        private readonly holdingKey: boolean,
    ) {}

    get z(): number {
        return this.position.y - 10;
    }

    get decay(): boolean {
        return this.lifeCountdown <= 0;
    }

    private drawCharacter(context: CanvasRenderingContext2D, size: number) {
        const WALKING_STEPS = [0, 1, 0, 2];
        const bodyType = this.holdingKey? 'BODY_HOLDING': 'BODY';
        drawCharacterImage(context, bodyType, WALKING_STEPS[Math.floor(this.frame / CHARACTER_WALKING_CONSTANT)], this.direction, this.position.x, this.position.y, size);
        drawCharacterImage(context, 'HEAD', 0, this.direction, this.position.x, this.position.y + this.headOffset, size);
    }

    draw(context: CanvasRenderingContext2D) {
        // Draw spirit
        const size = CHARACTER_SIZE + 20 - this.lifeCountdown;

        context.save();
        context.globalAlpha = this.lifeCountdown / 40;
        this.drawCharacter(context, size);
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

    get z(): number {
        return this.position.y + 40; 
    }

    get decay(): boolean {
        return false;
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
                    this.m_taken)];
            }
        }
        this.afterImageCooldown -= 1;
        return [];
    }

    taken() {
        this.m_taken = true;
    }

    update() {
        // Update status
        this.velocity.mul(0.97);
        this.position.plus(this.velocity);
    }

    private drawCharacter(context: CanvasRenderingContext2D) {
        const WALKING_STEPS = [0, 1, 0, 2];
        const bodyType = this.m_taken? 'BODY_HOLDING': 'BODY';
        drawCharacterImage(context, bodyType, WALKING_STEPS[Math.floor(this.frame / CHARACTER_WALKING_CONSTANT)], this.velocity.direction, this.position.x, this.position.y, CHARACTER_SIZE);
        drawCharacterImage(context, 'HEAD', 0, this.velocity.direction, this.position.x, this.position.y + this.headOffset, CHARACTER_SIZE);
    }

    draw(context: CanvasRenderingContext2D) {
        // Draw spirit
        this.frame += this.velocity.length;
        while (this.frame > CHARACTER_WALKING_CONSTANT * 4) {
            this.frame -= CHARACTER_WALKING_CONSTANT * 4;
        }

        // Update headOffset
        this.headOffset = (this.velocity.length * 0.2 + 1) * (Math.sin(this.headSpin += Math.PI / 60) + 1);

        this.drawCharacter(context);
    }
}