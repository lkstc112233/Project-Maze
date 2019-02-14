import {Button, ButtonSet} from './Button';
import {loadAll, loadedImageSum, totalImageSum} from './Images';
import {LevelB1} from './Levels';
import {Point} from './xyTuple';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d')!;

// TODO: Update size by view
const tutorial = LevelB1.build();
tutorial.begin();

const buttons = new ButtonSet();

const reset = new Button();
reset.onclick = () => tutorial.beginReset();
buttons.add(reset);

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
  tutorial.update();
  if (tutorial.won) {
    tutorial.rewind();
  }
  tutorial.draw(context);
  buttons.draw(context);
}

canvas.addEventListener('touchmove', (ev) => {
  var rect = canvas.getBoundingClientRect();
  var x = ev.touches[0].clientX - rect.left;
  var y = ev.touches[0].clientY - rect.top;
  const currentPoint = new Point(x, y);
  if (buttons.mousemove(currentPoint)) {
    return;
  }
  tutorial.touchUpdate(currentPoint);
});

canvas.addEventListener('touchstart', (ev) => {
  ev.preventDefault();
  if (ev.touches.length == 1) {
    var rect = canvas.getBoundingClientRect();
    var x = ev.touches[0].clientX - rect.left;
    var y = ev.touches[0].clientY - rect.top;
    const currentPoint = new Point(x, y);
    if (buttons.mousedown(currentPoint)) {
      return;
    }
    tutorial.touchBegin(currentPoint);
  }
});

canvas.addEventListener('touchend', (ev) => {
  if (ev.touches.length == 0) {
    var rect = canvas.getBoundingClientRect();
    var x = ev.changedTouches[0].clientX - rect.left;
    var y = ev.changedTouches[0].clientY - rect.top;
    const currentPoint = new Point(x, y);
    buttons.mouseup(currentPoint);
    tutorial.touchEnd();
  }
});

canvas.addEventListener('mousemove', (ev) => {
  var rect = canvas.getBoundingClientRect();
  var x = ev.clientX - rect.left;
  var y = ev.clientY - rect.top;
  const currentPoint = new Point(x, y);
  if (buttons.mousemove(currentPoint)) {
    return;
  }
  tutorial.touchUpdate(currentPoint);
});

canvas.addEventListener('mousedown', (ev) => {
  if (ev.button == 0) {
    var rect = canvas.getBoundingClientRect();
    var x = ev.clientX - rect.left;
    var y = ev.clientY - rect.top;
    const currentPoint = new Point(x, y);
    if (buttons.mousedown(currentPoint)) {
      return;
    }
    tutorial.touchBegin(currentPoint);
  }
});

canvas.addEventListener('mouseup', (ev) => {
  if (ev.button == 0) {
    var rect = canvas.getBoundingClientRect();
    var x = ev.clientX - rect.left;
    var y = ev.clientY - rect.top;
    const currentPoint = new Point(x, y);
    buttons.mouseup(currentPoint);
    tutorial.touchEnd();
  }
});

loadAll();
requestAnimationFrame(loadLoop);