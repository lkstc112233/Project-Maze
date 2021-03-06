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
  new Obstacle(125, new Point(50, 200)),
  new Obstacle(125, new Point(350, 200)),
];

export const Level2 = new GameBuilder();
Level2.left = 550;
Level2.width = 400;
Level2.top = 100;
Level2.height = 400;
Level2.timelimit = 290;
Level2.keyInitial = new Point(200, 350);
Level2.playerInitial = new Point(200, 25);
Level2.chestInitial = new Point(200, 25);
Level2.obstacles = [
  new Obstacle(100, new Point(125, 125)),
  new Obstacle(100, new Point(275, 125)),
  new Obstacle(200, new Point(0, 400)),
  new Obstacle(200, new Point(400, 400)),
];

export const Level3 = new GameBuilder();
Level3.left = 1000;
Level3.width = 400;
Level3.top = 100;
Level3.height = 400;
Level3.timelimit = 175;
Level3.keyInitial = new Point(200, 340);
Level3.playerInitial = new Point(50, 50);
Level3.chestInitial = new Point(350, 50);
Level3.obstacles = [
  new Obstacle(150, new Point(200, 150)),
];