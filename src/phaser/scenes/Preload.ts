import Phaser from "phaser";
import SceneKey from "../SceneKey";

const sceneSettingConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: SceneKey.PRELOAD,
  active: true,
};

export default class Preload extends Phaser.Scene {
  private nextSceneKey: string;
  private nextSceneData: object;

  constructor() {
    super(sceneSettingConfig);
    this.nextSceneKey = "";
    this.nextSceneData = {};
  }

  init(data: any): void {
    this.nextSceneKey = data.nextSceneKey;
    this.nextSceneData = data.nextSceneData;
  }

  preload(): void {
  }

  create(data: any): void {
    this.cameras.main.setBackgroundColor("#000000");
    this.scene.start(this.nextSceneKey, this.nextSceneData);
  }

  update(): void {
  }
}
