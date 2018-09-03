import { Point } from "./xyTuple";
import { getLoadedImage, Images } from "./Images";

export const resetImages: (keyof typeof Images)[] = ['RESET_BUTTON', 'RESET_BUTTON_HOVER', 'RESET_BUTTON_PRESSED'] as (keyof typeof Images)[];

export class Button {
    position: Point = new Point();
    width: number = 30;
    height: number = 30;
    private captured: boolean = false;
    private hover: boolean = false;
    onclick?: () => void;
    images: (keyof typeof Images)[] = resetImages;

    get capturing(): boolean {
        return this.captured;
    }

    mousedown(point: Point) {
        if (point.x > this.position.x && point.y > this.position.y &&
            point.x - this.position.x < this.width && point.y - this.position.y < this.height) {
            this.captured = true;
        }
    }

    mousemove(point: Point) {
        if (point.x > this.position.x && point.y > this.position.y &&
            point.x - this.position.x < this.width && point.y - this.position.y < this.height) {
            this.hover = true;
        } else {
            this.hover = false;
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
        const drawImage = (key: number) => context.drawImage(getLoadedImage(this.images[key]), this.position.x, this.position.y, this.width, this.height);
        if (!this.hover) {
            drawImage(0);
        } else if (this.capturing) {
            drawImage(2);
        } else {
            drawImage(1);
        }
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
        return this.buttons.reduce((handled, element) => {
            if (handled) {
                return true;
            }
            element.mousedown(point);
            if (element.capturing) {
                return true;
            }
            return false;
        }, false);
    }

    mousemove(point: Point): boolean {
        return this.buttons.reduce((handled, element) => {
            if (handled) {
                return true;
            }
            element.mousemove(point);
            if (element.capturing) {
                return true;
            }
            return false;
        }, false);
    }

    mouseup(point: Point) {
        this.buttons.map((element) => element.mouseup(point));
    }

    draw(context: CanvasRenderingContext2D) {
        this.buttons.map((element) => element.draw(context));
    }

}