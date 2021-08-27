import Phaser from "phaser";
import Preload from "./scenes/Preload";
import SceneKey from "./SceneKey";
import SlidingPuzzle from "./scenes/SlidingPuzzle";

export const gameCongig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: "game",
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
    autoCenter: Phaser.Scale.Center.CENTER_HORIZONTALLY,
    parent: "game",
    zoom: Phaser.Scale.Zoom.MAX_ZOOM,
  },
};

export default class SlidingPuzzleGame extends Phaser.Game {
  constructor() {
    super({
      ...gameCongig,
      backgroundColor: "#000000",
    });
    this.scene.add(SceneKey.PRELOAD, Preload);
    this.scene.add(SceneKey.SLIDING_PUZZLE, SlidingPuzzle);

    this.scene.start(SceneKey.PRELOAD, {
      nextSceneKey: SceneKey.SLIDING_PUZZLE,
    });
  }
}
