import Phaser from "phaser";
import SceneKey from "../SceneKey";
import SlidingPuzzleBackground1 from "../assets/images/sliding-puzzle-background-1.png";
import SlidingPuzzleBackground2 from "../assets/images/sliding-puzzle-background-2.png";
import SlidingPuzzleBackground3 from "../assets/images/sliding-puzzle-background-3.png";
import Button from "../components/Button";
import Piece from "../models/Piece";
import MessageBox from "../components/MessageBox";

const spritesheetKey1 = "background1";
const spritesheetKey2 = "background2";
const spritesheetKey3 = "background3";

const slidingPuzzleBackgroundConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig =
  {
    frameWidth: 180,
    frameHeight: 180,
    margin: 0,
  };

const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: "New Tegomin",
  fontSize: "32px",
  color: "#5755d9",
};

const IMAGE_KEYS = [spritesheetKey1, spritesheetKey2, spritesheetKey3];

const ROW_COUNT: number = 4;
const COL_COUNT: number = 4;

export function millisecondsToTime(duration: number): string {
  const milliseconds = parseInt(`${(duration % 1000) / 100}`);
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  const hoursString = hours < 10 ? "0" + hours : hours;
  const minutesString = minutes < 10 ? "0" + minutes : minutes;
  const secondsString = seconds < 10 ? "0" + seconds : seconds;

  return `${hoursString}:${minutesString}:${secondsString}.${milliseconds}`;
}

export default class SlidingPuzzle extends Phaser.Scene {
  private localTimer: Phaser.Time.TimerEvent | undefined;
  private timerText: Phaser.GameObjects.Text | undefined;
  private timerMs: number;
  private moveCount: number;
  private moveCountText: Phaser.GameObjects.Text | undefined;
  private startButton: Button | undefined;
  private screenButton: Button | undefined;
  private messageBox: MessageBox | undefined;
  private closeMessageBoxButton: Button | undefined;
  private group: Phaser.GameObjects.Group | undefined;

  constructor() {
    super({
      key: SceneKey.SLIDING_PUZZLE,
      active: false,
    });
    this.timerMs = 0;
    this.moveCount = 0;
  }

  init(data: any): void {}

  preload(): void {
    this.load.spritesheet(
      spritesheetKey1,
      SlidingPuzzleBackground1,
      slidingPuzzleBackgroundConfig
    );
    this.load.spritesheet(
      spritesheetKey2,
      SlidingPuzzleBackground2,
      slidingPuzzleBackgroundConfig
    );
    this.load.spritesheet(
      spritesheetKey3,
      SlidingPuzzleBackground3,
      slidingPuzzleBackgroundConfig
    );
  }

  create(data: any): void {
    this.cameras.main.setBackgroundColor("#303742");
    this.createStartButton("Start!");

    this.createScreenButton("startFullscreen");
  }

  update(time: number, delta: number): void {}

  pieceHandleInputDown(
    piece: Piece,
    pointer: Phaser.Input.Pointer,
    localX: number,
    localY: number,
    event: any
  ): void {
    if (this.checkComplete()) {
      return;
    }

    if (this.movePiece(piece)) {
      this.addMoveCount();
    }

    if (this.checkComplete()) {
      this.stopTimer();
      this.createMessageBox(
        `Time: ${millisecondsToTime(this.timerMs)}\nMove Count: ${
          this.moveCount
        }\nCongratulation!`
      );
    }
  }

  createPuzzle(): void {
    if (this.group) {
      this.group.destroy(true, false);
    }
    this.group = this.add.group();

    const spritesheetKeyIndex = Math.floor(Math.random() * IMAGE_KEYS.length);

    let frame = 0;
    for (let y = 0; y < ROW_COUNT; y++) {
      for (let x = 0; x < COL_COUNT; x++) {
        const frameWidth = slidingPuzzleBackgroundConfig.frameWidth;
        const frameHeight = slidingPuzzleBackgroundConfig.frameHeight
          ? slidingPuzzleBackgroundConfig.frameHeight
          : 0;

        const pieceX = x * frameWidth + frameWidth / 2;

        const pieceY = y * frameHeight + frameHeight / 2;

        if (x === 0 && y === 0) {
          const piece = this.group.create(
            pieceX,
            pieceY,
            IMAGE_KEYS[spritesheetKeyIndex],
            frame,
            false
          );
          piece.initialPositionX = x;
          piece.initialPositionY = y;
          piece.currentPositionX = x;
          piece.currentPositionY = y;
          frame++;
          continue;
        }

        const piece: Piece = this.group.create(
          pieceX,
          pieceY,
          IMAGE_KEYS[spritesheetKeyIndex],
          frame
        );

        piece.initialPositionX = x;
        piece.initialPositionY = y;
        piece.currentPositionX = x;
        piece.currentPositionY = y;
        piece
          .setInteractive()
          .on(
            "pointerdown",
            (
              pointer: Phaser.Input.Pointer,
              localX: number,
              localY: number,
              event: any
            ) =>
              this.pieceHandleInputDown(piece, pointer, localX, localY, event),
            this
          );

        frame++;
      }
    }
    this.shufflePieces();
  }

  resetMoveCount(): void {
    this.moveCount = 0;
    if (this.moveCountText) {
      this.moveCountText.destroy();
    }

    this.moveCountText = this.add.text(
      840,
      440,
      `Move Count: ${this.moveCount}`,
      textStyle
    );
  }

  addMoveCount(): void {
    this.moveCount++;
    if (this.moveCountText) {
      this.moveCountText.text = `Move Count: ${this.moveCount}`;
    }
  }

  startTimer(): void {
    this.timerMs = 0;

    if (this.timerText) {
      this.timerText.destroy();
    }

    this.timerText = this.add.text(
      840,
      400,
      `Time: ${millisecondsToTime(this.timerMs)}`,
      textStyle
    );

    const timerEventConfig: Phaser.Types.Time.TimerEventConfig = {
      delay: 100,
      loop: true,
      startAt: 0,
      timeScale: 1,
      callback: () => {
        if (!this.localTimer || !this.timerText) {
          return;
        }
        this.timerMs += this.localTimer.getElapsed();
        this.timerText.text = `Time: ${millisecondsToTime(this.timerMs)}`;
      },
    };

    if (this.localTimer) {
      this.localTimer.reset(timerEventConfig);
    } else {
      this.localTimer = this.time.addEvent(timerEventConfig);
    }
  }

  stopTimer(): void {
    if (!this.localTimer) {
      return;
    }
    this.localTimer.paused = true;
  }

  createStartButton(text: string): void {
    if (this.startButton) {
      this.startButton.destroy(true);
    }
    this.startButton = new Button({
      scene: this,
      borderColor: 0x3634d2,
      buttonColor: 0x4240d4,
      buttonOverColor: 0x4240d4,
      buttonDownColor: 0x3a38d2,
      buttonUpColor: 0x4240d4,
      textColor: "#ffffff",
      textDownColor: "#ffffff",
      textOverColor: "#ffffff",
      textUpColor: "#ffffff",
      fontSize: "32px",
      height: 90,
      width: 360,
      text: text,
      x: 1000,
      y: 90,
      onClick: () => {
        this.resetMoveCount();
        this.createPuzzle();
        this.createStartButton("Re:start!");
        this.startTimer();
      },
    });
  }

  createScreenButton(text: string): void {
    if (this.screenButton) {
      this.screenButton.destroy(true);
    }
    this.screenButton = new Button({
      scene: this,
      borderColor: 0x3634d2,
      buttonColor: 0x4240d4,
      buttonOverColor: 0x4240d4,
      buttonDownColor: 0x3a38d2,
      buttonUpColor: 0x4240d4,
      textColor: "#ffffff",
      textDownColor: "#ffffff",
      textOverColor: "#ffffff",
      textUpColor: "#ffffff",
      fontSize: "32px",
      height: 90,
      width: 360,
      text: text,
      x: 1000,
      y: 200,
      onClick: () => {
        if (this.scale.isFullscreen) {
          this.scale.stopFullscreen();
          this.createScreenButton("startFullscreen");
          return;
        }
        this.scale.startFullscreen();
        this.createScreenButton("stopFullscreen");
      },
    });
  }

  createMessageBox(text: string): void {
    if (this.messageBox) {
      this.messageBox.destroy(true);
    }
    if (this.closeMessageBoxButton) {
      this.closeMessageBoxButton.destroy(true);
    }

    this.messageBox = new MessageBox({
      scene: this,
      textColor: "#32384d",
      fontSize: "32px",
      text: text,
      height: 700,
      width: 1000,
      x: 640,
      y: 360,
    });
    this.closeMessageBoxButton = new Button({
      scene: this,
      borderColor: 0x3634d2,
      buttonColor: 0x4240d4,
      buttonOverColor: 0x4240d4,
      buttonDownColor: 0x3a38d2,
      buttonUpColor: 0x4240d4,
      textColor: "#ffffff",
      textDownColor: "#ffffff",
      textOverColor: "#ffffff",
      textUpColor: "#ffffff",
      fontSize: "48px",
      text: "Close",
      height: 90,
      width: 360,
      x: 640,
      y: 540,
      onClick: () => {
        if (this.messageBox) {
          this.messageBox.destroy(true);
        }
        if (this.closeMessageBoxButton) {
          this.closeMessageBoxButton.destroy(true);
        }
      },
    });
  }

  checkComplete(): boolean {
    if (!this.group) {
      return false;
    }
    const children = this.group.getChildren();
    for (let i = 0; i < children.length; i++) {
      const piece = children[i] as Piece;
      if (
        piece.initialPositionX !== piece.currentPositionX ||
        piece.initialPositionY !== piece.currentPositionY
      ) {
        return false;
      }
    }
    return true;
  }

  shufflePieces(): void {
    if (!this.group) {
      return;
    }
    const shuffleCount: number = 256;
    let count: number = 0;
    while (count < shuffleCount) {
      const children = this.group.getChildren();
      const randomIndex = Math.floor(Math.random() * children.length);
      if (this.movePiece(children[randomIndex] as Piece)) {
        count++;
      }
    }
  }

  movePiece(piece: Piece): boolean {
    const blank = this.pieceCanMove(piece);
    if (!blank) {
      return false;
    }

    const positionX = piece.currentPositionX;
    const positionY = piece.currentPositionY;

    piece.currentPositionX = blank.currentPositionX;
    piece.currentPositionY = blank.currentPositionY;
    blank.currentPositionX = positionX;
    blank.currentPositionY = positionY;

    const frameWidth = slidingPuzzleBackgroundConfig.frameWidth;
    const frameHeight = slidingPuzzleBackgroundConfig.frameHeight
      ? slidingPuzzleBackgroundConfig.frameHeight
      : 0;

    const pieceTween = this.tweens.add({
      targets: piece,
      x: piece.currentPositionX * frameWidth + frameWidth / 2,
      y: piece.currentPositionY * frameHeight + frameHeight / 2,
      duration: 100,
      ease: Phaser.Math.Easing.Linear(0),
    });

    const blankTween = this.tweens.add({
      targets: blank,
      x: blank.currentPositionX * frameWidth + frameWidth / 2,
      y: blank.currentPositionY * frameHeight + frameHeight / 2,
      ease: Phaser.Math.Easing.Linear(0),
    });

    return true;
  }

  pieceCanMove(piece: Piece): Piece | undefined {
    const up = this.getPiece(
      piece.currentPositionX,
      piece.currentPositionY - 1
    );
    if (
      up !== undefined &&
      up.initialPositionX === 0 &&
      up.initialPositionY === 0
    ) {
      return up;
    }

    const down = this.getPiece(
      piece.currentPositionX,
      piece.currentPositionY + 1
    );
    if (
      down !== undefined &&
      down.initialPositionX === 0 &&
      down.initialPositionY === 0
    ) {
      return down;
    }

    const left = this.getPiece(
      piece.currentPositionX - 1,
      piece.currentPositionY
    );
    if (
      left !== undefined &&
      left.initialPositionX === 0 &&
      left.initialPositionY === 0
    ) {
      return left;
    }

    const right = this.getPiece(
      piece.currentPositionX + 1,
      piece.currentPositionY
    );
    if (
      right !== undefined &&
      right.initialPositionX === 0 &&
      right.initialPositionY === 0
    ) {
      return right;
    }

    return undefined;
  }

  getPiece(x: number, y: number): Piece | undefined {
    if (!this.group) {
      return undefined;
    }
    const children = this.group.getChildren();
    for (let i = 0; i < children.length; i++) {
      const element = children[i] as Piece;
      if (element.currentPositionX === x && element.currentPositionY === y) {
        return element;
      }
    }
    return undefined;
  }
}
