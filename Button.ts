import { Point } from "./xyTuple";
import { getLoadedImage } from "./Images";

export class Button {
    position: Point = new Point();
    draw(context: CanvasRenderingContext2D) {
        context.drawImage(getLoadedImage('RESET_BUTTON'), this.position.x, this.position.y);
    }
}