import { Builder as GameBuilder } from './Game';
import { Point } from './xyTuple';

export const Level1 = new GameBuilder();
Level1.boundryLeft = 100;
Level1.boundryRight = 400;
Level1.boundryTop = 50;
Level1.boundryBottom = 300;
Level1.keyInitial = new Point(250, 200);
Level1.playerInitial = new Point(100, 50);