import { Point } from './xyTuple'
import { Sprite } from './Scene'
import { drawChestImage } from './DrawingHelper';

const CHEST_SIZE = 40;

class OpeningChest implements Sprite {
    private decayProcess = 0;
    position: Point = new Point();

    get z(): number {
        return this.position.y;
    }

    get decay(): boolean {
        return false;
    }

    draw(context: CanvasRenderingContext2D) {
        drawChestImage(context, Math.floor(this.decayProcess / 7), this.position.x, this.position.y, CHEST_SIZE);
        this.decayProcess += 1;
    }
}

export class Chest implements Sprite {
    private opening = false;
    position: Point = new Point();

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
            return [new OpeningChest()];
        }
        return [];
    }

    draw(context: CanvasRenderingContext2D) {
        drawChestImage(context, 0, this.position.x, this.position.y, CHEST_SIZE);
    }
}