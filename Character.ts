import { Point, Direction } from './xyTuple';
import { drawCharacterImage } from './DrawingHelper';
import { Sprite } from './Scene';

class CharacterAfterImage implements Sprite {
    private lifeCountdown = 20;
    constructor(private readonly position: Point, private readonly frame: number, private readonly headOffset: number, private readonly direction:Direction) {}

    get z(): number {
        return this.position.y - 50;
    }

    get decay(): boolean {
        return this.lifeCountdown <= 0;
    }

    draw(context: CanvasRenderingContext2D) {
        // Draw spirit
        const size = 40 + 20 - this.lifeCountdown;
        const WALKING_CONSTANT = 30;
        const WALKING_STEPS = [0, 1, 0, 2];

        context.save();
        context.globalAlpha = this.lifeCountdown / 40;
        drawCharacterImage(context, 'BODY', WALKING_STEPS[Math.floor(this.frame / WALKING_CONSTANT)], this.direction, this.position.x, this.position.y, size);
        drawCharacterImage(context, 'HEAD', 0, this.direction, this.position.x, this.position.y + this.headOffset, size);
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
    position = new Point();
    velocity = new Point();

    get z(): number {
        return this.position.y; 
    }

    get decay(): boolean {
        return false;
    }

    generate(): Sprite[] {
        if (this.velocity.length > 4) {
            if (this.afterImageCooldown <= 0) {
                this.afterImageCooldown = 5;
                return [new CharacterAfterImage(this.position.clone(), this.frame, this.headOffset, this.velocity.direction)];
            }
        }
        this.afterImageCooldown -= 1;
        return [];
    }

    update() {
        // Update status
        this.velocity.mul(0.97);
        this.position.plus(this.velocity);
    }

    draw(context: CanvasRenderingContext2D) {
        // Draw spirit
        const size = 40;
        this.frame += this.velocity.length;
        const WALKING_CONSTANT = 30;
        const WALKING_STEPS = [0, 1, 0, 2];
        while (this.frame > WALKING_CONSTANT * 4) {
            this.frame -= WALKING_CONSTANT * 4;
        }

        // Update headOffset
        this.headOffset = (this.velocity.length * 0.2 + 1) * (Math.sin(this.headSpin += Math.PI / 60) + 1);

        drawCharacterImage(context, 'BODY', WALKING_STEPS[Math.floor(this.frame / WALKING_CONSTANT)], this.velocity.direction, this.position.x, this.position.y, size);
        drawCharacterImage(context, 'HEAD', 0, this.velocity.direction, this.position.x, this.position.y + this.headOffset, size);
    }
}