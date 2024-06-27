class CollisionBlock {
  constructor({ position, width =16, height = 16 }) {
    this.position = position;
    this.width = width;
    this.height = height;
  }

  drawBlock() {
    c.fillStyle = "rgba(255, 0, 0, 0.0)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.drawBlock();
  }
}
