import { Point } from "./xyTuple";
import { ImagesLoaded } from "./Images";

export class Button {
    position: Point = new Point();
    draw(context: CanvasRenderingContext2D) {
        context.drawImage(ImagesLoaded['RESET_BUTTON'], this.position.x, this.position.y);
    }
}