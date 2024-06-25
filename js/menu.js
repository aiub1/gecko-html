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

function drawButton(button, hover = false) {
  c.fillStyle = "transparent";
  c.fillRect(button.x, button.y, button.width, button.height);

  c.fillStyle = button.textColor;
  c.font = "24px joystix";

  // Calculate the text width and height
  const textMetrics = c.measureText(button.text);
  const textWidth = textMetrics.width;
  const textHeight = 30; // Approximate height for 30px Arial font

  // Calculate the position to center the text
  const textX = button.x + (button.width - textWidth) / 2;
  const textY = button.y + (button.height - 12 + textHeight / 2) / 2;

  c.fillText(button.text, textX, textY);
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
  drawMenu();
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
        startBtn.image.onload = () => drawMenu(); // Redraw menu once image is loaded
      } else if (button.name === "controlsBtn") {
        controlsBtn.updateImage("./assets/ui/pressedBtn.png");
        controlsBtn.y -= 50;
        (controlsBtn.image.onload = () => drawMenu()), drawButton(button); // Redraw menu once image is loaded
      } else if (button.name === "quitBtn") {
        quitBtn.updateImage("./assets/ui/pressedBtn.png");
        quitBtn.image.onload = () => drawMenu(); // Redraw menu once image is loaded
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
        }, 300);
      } else if (button.text === "CONTROLES") {
        button.y -= 5;
        alert("TELA DE CONTROLES");
      } else if (button.text === "SAIR") {
        button.y -= 5;
        canvas.style.display = "none";
        canvas.classList.add("disabled");
      }
    }
  });
});

function menuLoop() {
  if (!gameStarted) {
    drawMenu();
    window.requestAnimationFrame(menuLoop);
  }
}

// Ensure the menuBg image is loaded before starting the game loop
window.addEventListener("DOMContentLoaded", () => {
  window.onload = () => {
    console.log("menuBg image loaded");
    if (menuBg.loaded = true) menuLoop();
  };
});

menuBg.image.onerror = () => {
  console.error("Failed to load menuBg image");
};
