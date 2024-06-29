class Player extends Sprite {
  // O construtor inicializa as propriedades do jogador.
  constructor({
    canvas,
    position,
    backgroundImageHeight,
    divineApple,
    collisionBlocks,
    leftWallCollisionBlocks,
    rightWallCollisionBlocks,
    imageSrc,
    frameRate,
    scale = 0.5,
    animations,
  }) {
    super({ imageSrc, frameRate, scale }); // Chama o construtor da classe base (Sprite)
    this.canvas = canvas; // Canvas onde o jogador será desenhado
    this.position = position; // Posição inicial do jogador
    this.velocity = { // Velocidade de movimentação do jogador, Y inicia pora o efeito de simulação de gravidade
      x: 0,
      y: 1,
    };

    this.divineApple = divineApple; // Referência para da posição da maçã divina, utilizada para cghecar a colisão do player com o objeto
    this.backgroundImageHeight = backgroundImageHeight; // Altura da imagem de fundo

    this.collisionBlocks = collisionBlocks; // Blocos de colisão comuns
    this.leftWallCollisionBlocks = leftWallCollisionBlocks; // Blocos de colisão da parede esquerda
    this.rightWallCollisionBlocks = rightWallCollisionBlocks; // Blocos de colisão da parede direita

    this.hitbox = { // Definição da hitbox do jogador
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 0,
      height: 0,
    };

    this.floorCollisionDetected = false; // Verificação de colisão com o chão
    this.wallCollisionDetected = false; // Verificação de colisão com a parede
    this.lastDirection = "right"; // Última direção em que o jogador se moveu
    this.playerHasJumped = false; // Verificação se o jogador pulou

    // Inicializa as animações do jogador
    this.animations = animations;

    // Cria objetos Image para cada sprite na animação
    for (let key in this.animations) {
      const image = new Image();
      image.src = this.animations[key].imageSrc;

      this.animations[key].image = image;
    }

    // Definição da caixa da câmera
    this.cameraBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 200,
      height: 85,
    };
  }

  // Troca o sprite do jogador
  switchSprite(key) {
    if (this.image === this.animations[key].image || !this.loaded) return;

    this.currentFrame = 0;
    this.image = this.animations[key].image;
    this.frameBuffer = this.animations[key].frameBuffer;
    this.frameRate = this.animations[key].frameRate;
  }

  // Atualiza a posição da caixa da câmera conforme o jogador se move
  updateCameraBox() {
    this.cameraBox = {
      position: {
        x: this.position.x - 60,
        y: this.position.y,
      },
      width: 200,
      height: 85,
    };
  }

  // Move a câmera para baixo conforme o jogador se move
  PanCameraDown({ canvas, camera }) {
    const cameraBoxTop = this.cameraBox.position.y;

    if (cameraBoxTop + this.velocity.y <= 0) return;

    if (cameraBoxTop <= Math.abs(camera.position.y)) {
      camera.position.y -= this.velocity.y;
    }
  }

  // Move a câmera para cima conforme o jogador se move
  PanCameraUp({ canvas, camera }) {
    const cameraBoxBottom = this.cameraBox.position.y + this.cameraBox.height;
    const scaledCanvasHeight = canvas.height / 4;

    if (cameraBoxBottom + this.velocity.y >= this.backgroundImageHeight) return;

    if (cameraBoxBottom >= Math.abs(camera.position.y) + scaledCanvasHeight) {
      camera.position.y -= this.velocity.y;
    }
  }

  // Atualiza os atributos do jogador a cada frame
  update() {
    this.updateFrames();
    this.updateHitbox();
    this.updateCameraBox();

    // Este trecho desenha a caixa da câmera para visualização
    // c.fillStyle = "rgba(0, 0, 255, 0.2)";
    // c.fillRect(
    //   this.cameraBox.position.x,
    //   this.cameraBox.position.y,
    //   this.cameraBox.width,
    //   this.cameraBox.height
    // );

    // Este trecho desenha o tamanho completo do arquivo de sprite da imagem
    // c.fillStyle = "rgba(0, 255, 0, 0.2)";
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);

    // Este trecho desenha a hitbox para visualização
    // c.fillStyle = "rgba(255, 0, 0, 0.2)";
    // c.fillRect(
    //   this.hitbox.position.x,
    //   this.hitbox.position.y,
    //   this.hitbox.width,
    //   this.hitbox.height
    // );

    this.drawSprite();

    this.position.x += this.velocity.x;
    this.updateHitbox();
    this.checkForHorizontalCollisions();
    this.applyGravity();
    this.updateHitbox();
    this.checkForFloorCollisions();
    this.checkForVerticalCollisions();
    this.checkAppleCollision();
    this.updateLastDirection();
    // console.log(this.velocity.y);
  }

  // Atualiza a posição da hitbox para seguir o jogador
  updateHitbox() {
    this.hitbox = {
      position: {
        x: this.position.x + 35.5,
        y: this.position.y + 38,
      },
      width: 12,
      height: 15,
    };
  }

  // Aplica a gravidade ao jogador
  applyGravity() {
    this.velocity.y += gravity;
    this.position.y += this.velocity.y;
  }

  // Verifica colisões na direção horizontal
  checkForHorizontalCollisions() {
    this.wallCollisionDetected = false;

    // Impede o jogador de se mover fora do canvas
    if (this.hitbox.position.x <= 0) {
      this.velocity.x = 0;
      const offset = this.hitbox.position.x - this.position.x;
      this.position.x = 0 - offset - 0.01;
    }

    if (this.hitbox.position.x + this.hitbox.width >= 256) {
      // NOTA: FAZER O VALOR SER DINÂMICO MAIS TARDE
      this.velocity.x = 0;
      const offset =
        this.hitbox.position.x - this.position.x + this.hitbox.width;
      this.position.x = 256 - offset - 0.01;
    }

    // Verifica colisão horizontal com blocos de colisão comuns
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (
        collision({
          object1: this.hitbox,
          object2: collisionBlock,
          canvas: this.canvas,
        })
      ) {
        this.wallCollisionDetected = true;
        if (this.velocity.x > 0) {
          this.velocity.x = 0;
          this.velocity.y = 0;

          const offset =
            this.hitbox.position.x - this.position.x + this.hitbox.width;

          this.position.x = collisionBlock.position.x - offset - 0.01;
        }

        if (this.velocity.x < 0) {
          const offset = this.hitbox.position.x - this.position.x;

          this.velocity.x = 0;
          this.velocity.y = 0;
          this.position.x =
            collisionBlock.position.x + collisionBlock.width - offset + 0.01;
        }
      }
    }

    // Verifica colisão horizontal com blocos de colisão da parede esquerda
    for (let i = 0; i < this.leftWallCollisionBlocks.length; i++) {
      const leftWallCollisionBlock = this.leftWallCollisionBlocks[i];

      if (
        collision({
          object1: this.hitbox,
          object2: leftWallCollisionBlock,
          canvas: this.canvas,
        })
      ) {
        this.wallCollisionDetected = true;
        if (this.velocity.x > 0) {
          this.velocity.x = 0;
          this.velocity.y = 0;

          const offset =
            this.hitbox.position.x - this.position.x + this.hitbox.width;

          this.position.x = leftWallCollisionBlock.position.x - offset - 0.01;
        }

        if (this.velocity.x < 0) {
          const offset = this.hitbox.position.x - this.position.x;

          this.velocity.x = 0;
          this.velocity.y = 0;
          this.position.x =
            leftWallCollisionBlock.position.x + leftWallCollisionBlock.width - offset + 0.01;
        }
      }
    }

    // Verifica colisão horizontal com blocos de colisão da parede direita
    for (let i = 0; i < this.rightWallCollisionBlocks.length; i++) {
      const rightWallCollisionBlock = this.rightWallCollisionBlocks[i];

      if (
        collision({
          object1: this.hitbox,
          object2: rightWallCollisionBlock,
          canvas: this.canvas,
        })
      ) {
        this.wallCollisionDetected = true;
        if (this.velocity.x > 0) {
          this.velocity.x = 0;
          this.velocity.y = 0;

          const offset =
            this.hitbox.position.x - this.position.x + this.hitbox.width;

          this.position.x = rightWallCollisionBlock.position.x - offset - 0.01;
        }

        if (this.velocity.x < 0) {
          const offset = this.hitbox.position.x - this.position.x;

          this.velocity.x = 0;
          this.velocity.y = 0;
          this.position.x =
            rightWallCollisionBlock.position.x + rightWallCollisionBlock.width - offset + 0.01;
        }
      }
    }
  }

  // Verifica colisões na direção vertical
  checkForVerticalCollisions() {
    // Verifica colisão vertical com blocos de colisão comuns
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (
        collision({
          object1: this.hitbox,
          object2: collisionBlock,
          canvas: this.canvas,
        })
      ) {
        if (this.velocity.y > 0) {
          this.floorCollisionDetected = true;
          this.playerHasJumped = false;
          this.velocity.y = 0;

          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;
          this.position.y = collisionBlock.position.y - offset - 0.01;
        }

        if (this.velocity.y < 0) {
          // this.floorCollisionDetected = true;
          this.playerHasJumped = false;
          this.velocity.y = 0;

          const offset = this.hitbox.position.y - this.position.y;
          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.05;
        }
      }
    }
  }

  // Verifica se o jogador está no chão
  checkForFloorCollisions() {
    // Detecção de colisões com blocos de colisão comuns
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (
        floorCollision({
          player: this,
          object1: this.hitbox,
          object2: collisionBlock,
        })
      ) {
        this.floorCollisionDetected = true;
        this.playerHasJumped = false;
      } else {
        this.floorCollisionDetected = false;
      }
    }
  }

  // Mantém o rastreamento da última direção do jogador
  // Usado para troca de sprite e mecânica de rebote nas paredes
  updateLastDirection() {
    if (this.velocity.x > 0) {
      this.lastDirection = "right";
    } else if (this.velocity.x < 0) {
      this.lastDirection = "left";
    }
  }

  // Verifica colisão com a "divineApple"
  checkAppleCollision() {
    if (
      collision({
        object1: this.hitbox,
        object2: this.divineApple,
        canvas: this.canvas,
      })
    ) {
      this.divineApple.position.x = -20;
      console.log("VOCÊ VENCEU!");
      console.log("Your time: " + getElapsedTime());
      gameReseted = true;
    }
  }
}
