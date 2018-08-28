import { Point } from './xyTuple';
import { Controller } from './Controller';
import { loadedImageSum, totalImageSum, loadAll } from './Images';
import { LevelB1 } from './Levels';

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext('2d')!;

const game = LevelB1.build();
game.begin();

const controller = new Controller();

function loadLoop() {
    if (loadedImageSum != totalImageSum) {
        requestAnimationFrame(loadLoop);
        context.clearRect(0, 0, canvas.width, canvas.height);
        const ratio = loadedImageSum / totalImageSum;
        context.beginPath();
        context.moveTo(0, canvas.height / 2);
        context.lineWidth = 30;
        context.strokeStyle = '#f00';
        context.lineTo(ratio * canvas.width, canvas.height / 2);
        context.strokeStyle = '#00f';
        context.lineTo(canvas.width, canvas.height / 2);
        context.stroke();
    } else {
        requestAnimationFrame(gameLoop);
    }
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    context.clearRect(0, 0, canvas.width, canvas.height);
    game.accelerate = controller.getControllerValue();
    game.update();
    game.draw(context);
    controller.draw(context);
}

canvas.addEventListener("touchmove",(ev) => {
    var rect = canvas.getBoundingClientRect();
    var x = ev.touches[0].clientX - rect.left;
    var y = ev.touches[0].clientY - rect.top;
    controller.touchUpdate(new Point(x, y));
});

canvas.addEventListener("touchstart", (ev) => {
    ev.preventDefault();
    if (ev.touches.length == 1) {
        var rect = canvas.getBoundingClientRect();
        var x = ev.touches[0].clientX - rect.left;
        var y = ev.touches[0].clientY - rect.top;
        controller.touchBegin(new Point(x, y));
    }
});

canvas.addEventListener("touchend", (ev) => {
    if (ev.touches.length == 0) {
        controller.touchEnd();
    }
});

canvas.addEventListener("mousemove",(ev) => {
    var rect = canvas.getBoundingClientRect();
    var x = ev.clientX - rect.left;
    var y = ev.clientY - rect.top;
    controller.touchUpdate(new Point(x, y));
});

canvas.addEventListener("mousedown", (ev) => {
    if (ev.button == 0) {
        var rect = canvas.getBoundingClientRect();
        var x = ev.clientX - rect.left;
        var y = ev.clientY - rect.top;
        controller.touchBegin(new Point(x, y));
    }
});

canvas.addEventListener("mouseup", (ev) => {
    if (ev.button == 0) {
        controller.touchEnd();
    }
});

loadAll();
requestAnimationFrame(loadLoop);