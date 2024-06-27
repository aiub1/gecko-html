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

const commandScreenPositionX = canvas.width / 2 + 40;
const commandScreenPositionY = canvas.height / 2;

const commandScreen = new Sprite({
  position: {
    x: commandScreenPositionX,
    y: commandScreenPositionY,
  },
  imageSrc: "./assets/ui/command_screen.png",
});

let commandScreenOpen = false;

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

const commandScreenButton = {
  x: commandScreen.width + 105,
  y: 110,
  width: 40,
  height: 40,
  textColor: "white",
};

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
      startBtn.updateImage("./assets/ui/menuBtn.png");
      controlsBtn.updateImage("./assets/ui/menuBtn.png");
      quitBtn.updateImage("./assets/ui/menuBtn.png");
      if (button.text === "JOGAR") {
        button.y -= 5;
        button.textColor = "yellow";
        setTimeout(() => {
          gameStarted = true;
          canvas.style.display = "block";
          canvas.classList.add("active");
          drawMenu();
          startTime();
        }, 300);
      } else if (button.text === "CONTROLES") {
        button.y -= 5;
        commandScreenOpen = true;
      } else if (button.text === "SAIR") {
        button.y -= 5;
        canvas.style.display = "none";
        canvas.classList.add("disabled");
        playPrompt.style.display = "flex";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        main.style.height = "100vh";
        main.style.overflow = "auto";
        music.pause();  
      }
    }
  });

  // Handle command screen button click
  if (commandScreenOpen) {
    if (
      offsetX >= commandScreenButton.x &&
      offsetX <= commandScreenButton.x + commandScreenButton.width &&
      offsetY >= commandScreenButton.y &&
      offsetY <= commandScreenButton.y + commandScreenButton.height
    ) {
      // Handle command screen button click action
      console.log("Command screen button clicked");
      commandScreenOpen = false;
      drawMenu();
    }
  }
});

function menuLoop() {
  if (!gameStarted) {
    drawMenu();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.onload = () => {
    console.log("menuBg image loaded");
    if (menuBg.loaded) menuLoop();
  };
});

menuBg.image.onerror = () => {
  console.error("Failed to load menuBg image");
};
