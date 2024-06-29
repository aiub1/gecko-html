class IntensityBar {
  // O construtor define as propriedades iniciais da barra de intensidade, como a posição, o jogador associado e a cor.
  constructor({ position, player, color = "rgb(0, 255, 0)" }) {
    // Referência ao jogador para a barra acompanhar sua posição
    this.player = player;
    // Posição inicial da barra de intensidade
    this.position = position;
    // Largura inicial da barra de intensidade, que será atualizada dinamicamente
    this.width = 0;
    // Altura fixa da barra de intensidade
    this.height = 4;
    // Cor da barra de intensidade, com valor padrão verde
    this.color = color;
  }

  // Método para atualizar a posição da barra de intensidade com base na posição do jogador
  updateIntensityBar() {
    this.position = {
      // As posições X e Y da barra é calculada com base na posição X do jogador, adicionando um deslocamento
      x: this.player.position.x + 33.5,
      y: this.player.position.y + 30,
    };
  }

  // Método para desenhar a barra de intensidade no canvas
  drawBar() {
    // Primeiro, atualiza a posição da barra de intensidade
    this.updateIntensityBar();
    // Define a cor de preenchimento da barra de intensidade
    c.fillStyle = this.color;
    // Desenha a barra de intensidade no canvas, com largura proporcional à intensidade (multiplicada por 2)
    c.fillRect(
      this.position.x,
      this.position.y,
      Math.abs(this.width * 2),
      this.height
    );
  }
}
