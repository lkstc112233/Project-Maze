import {Builder as GameBuilder} from './Game';
import {Obstacle} from './Obstacle';
import {Point} from './xyTuple';

export const LevelB1 = new GameBuilder();
LevelB1.left = 100;
LevelB1.width = 600;
LevelB1.top = 50;
LevelB1.height = 550;
LevelB1.keyInitial = new Point(250, 200);
LevelB1.playerInitial = new Point(100, 50);
LevelB1.chestInitial = new Point(400, 350);
LevelB1.obstacles = [
  new Obstacle(50, new Point(400, 100)), new Obstacle(200, new Point(100, 400))
];

export const Level1 = new GameBuilder();
Level1.left = 100;
Level1.width = 400;
Level1.top = 100;
Level1.height = 400;
Level1.timelimit = 80;
Level1.keyInitial = new Point(200, 200);
Level1.playerInitial = new Point(200, 50);
Level1.chestInitial = new Point(200, 350);
Level1.obstacles = [
  new Obstacle(125, new Point(50, 200)), new Obstacle(125, new Point(350, 200))
];