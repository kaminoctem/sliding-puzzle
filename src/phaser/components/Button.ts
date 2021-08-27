import Phaser from "phaser";

const initialProps = {
  align: "center",
  fontSize: "16px",
  fontFamily: "Segoe UI",
  textColor: "black",
  textOverColor: "black",
  textDownColor: "black",
  textUpColor: "black",
  buttonColor: 0x888888,
  buttonOverColor: 0x777777,
  buttonDownColor: 0x666666,
  buttonUpColor: 0x555555,
  buttonAlpha: 1,
  borderColor: 0x888888,
  borderAlpha: 1,
};

export default class Button extends Phaser.GameObjects.Container {
  private text: Phaser.GameObjects.Text;
  private container: Phaser.GameObjects.Rectangle;

  constructor(props: ButtonProps) {
    const margedProps = { ...initialProps, ...props };
    super(margedProps.scene, margedProps.x, margedProps.y);

    this.scene = margedProps.scene;
    this.scene.add.existing(this);

    this.setSize(margedProps.width, margedProps.height);
    this.setInteractive({ useHandCursor: true });

    const alignLeft = margedProps.align === "left";

    this.text = this.scene.add
      .text(alignLeft ? -margedProps.width / 2 + 0 : 0, -1, margedProps.text, {
        align: margedProps.align,
        fontSize: margedProps.fontSize,
        color: margedProps.textColor,
        fontFamily: margedProps.fontFamily,
      })
      .setOrigin(alignLeft ? 0 : 0.5, 0.5)
      .setPadding(0, 2, 0, 0);
    if (props.textColor) {
      this.text.setColor(props.textColor);
    }

    this.container = margedProps.scene.add.rectangle(
      0,
      0,
      margedProps.width,
      margedProps.height,
      margedProps.buttonColor,
      margedProps.buttonAlpha
    );
    this.container
      .setStrokeStyle(1, margedProps.borderColor)
      .setOrigin(alignLeft ? 0 : 0.5, 0.5);

    this.add([this.container, this.text]);

    this.on("pointerover", () => {
      this.updateButton(
        "pointer over",
        margedProps.textOverColor,
        margedProps.buttonOverColor
      );
    });

    this.on("pointerout", () => {
      this.updateButton("pointer out", margedProps.textColor, margedProps.buttonColor);
    });

    this.on("pointerdown", () => {
      this.updateButton(
        "pointer down",
        margedProps.textDownColor,
        margedProps.buttonDownColor
      );
      this.scene.tweens.add({
        targets: this,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100,
        yoyo: true,
        repeat: 0,
        ease: "Sine.easeInOut",
      });
    });

    this.on("pointerup", () => {
      this.updateButton("pointer up", margedProps.textUpColor, margedProps.buttonUpColor);
      margedProps.onClick();
    });
  }

  updateButton(
    message: string,
    textColor: string,
    containerColor?: number | undefined
  ): void {
    this.text.setColor(textColor);
    if (containerColor !== undefined) {
      this.container.setFillStyle(containerColor);
    }
  }
}

interface ButtonProps {
  scene: Phaser.Scene;
  x: number;
  y: number;
  text: string;
  width: number;
  height: number;
  align?: "center" | "left" | "right" | "justify";
  fontSize?: string;
  fontFamily?: string | undefined;
  textColor?: string;
  textOverColor?: string;
  textDownColor?: string;
  textUpColor?: string;
  buttonColor?: number | undefined;
  buttonOverColor?: number | undefined;
  buttonDownColor?: number | undefined;
  buttonUpColor?: number | undefined;
  buttonAlpha?: number | undefined;
  borderColor?: number | undefined;
  borderAlpha?: number | undefined;
  onClick: () => void;
}
