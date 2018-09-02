import { Point } from "./xyTuple";
import { getLoadedImage } from "./Images";

export class Button {
    position: Point = new Point();
    width: number = 30;
    height: number = 30;
    private captured: boolean = false;
    onclick?: () => void;

    get capturing(): boolean {
        return this.captured;
    }

    mousedown(point: Point) {
        if (point.x > this.position.x && point.y > this.position.y &&
            point.x - this.position.x < this.width && point.y - this.position.y < this.height) {
            this.captured = true;
        }
    }

    mouseup(point: Point) {
        if (this.captured && point.x > this.position.x && point.y > this.position.y &&
            point.x - this.position.x < this.width && point.y - this.position.y < this.height) {
            console.log("clicked");
            if (this.onclick) {
                this.onclick();
            }
        }
        this.captured = false;
    }

    draw(context: CanvasRenderingContext2D) {
        context.drawImage(getLoadedImage('RESET_BUTTON'), this.position.x, this.position.y, this.width, this.height);
    }
}