import { Builder as GameBuilder } from './Game';
import { Point } from './xyTuple';

export const LevelB1 = new GameBuilder();
LevelB1.boundryLeft = 100;
LevelB1.boundryRight = 700;
LevelB1.boundryTop = 50;
LevelB1.boundryBottom = 600;
LevelB1.keyInitial = new Point(250, 200);
LevelB1.playerInitial = new Point(100, 50);