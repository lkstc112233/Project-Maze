export interface Sprite {
  // Order used to determine what order to be drawn.
  // With greater z, the later the sprite will be drawn.
  // Therefore the less it will be overlaped by another sprite.
  readonly z: number;
  readonly decay: boolean;
  // Returns newly added sprites.
  generate?(): Sprite[];
  draw(context: CanvasRenderingContext2D): void;
}

export class Scene {
  private sprites: Sprite[] = [];

  add(sprite: Sprite) {
    this.sprites.push(sprite);
  }

  clear() {
    this.sprites = [];
  }

  update() {
    this.sprites = ([] as Sprite[])
                       .concat(...(this.sprites.map(
                           (element) => [element].concat(
                               element.generate ? element.generate() : []))));
    this.sprites = this.sprites.filter((element) => !element.decay);
  }

  draw(context: CanvasRenderingContext2D) {
    this.sprites = this.sprites.sort((sp1, sp2) => sp1.z - sp2.z);
    this.sprites.map((element) => element.draw(context));
  }
}