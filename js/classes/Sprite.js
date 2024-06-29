class Sprite {
  constructor({ position, imageSrc, frameRate = 1, scale = 1 }) {
    // Inicializa os atributos da classe com os valores fornecidos
    this.position = position; // Posição inicial do sprite
    this.scale = scale; // Escala do sprite (tamanho relativo)
    this.frameRate = frameRate; // Taxa de quadros por segundo para animação
    this.loaded = false; // Flag para indicar se a imagem foi carregada
    this.image = new Image(); // Cria um objeto Image do HTML5 para carregar a imagem do sprite
    
    // Evento disparado quando a imagem é carregada com sucesso
    this.image.onload = () => {
      // Calcula a largura e altura do sprite após o carregamento, considerando a escala e a taxa de quadros
      this.width = (this.image.width / this.frameRate) * this.scale;
      this.height = this.image.height * this.scale;
      this.loaded = true; // Marca a imagem como carregada
    };
    
    this.image.src = imageSrc; // Define a fonte da imagem para carregar
    this.image.onload(); // Força a carga imediata da imagem
    this.currentFrame = 0; // Frame atual da animação do sprite
    this.frameBuffer = 4; // Buffer de quadros para controlar a animação suave
    this.elapsedFrames = 0; // Contador de quadros decorridos desde o último frame atualizado
  }

  // Método para desenhar o sprite no canvas
  drawSprite() {
    if (!this.loaded) return; // Se a imagem não estiver carregada, sai do método

    // Define a área de recorte da imagem com base no frame atual e na taxa de quadros
    const cropbox = {
      position: {
        x: this.currentFrame * (this.image.width / this.frameRate), // Posição X no sprite (frame atual)
        y: 0, // Posição Y no sprite (fixa em 0, pois não há animação vertical)
      },
      width: this.image.width / this.frameRate, // Largura de um frame do sprite
      height: this.image.height, // Altura do sprite (constante para todos os frames)
    };

    // Desenha a imagem recortada no canvas na posição e escala especificadas
    c.drawImage(
      this.image, // Imagem a ser desenhada
      cropbox.position.x, // Posição X no sprite (recorte)
      cropbox.position.y, // Posição Y no sprite (recorte)
      cropbox.width, // Largura do frame do sprite
      cropbox.height, // Altura do sprite
      this.position.x, // Posição X no canvas onde a imagem será desenhada
      this.position.y, // Posição Y no canvas onde a imagem será desenhada
      this.width, // Largura da imagem no canvas (considerando a escala)
      this.height // Altura da imagem no canvas (considerando a escala)
    );
  }

  // Método para atualizar a imagem do sprite
  updateImage(newSrc) {
    this.image.src = newSrc; // Define uma nova fonte de imagem
    this.image.onload = () => {
      this.drawSprite(); // Redesenha o sprite quando a nova imagem é carregada
    };
  }

  // Método chamado a cada quadro para atualizar o estado do sprite
  update() {
    this.drawSprite(); // Desenha o sprite atualizado no canvas
    this.updateFrames(); // Atualiza o frame atual da animação do sprite
  }

  // Método para atualizar os quadros da animação
  updateFrames() {
    this.elapsedFrames++; // Incrementa o contador de quadros decorridos

    // Verifica se é necessário atualizar o frame atual com base no buffer de quadros
    if (this.elapsedFrames % this.frameBuffer === 0) {
      if (this.currentFrame < this.frameRate - 1) this.currentFrame++; // Avança para o próximo frame se não estiver no último
      else this.currentFrame = 0; // Volta ao primeiro frame se estiver no último
    }
  }
}
