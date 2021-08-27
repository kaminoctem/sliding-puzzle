import Phaser from "phaser";

export default class Piece extends Phaser.GameObjects.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
    this.id = 0;
    this.initialPositionX = 0;
    this.initialPositionY = 0;
    this.currentPositionX = 0;
    this.currentPositionY = 0;
  }

  id: number;
  initialPositionX: number;
  initialPositionY: number;
  currentPositionX: number;
  currentPositionY: number;
}
