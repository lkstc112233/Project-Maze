import {Button, ButtonSet} from './Button';
import {loadAll, loadedImageSum, totalImageSum} from './Images';
import {LevelB1, Level1, Level2, Level3} from './Levels';
import {Point} from './xyTuple';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d')!;

// TODO: Update size by view
if (canvas.width > canvas.height) {
  var margin = canvas.width / 30;
  var scale = margin * 8 / 400;
  Level1.top = 2 * margin;
  Level2.top = 2 * margin;
  Level3.top = 2 * margin;
  Level1.left = 2 * margin;
  Level2.left = 11 * margin;
  Level3.left = 20 * margin;
  Level1.scale = scale;
  Level2.scale = scale;
  Level3.scale = scale;
  margin = canvas.height / 12;
  scale = margin * 8 / 550;
  LevelB1.top = 2 * margin;
  LevelB1.left = 2 * margin;
  LevelB1.scale = scale;
} else {
  var margin = canvas.width / 21;
  var scale = margin * 8 / 400;
  Level1.top = 2 * margin;
  Level2.top = 11 * margin;
  Level3.top = 2 * margin;
  Level1.left = 2 * margin;
  Level2.left = 6.5 * margin;
  Level3.left = 11 * margin;
  Level1.scale = scale;
  Level2.scale = scale;
  Level3.scale = scale;
  margin = canvas.width / 12;
  scale = margin * 8 / 600;
  LevelB1.top = 2 * margin;
  LevelB1.left = 2 * margin;
  LevelB1.scale = scale;
}
const tutorial = LevelB1.build();
const level1 = Level1.build();
const level2 = Level2.build();
const level3 = Level3.build();
tutorial.begin();

const levels = [tutorial];

const buttons = new ButtonSet();

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
	requestAnimationFrame(transformLoop);
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
  levels.map((element) => element.update());
  if (tutorial.won) {
    tutorial.rewind();
  }
  levels.map((element) => element.draw(context));
  buttons.draw(context);
}

var transformProcess = 0;
const TRANSFORM_LENGTH = 100;
function transformLoop() {
  if ((transformProcess += 1) < TRANSFORM_LENGTH) {
    requestAnimationFrame(transformLoop);
  } else {
	level1.begin();
	requestAnimationFrame(gameLoop);
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
  levels.map((element) => element.update());
  context.save();
  context.globalAlpha = (TRANSFORM_LENGTH - transformProcess) / TRANSFORM_LENGTH;
  tutorial.draw(context);
  context.globalAlpha = 1 - context.globalAlpha;
  levels.map((element) => element.draw(context));
  context.restore();
  buttons.draw(context);
}

function gameLoop() {
  requestAnimationFrame(gameLoop);
  context.clearRect(0, 0, canvas.width, canvas.height);
  levels.map((element) => element.update());
  if (level1.won) {
	level1.idle();
    level2.begin();
  }
  if (level2.won) {
	level2.idle();
	level3.begin();
  }
  if (level3.won) {
	level3.idle();
	level1.rewind();
  }
  if (level1.rewindCompleted) {
	level1.idle();
	level2.rewind();
  }
  if (level2.rewindCompleted) {
	level2.idle();
	level3.rewind();
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