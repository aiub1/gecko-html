class CollisionBlock {
  // O construtor define as propriedades iniciais do bloco de colisão, como a posição, largura e altura.
  constructor({ position, width = 16, height = 16 }) {
    // Define a posição do bloco de colisão no canvas (x, y)
    this.position = position;
    // Define a largura do bloco de colisão, com valor padrão de 16 pixels
    this.width = width;
    // Define a altura do bloco de colisão, com valor padrão de 16 pixels
    this.height = height;
  }

  // Método para desenhar o bloco de colisão no canvas (Para visualização e debug)
  drawBlock() {
    c.fillStyle = "rgba(255, 0, 0, 0.0)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  // Método para atualizar o bloco de colisão a cada frame
  update() {
    this.drawBlock();
  }
}
