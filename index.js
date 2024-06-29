/////////////// MANIPULADOR HTML /////////////
const main = document.getElementById("main");
const overlay = document.getElementById("overlay");
const playBtn = document.getElementById("playBtn");
const playPrompt = document.getElementById("playPrompt");
const navButtons = document.querySelectorAll("#nav-scroll");
const sountrack = document.getElementById("music");
const winningScreen = document.getElementById("endStats");

// Função para rolar a página suavemente até um elemento específico
const scrollToElem = (element, position) => {
  element.scrollIntoView({
    behavior: "smooth",
    block: position,
    inline: "nearest",
  });
};

// Exibe o canvas, inicializa a música e atualiza o estilo do HTML
playBtn.addEventListener("click", () => { 
  window.scrollToElem = (playBtn, "start");
  playPrompt.style.display = "none";
  canvas.style.display = "block";
  canvas.classList.add("active");
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  main.style.height = "100%";
  main.style.overflow = "hidden";
  winningScreen.innerHTML = "";
  winningScreen.style.display = "none";
  music.play();
});

// Adiciona evento de clique nos botões de navegação para rolar a página até a seção correspondente
navButtons.forEach((button) => {
  const name = button.getAttribute("name");
  const scrollTo = document.getElementById(name);
  button.addEventListener("click", () => scrollToElem(scrollTo, "center"));
});

/////////////// CONFIGURAÇÃO DO CANVAS /////////////

canvas.width = 1024;
canvas.height = 576;

// Define as dimensões escaladas do canvas
const scaledCanvas = {
  width: canvas.width / 4,
  height: canvas.height / 4,
};

/////////////// DEFINIÇÃO DE BLOCOS DE COLISÃO ///////////////////

// Converte a matriz de colisões do chão em uma matriz 2D
const floorCollisions2D = [];
for (let i = 0; i < floorCollisions.length; i += 16) {
  floorCollisions2D.push(floorCollisions.slice(i, i + 16));
}

// Converte a matriz de colisões da parede esquerda em uma matriz 2D
const leftWallCollisions2D = [];
for (let i = 0; i < leftWallCollisions.length; i += 16) {
  leftWallCollisions2D.push(leftWallCollisions.slice(i, i + 16));
}

// Converte a matriz de colisões da parede direita em uma matriz 2D
const rightWallCollisions2D = [];
for (let i = 0; i < rightWallCollisions.length; i += 16) {
  rightWallCollisions2D.push(rightWallCollisions.slice(i, i + 16));
}

const collisionBlocks = [];
const leftWallCollisionBlocks = [];
const rightWallCollisionBlocks = [];

// Instancia blocos de colisão para o chão
floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 1737) {
      collisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
        })
      );
    }
  });
});

// Instancia blocos de colisão para a parede esquerda
leftWallCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 1737) {
      leftWallCollisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
          width: 8,
        })
      );
    }
  });
});

// Instancia blocos de colisão para a parede direita
rightWallCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 1737) {
      rightWallCollisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16 + 8,
            y: y * 16,
          },
          width: 8,
        })
      );
    }
  });
});

////////////////// INICIALIZAÇÃO E CONFIGURAÇÕES GERAIS //////////////////

// Variaveis auxiliares
let intensity = 0;
let lastIntetensity = 0;
let counting = false;
let timer = null;

const backgroundImageHeight = 4096;

// Instancia o sprite da maçã divina
const divineApple = new Sprite({
  position: {
    x: 85,
    y: 50,
  },
  imageSrc: "./assets/sprites/environment/apple.png",
});

// Instancia o objeto do jogador
const player = new Player({
  canvas,
  position: {
    x: 100,
    y: 3980,
  },
  backgroundImageHeight,
  divineApple,
  collisionBlocks,
  leftWallCollisionBlocks,
  rightWallCollisionBlocks,
  imageSrc: "./assets/sprites/player/Idle2.png",
  frameRate: 8,
  animations: {
    Idle: {
      imageSrc: "./assets/sprites/player/Idle2.png",
      frameRate: 8,
      frameBuffer: 9,
    },
    IdleLeft: {
      imageSrc: "./assets/sprites/player/IdleLeft.png",
      frameRate: 8,
      frameBuffer: 9,
    },
    Run: {
      imageSrc: "./assets/sprites/player/Run2.png",
      frameRate: 8,
      frameBuffer: 3,
    },
    RunLeft: {
      imageSrc: "./assets/sprites/player/RunLeft.png",
      frameRate: 8,
      frameBuffer: 3,
    },
    Jump: {
      imageSrc: "./assets/sprites/player/Jump.png",
      frameRate: 2,
      frameBuffer: 7,
    },
    JumpLeft: {
      imageSrc: "./assets/sprites/player/JumpLeft.png",
      frameRate: 2,
      frameBuffer: 7,
    },
    Fall: {
      imageSrc: "./assets/sprites/player/Fall.png",
      frameRate: 2,
      frameBuffer: 7,
    },
    FallLeft: {
      imageSrc: "./assets/sprites/player/FallLeft.png",
      frameRate: 2,
      frameBuffer: 7,
    },
  },
});

// Instancia o objeto do background
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/GECKO_LVL_3.png",
});

// Instancia o objeto da barra de intensidade
const intensityBar = new IntensityBar({
  position: {
    x: 0,
    y: 0,
  },
  player,
});

// Objeto que armazena o estado das teclas pressionadas
const keys = {
  KeyD: {
    pressed: false,
    lastPressed: false,
  },
  KeyA: {
    pressed: false,
    lastPressed: false,
  },
  KeyW: {
    lastPressed: false,
  },
  Space: {
    pressed: false,
  },
};

// Instancia o objeto da camera
const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + scaledCanvas.height,
  },
};

///////////////////////////// METODO DE RESET ///////////////////////////////

// Função para resetar o estado o gameloop
function gameReset() {
  if (gameReseted && gameStarted) {
    player.position.x = 100;
    player.position.y = 3980;
    divineApple.position.x = 85;
    divineApple.position.y = 50;
    camera.position.x = 0;
    camera.position.y = -backgroundImageHeight + scaledCanvas.height;

    canvas.style.display = "none"; // Esconde o canvas do jogo
    canvas.classList.add("disabled");
    playPrompt.style.display = "flex";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    main.style.height = "100vh";
    main.style.overflow = "auto";
    music.pause(); // Pausa a música de fundo, se houver
    music.currentTime = 0;

    winningScreen.innerHTML = `
    <div class="endStats__title__container">
        <i class="fa-solid fa-trophy"></i>
        <h2 class="endStats__title">VOCÊ VENCEU!</h2>
        <p class="endStats__subtext">Obrigado por jogar!</p>
      </div>
      <div class="endStats___text__container">
          <ul class="endStats__stats-title-list">
            <li class="stats-title__item"><p class="endStats__text">Seu tempo: </p> <p class="endStats__result">${getElapsedTime()}</p></li>
            <li class="stats-title__item"><p class="endStats__text">Total de pulos: <p class="endStats__result" >${jumpCounter}</p></p></li>
            <li class="stats-title__item"><p class="endStats__text">Total de quicadas: <p class="endStats__result">${bouncingCounter}</p></p></li>
          </ul>
      </div>`;
    winningScreen.style.display = "flex";
    scrollToElem(winningScreen, "start");

    jumpCounter = 0;
    bouncingCounter = 0;
    timeCounter = 0;

    gameStarted = false;
    gameReseted = false;
  } else if (gameReseted) {
    player.position.x = 100;
    player.position.y = 3980;
    player.velocity.x = 0;
    player.velocity.y = 0;
    divineApple.position.x = 85;
    divineApple.position.y = 50;
  }
}

///////////////////////// METODO DE RENDERIZAÇÃO ///////////////////////////

// Renderiza e atualiza o estado do jogo o máxima de frames por segundo que conseguir
function render() {
  window.requestAnimationFrame(render);

  gameReset();

  if (!gameStarted) return;

  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  c.save();
  c.scale(4, 4);
  c.translate(camera.position.x, camera.position.y);

  // Renderiza o background a maçã
  background.update();
  divineApple.update();

  // Renderiza os blocos de colisão
  collisionBlocks.forEach((collisionBlocks) => {
    collisionBlocks.update();
  });

  leftWallCollisionBlocks.forEach((leftWallCollisionBlocks) => {
    leftWallCollisionBlocks.update();
  });

  rightWallCollisionBlocks.forEach((rightWallCollisionBlocks) => {
    rightWallCollisionBlocks.update();
  });

  player.update();

  // Desenha e atualiza o cronômetro
  c.font = "7px joystix";
  c.fillStyle = "white";
  c.fillText(getElapsedTime(), 215, Math.abs(camera.position.y) + 12);

  // Conforme a tecla apertada move o jogador na respectiva direção e atualiza os srites
  if (
    keys.KeyA.pressed ||
    (player.velocity.x < 0 &&
      !(player.velocity.y < 0) &&
      (player.floorCollisionDetected || player.plataformCollisionBlocks))
  ) {
    player.switchSprite("RunLeft");
    player.velocity.x = -2;
  } else if (
    keys.KeyD.pressed ||
    (player.velocity.x > 0 &&
      !(player.velocity.y < 0) &&
      (player.floorCollisionDetected || player.plataformCollisionBlocks))
  ) {
    player.switchSprite("Run");
    player.velocity.x = 2;
  } else if (player.velocity.x === 0 && player.lastDirection === "left") {
    player.switchSprite("IdleLeft");
  } else if (player.velocity.x === 0) {
    player.switchSprite("Idle");
  }

  // Move a camera caso o jogador atinja o limite da tela e atualiza os sprites de pula e queda
  if (player.velocity.y < 0) {
    player.PanCameraDown({ canvas, camera });
    if (player.lastDirection === "right") player.switchSprite("Jump");
    else player.switchSprite("JumpLeft");
  } else if (player.velocity.y > 0) {
    player.PanCameraUp({ canvas, camera });
    if (player.lastDirection === "right") player.switchSprite("Fall");
    else player.switchSprite("FallLeft");
  }

  // Condição para fazer o jogador pular para a esquerda quando "A" foi a última tecla pressionada
  if (player.playerHasJumped && keys.KeyA.lastPressed === true)
    player.velocity.x = -2;

  // Condição para fazer o jogador pular para a direita quando "D" foi a última tecla pressionada
  if (player.playerHasJumped && keys.KeyD.lastPressed === true)
    player.velocity.x = 2;

  // Condição para fazer o jogador pular para cima quando "W" foi a última tecla pressionada
  if (player.playerHasJumped && keys.KeyW.lastPressed === true)
    player.velocity.x = 0;

  // Condição para manter o jogador parado ele não aperta nenhum comando
  if (player.floorCollisionDetected) {
    if (!keys.KeyA.pressed && !keys.KeyD.pressed) {
      player.velocity.y = 0;
      player.velocity.x = 0;
    }
  }

  // Condição para rebnderizar a barra de intensidade
  if (keys.Space.pressed) {
    player.velocity.x = 0;
    intensityBar.drawBar();
  }

  // Mecânica de rebote nas paredes
  if (player.wallCollisionDetected && !player.floorCollisionDetected) {
    player.velocity.x = player.velocity.x * -1;
    player.velocity.y = lastIntetensity / 1.5;
    keys.KeyA.lastPressed = false;
    keys.KeyD.lastPressed = false;
    bouncingCounter++;
  }

  // Reseta as teclas, mesmo se o jogador continuar segurando depois de pular
  if (player.playerHasJumped) {
    keys.KeyA.pressed = false;
    keys.KeyD.pressed = false;
    keys.Space.pressed = false;
  }

  c.restore();
}

render();

/////////////////////// MECÂNICA DE PULO /////////////////////////

// Função para aumentar a intensidade do pulo e atualizar a barra
function increaseIntensity() {
  if (keys.Space.pressed) {
    if (intensity <= -7) {
      intensity = -6;
      setTimeout(() => {
        intensity = 0;
        intensityBar.color = "rgb(0, 255,0)";
      }, 200);
    }
    intensity -= 1;
    console.log(intensity);
    if (intensity <= -7) {
      intensityBar.color = "red";
    } else if (intensity <= -4) {
      intensityBar.color = "yellow";
    }
    setTimeout(increaseIntensity, 115);
    intensityBar.width = intensity - 1;
  }
}

// Função principal da mecânica de pulo
function jumpCoreMechanic() {
  counting = false;
  player.velocity.y = intensity;
  player.playerHasJumped = true;
  lastIntetensity = intensity;
  intensityBar.width = 0;
  jumpCounter++;
}

///////////////////////// COMANDOS / MANIPULADORES DE TECLAS ///////////////////////////

window.addEventListener("keydown", (event) => {
  if (!player.playerHasJumped)
    if (player.floorCollisionDetected)
      switch (event.code) {
        case "KeyA":
          keys.KeyA.pressed = true;
          keys.KeyW.lastPressed = false;
          keys.KeyA.lastPressed = true;
          keys.KeyD.lastPressed = false;
          break;
        case "KeyD":
          keys.KeyD.pressed = true;
          keys.KeyW.lastPressed = false;
          keys.KeyD.lastPressed = true;
          keys.KeyA.lastPressed = false;
          break;
        case "KeyW":
          keys.KeyW.lastPressed = true;
          keys.KeyA.pressed = false;
          keys.KeyD.pressed = false;
          break;
        case "Space":
          if (player.velocity.y === 0 && !counting) {
            player.velocity.x = 0;
            keys.KeyA.pressed = false;
            keys.KeyD.pressed = false;
            keys.Space.pressed = true;
            counting = true;
            increaseIntensity();
            intensityBar.color = "rgb(0, 255,0)";
          }
          break;
      }
});

window.addEventListener("keyup", (event) => {
  switch (event.code) {
    case "KeyA":
      keys.KeyA.pressed = false;
      if (player.velocity.y >= 0) player.velocity.x = 0;
      break;
    case "KeyD":
      keys.KeyD.pressed = false;
      if (player.velocity.y >= 0) player.velocity.x = 0;
      break;
    case "Space":
      keys.Space.pressed = false;
      jumpCoreMechanic();
      intensity = 0;
  }
});
