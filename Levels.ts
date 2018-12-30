import {Builder as GameBuilder} from './Game';
import {Point} from './xyTuple';

export const LevelB1 = new GameBuilder();
LevelB1.left = 100;
LevelB1.width = 600;
LevelB1.top = 50;
LevelB1.height = 550;
LevelB1.keyInitial = new Point(250, 200);
LevelB1.playerInitial = new Point(100, 50);
LevelB1.chestInitial = new Point(400, 350);