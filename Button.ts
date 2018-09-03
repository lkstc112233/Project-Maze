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

export class ButtonSet {
    private buttons: Button[] = [];
    add(button: Button) {
        this.buttons.push(button);
    }

    clear() {
        this.buttons = [];
    }

    // Returns true if the message is consumed by any of the button.
    mousedown(point: Point): boolean {
        var handled = false;
        this.buttons.map((element) => {
            if (handled) {
                return;
            }
            element.mousedown(point);
            if (element.capturing){
                handled = true;
            }
        });
        return handled;
    }

    mousemove(point: Point): boolean {
        return this.buttons.reduce((handled, element) => handled || element.capturing, false);
    }

    mouseup(point: Point) {
        this.buttons.map((element) => element.mouseup(point));
    }

    draw(context: CanvasRenderingContext2D) {
        this.buttons.map((element) => element.draw(context));
    }

}