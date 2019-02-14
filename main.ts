import {Button, ButtonSet} from './Button';
import {loadAll, loadedImageSum, totalImageSum} from './Images';
import {LevelB1, Level1, Level2, Level3} from './Levels';
import {Point} from './xyTuple';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d')!;

// TODO: Update size by view
const tutorial = LevelB1.build();
const level1 = Level1.build();
const level2 = Level2.build();
const level3 = Level3.build();
tutorial.begin();

const levels = [tutorial];

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
    requestAnimationFrame(tutorialLoop);
  }
}

function tutorialLoop() {
  if (!tutorial.rewindCompleted) {
    requestAnimationFrame(tutorialLoop);
  } else {
	levels.length = 0;
	levels.push(level1);
	levels.push(level2);
	levels.push(level3);
	level1.begin();
	requestAnimationFrame(gameLoop);
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
  levels.map((element) => element.update());
  if (tutorial.won) {
    tutorial.rewind();
  }
  levels.map((element) => element.draw(context));
  buttons.draw(context);
}

function gameLoop() {
  requestAnimationFrame(gameLoop);
  context.clearRect(0, 0, canvas.width, canvas.height);
  levels.map((element) => element.update());
  if (tutorial.won) {
    tutorial.rewind();
  }
  levels.map((element) => element.draw(context));
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
  levels.map((element) => element.touchUpdate(currentPoint));
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
    levels.map((element) => element.touchBegin(currentPoint));
  }
});

canvas.addEventListener('touchend', (ev) => {
  if (ev.touches.length == 0) {
    var rect = canvas.getBoundingClientRect();
    var x = ev.changedTouches[0].clientX - rect.left;
    var y = ev.changedTouches[0].clientY - rect.top;
    const currentPoint = new Point(x, y);
    buttons.mouseup(currentPoint);
    levels.map((element) => element.touchEnd());
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
  levels.map((element) => element.touchUpdate(currentPoint));
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
    levels.map((element) => element.touchBegin(currentPoint));
  }
});

canvas.addEventListener('mouseup', (ev) => {
  if (ev.button == 0) {
    var rect = canvas.getBoundingClientRect();
    var x = ev.clientX - rect.left;
    var y = ev.clientY - rect.top;
    const currentPoint = new Point(x, y);
    buttons.mouseup(currentPoint);
    levels.map((element) => element.touchEnd());
  }
});

loadAll();
requestAnimationFrame(loadLoop);