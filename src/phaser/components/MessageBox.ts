import Phaser from "phaser";

const initialProps = {
  align: "center",
  fontSize: "16px",
  fontFamily: "Segoe UI",
  textColor: "black",
  backgroundColor: 0xffffff,
  backgroundAlpha: 1,
  borderColor: 0x888888,
  borderAlpha: 1,
};

export default class MessageBox extends Phaser.GameObjects.Container {
  private text: Phaser.GameObjects.Text;
  private container: Phaser.GameObjects.Rectangle;

  constructor(props: MessageBoxProps) {
    const margedProps = { ...initialProps, ...props };
    super(margedProps.scene, margedProps.x, margedProps.y);

    this.scene = margedProps.scene;
    this.scene.add.existing(this);

    this.setSize(margedProps.width, margedProps.height);

    const alignLeft = margedProps.align === "left";

    this.text = this.scene.add
      .text(alignLeft ? -margedProps.width / 2 + 0 : 0, -1, margedProps.text, {
        align: margedProps.align,
        fontSize: margedProps.fontSize,
        color: margedProps.textColor,
        fontFamily: margedProps.fontFamily,
      })
      .setOrigin(alignLeft ? 0 : 0.5, 0.5)
      .setPadding(0, 0, 0, 0);

    if (props.textColor) {
      this.text.setColor(props.textColor);
    }
  
    this.container = this.scene.add.rectangle(
      0,
      0,
      margedProps.width,
      margedProps.height,
      margedProps.backgroundColor,
      margedProps.backgroundAlpha
    );
    this.container
      .setStrokeStyle(1, margedProps.borderColor)
      .setOrigin(alignLeft ? 0 : 0.5, 0.5);

    this.add(this.container);
    this.add(this.text);
  }
}

interface MessageBoxProps {
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
  backgroundColor?: number | undefined;
  backgroundAlpha?: number | undefined;
  borderColor?: number | undefined;
  borderAlpha?: number | undefined;
}
