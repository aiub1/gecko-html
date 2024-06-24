class IntensityBar {
  constructor({ position, player }) {
    this.player = player;
    this.position = position;
    this.width = 0;
    this.height = 4;
  }

  updateIntensityBar() {
    this.position = {
      x: this.player.position.x + 30,
      y: this.player.position.y + 20,
    };
  }

  drawBar() {
    this.updateIntensityBar();
    c.fillStyle = "rgb(0, 255, 0)";
    c.fillRect(
      this.position.x,
      this.position.y,
      Math.abs(this.width * 2),
      this.height
    );
  }
}
