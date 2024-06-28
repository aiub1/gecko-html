class IntensityBar {
  constructor({ position, player, color = "rgb(0, 255, 0)" }) {
    this.player = player;
    this.position = position;
    this.width = 0;
    this.height = 4;
    this.color = color
  }

  updateIntensityBar() {
    this.position = {
      x: this.player.position.x + 33.5,
      y: this.player.position.y + 30,
    };
  }

  drawBar() {
    this.updateIntensityBar();
    c.fillStyle = this.color;
    c.fillRect(
      this.position.x,
      this.position.y,
      Math.abs(this.width * 2),
      this.height
    );
  }
}
