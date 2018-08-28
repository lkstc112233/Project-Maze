import { Point } from './xyTuple'
import { Sprite } from './Scene'
import { drawKeyImage } from './DrawingHelper';

export class Key implements Sprite {
    private floatingFrame = 0;
    private keyTaken = false;
    position: Point = new Point();

    get z(): number {
        return this.position.y;
    }

    get decay(): boolean {
        return this.keyTaken;
    }

    get gone(): boolean {
        return this.keyTaken;
    }

    taken() {
        this.keyTaken = true;
    }

    draw(context: CanvasRenderingContext2D) {
        // Draw spirit
        const size = 40;
        this.floatingFrame += Math.PI / 40;
        const yOffset = Math.sin(this.floatingFrame) * 10 - 30;
        const radiusRate = 15 - Math.sin(this.floatingFrame) * 5;

        // Paint
        context.save();
        context.globalAlpha = Math.sin(this.floatingFrame) * 0.3 + 0.4;
        context.beginPath();
        context.fillStyle = '#000';
        context.ellipse(this.position.x, this.position.y, radiusRate, radiusRate / 2, 0, 0, Math.PI * 2);
        context.fill();
        context.restore();
        drawKeyImage(context, this.position.x, this.position.y + yOffset, size);
    }
}