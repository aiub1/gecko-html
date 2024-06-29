// Definição dos sprites para o fundo do menu e botões do menu
const menuBg = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/ui/menu1.png",
});

const startBtn = new Sprite({
  position: {
    x: 405,
    y: 270,
  },
  imageSrc: "./assets/ui/menuBtn.png",
});

const controlsBtn = new Sprite({
  position: {
    x: 405,
    y: 355,
  },
  imageSrc: "./assets/ui/menuBtn.png",
});

const quitBtn = new Sprite({
  position: {
    x: 405,
    y: 439,
  },
  imageSrc: "./assets/ui/menuBtn.png",
});

// Posição da tela de comandos e criação do sprite para ela
const commandScreenPositionX = canvas.width / 2 + 40;
const commandScreenPositionY = canvas.height / 2;

const commandScreen = new Sprite({
  position: {
    x: commandScreenPositionX,
    y: commandScreenPositionY,
  },
  imageSrc: "./assets/ui/command_screen.png",
});

let commandScreenOpen = false; // Flag para indicar se a tela de comandos está aberta

// Configuração dos botões do menu
const buttons = [
  {
    text: "JOGAR",
    x: 407,
    y: 270,
    width: 207,
    height: 65,
    textColor: "white",
    name: "startBtn",
  },
  {
    text: "CONTROLES",
    x: 407,
    y: 355,
    width: 207,
    height: 65,
    textColor: "white",
    name: "controlsBtn",
  },
  {
    text: "SAIR",
    x: 407,
    y: 439,
    width: 207,
    height: 65,
    textColor: "white",
    name: "quitBtn",
  },
];

// Configuração do botão na tela de comandos
const commandScreenButton = {
  x: commandScreen.width + 105,
  y: 110,
  width: 40,
  height: 40,
  textColor: "white",
};

// Função para desenhar um botão no canvas
function drawButton(button, hover = false) {
  c.fillStyle = "transparent";
  c.fillRect(button.x, button.y, button.width, button.height);

  c.fillStyle = button.textColor;
  c.font = "24px joystix";

  const textMetrics = c.measureText(button.text);
  const textWidth = textMetrics.width;
  const textHeight = 30;

  const textX = button.x + (button.width - textWidth) / 2;
  const textY = button.y + (button.height - 12 + textHeight / 2) / 2;

  c.fillText(button.text, textX, textY);
  if (commandScreenOpen) drawCommandScreen();
}

// Função para desenhar a tela de comandos no canvas
function drawCommandScreen() {
  commandScreen.update();
  c.fillStyle = "transparent";
  c.fillRect(
    commandScreenButton.x,
    commandScreenButton.y,
    commandScreenButton.width,
    commandScreenButton.height
  );
}

// Função para desenhar o menu principal no canvas
function drawMenu() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  if (menuBg.loaded) {
    menuBg.update();
    startBtn.update();
    controlsBtn.update();
    quitBtn.update();
  } else {
    console.log("menuBg not loaded yet");
  }
  buttons.forEach((button) => drawButton(button));
}

// Evento de movimento do mouse para detectar hover nos botões do menu
canvas.addEventListener("mousemove", (e) => {
  const { offsetX, offsetY } = e;
  let cursor = "default";
  buttons.forEach((button) => {
    const hover =
      offsetX >= button.x &&
      offsetX <= button.x + button.width &&
      offsetY >= button.y &&
      offsetY <= button.y + button.height;
    drawButton(button, hover);
    if (hover && !gameStarted) {
      button.textColor = "yellow";
      cursor = "pointer";
    } else {
      button.textColor = "white";
    }
  });
  canvas.style.cursor = cursor;
  if (!commandScreenOpen) drawMenu();
});

// Evento de clique do mouse nos botões do menu
canvas.addEventListener("mousedown", (e) => {
  const { offsetX, offsetY } = e;
  buttons.forEach((button) => {
    if (
      !gameStarted &&
      offsetX >= button.x &&
      offsetX <= button.x + button.width &&
      offsetY >= button.y &&
      offsetY <= button.y + button.height
    ) {
      button.y += 5;
      button.textColor = "rgb(242, 233, 16)";

      // Ações específicas para cada botão do menu
      if (button.name === "startBtn") {
        startBtn.updateImage("./assets/ui/pressedBtn.png");
        startBtn.image.onload = () => drawMenu();
      } else if (button.name === "controlsBtn") {
        controlsBtn.updateImage("./assets/ui/pressedBtn.png");
        controlsBtn.y -= 50;
        controlsBtn.image.onload = () => drawMenu();
      } else if (button.name === "quitBtn") {
        quitBtn.updateImage("./assets/ui/pressedBtn.png");
        quitBtn.image.onload = () => drawMenu();
      }
    }
  });
});

// Evento de liberação do clique do mouse nos botões do menu
canvas.addEventListener("mouseup", (e) => {
  const { offsetX, offsetY } = e;
  buttons.forEach((button) => {
    if (
      !gameStarted &&
      offsetX >= button.x &&
      offsetX <= button.x + button.width &&
      offsetY >= button.y &&
      offsetY <= button.y + button.height
    ) {
      // Restaura a imagem dos botões após o clique
      startBtn.updateImage("./assets/ui/menuBtn.png");
      controlsBtn.updateImage("./assets/ui/menuBtn.png");
      quitBtn.updateImage("./assets/ui/menuBtn.png");

      // Ações específicas para cada botão do menu
      if (button.text === "JOGAR") {
        button.y -= 5;
        button.textColor = "yellow";
        setTimeout(() => {
          gameStarted = true; // Inicia o jogo após um pequeno atraso
          canvas.style.display = "block";
          canvas.classList.add("active");
          drawMenu();
          startTime();
        }, 300);
      } else if (button.text === "CONTROLES") {
        button.y -= 5;
        commandScreenOpen = true; // Abre a tela de comandos
      } else if (button.text === "SAIR") {
        button.y -= 5;
        canvas.style.display = "none"; // Esconde o canvas do jogo
        canvas.classList.add("disabled");
        playPrompt.style.display = "flex";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        main.style.height = "100vh";
        main.style.overflow = "auto";
        music.pause(); // Pausa a música de fundo, se houver
        music.currentTime = 0;
      }
    }
  });

  // Implementa o botão X da tela de controles
  if (commandScreenOpen) {
    if (
      offsetX >= commandScreenButton.x &&
      offsetX <= commandScreenButton.x + commandScreenButton.width &&
      offsetY >= commandScreenButton.y &&
      offsetY <= commandScreenButton.y + commandScreenButton.height
    ) {
      // Ação ao clicar no botão da tela de comandos
      console.log("Command screen button clicked");
      commandScreenOpen = false; // Fecha a tela de comandos
      drawMenu();
    }
  }
});

// Função principal de renderização do menu
function menuLoop() {
  if (!gameStarted) {
    drawMenu();
  }
}

// Evento disparado quando a página HTML é carregada
window.addEventListener("DOMContentLoaded", () => {
  window.onload = () => {
    console.log("menuBg image loaded");
    if (menuBg.loaded) menuLoop(); // Inicia o loop de renderização do menu quando a imagem de fundo é carregada
  };
});

// Tratamento de erro caso a imagem de fundo do menu não seja carregada corretamente
menuBg.image.onerror = () => {
  console.error("Failed to load menuBg image");
};
