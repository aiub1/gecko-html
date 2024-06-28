/////////////// HTML CONFIG /////////////
const main = document.getElementById("main");
const overlay = document.getElementById("overlay");
const playBtn = document.getElementById("playBtn");
const playPrompt = document.getElementById("playPrompt");
const navButtons = document.querySelectorAll("#nav-scroll");
const sountrack = document.getElementById("music");

const scrollToElem = (element, position) => {
  element.scrollIntoView({
    behavior: "smooth",
    block: position,
    inline: "nearest",
  });
};

// TODO: UNFREEZE PAGE SCROLLING WHEN THE PLAYER QUITS THE GAME
playBtn.addEventListener("click", () => {
  window.scrollToElem = (playBtn, "start");
  playPrompt.style.display = "none";
  canvas.style.display = "block";
  canvas.classList.add("active");
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  main.style.height = "100%";
  main.style.overflow = "hidden";
  music.play();
});

navButtons.forEach((button) => {
  const name = button.getAttribute("name");
  const scrollTo = document.getElementById(name);
  button.addEventListener("click", () => scrollToElem(scrollTo, "center"));
});

/////////////// CANVAS CONFIG /////////////

canvas.width = 1024;
canvas.height = 576;

const scaledCanvas = {
  width: canvas.width / 4,
  height: canvas.height / 4,
};

/////////////// DEFINE COLLISION BLOCKS ///////////////////

const floorCollisions2D = [];
for (let i = 0; i < floorCollisions.length; i += 16) {
  floorCollisions2D.push(floorCollisions.slice(i, i + 16));
}

const leftWallCollisions2D = [];
for (let i = 0; i < leftWallCollisions.length; i += 16) {
  leftWallCollisions2D.push(leftWallCollisions.slice(i, i + 16));
}

const rightWallCollisions2D = [];
for (let i = 0; i < rightWallCollisions.length; i += 16) {
  rightWallCollisions2D.push(rightWallCollisions.slice(i, i + 16));
}

// TODO: REMOVE PLATAFORM COLLISIONS
const plataformCollisions2D = [];
for (let i = 0; i < plataformCollisions.length; i += 36) {
  plataformCollisions2D.push(plataformCollisions.slice(i, i + 36));
}

const collisionBlocks = [];
const leftWallCollisionBlocks = [];
const rightWallCollisionBlocks = [];
const plataformCollisionBlocks = [];

plataformCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      plataformCollisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
          height: 4,
        })
      );
    }
  });
});

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

////////////////// OVERALL CONFIGURATIONS //////////////////
let intensity = 0;
let lastIntetensity = 0;
let counting = false;
let timer = null;

const backgroundImageHeight = 4096;

const divineApple = new Sprite({
  position: {
    x: 85,
    y: 50,
  },
  imageSrc: "./assets/sprites/environment/apple.png",
});

const player = new Player({
  canvas,
  position: {
    x: 100,
    //y: 0
    y: 3980,
  },
  backgroundImageHeight,
  divineApple,
  collisionBlocks,
  leftWallCollisionBlocks,
  rightWallCollisionBlocks,
  plataformCollisionBlocks,
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

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/GECKO_LVL_3.png",
});

const intensityBar = new IntensityBar({
  position: {
    x: 0,
    y: 0,
  },
  player,
});

// Object the stores the last key pressed and the key being pressed at the moment
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

///////////////////////// MAIN RENDERER ///////////////////////////
const camera = {
  position: {
    x: 0,
    //y: 0
    y: -backgroundImageHeight + scaledCanvas.height,
  },
};

function render() {
  window.requestAnimationFrame(render);

  if (!gameStarted) return;

  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  c.save();
  c.scale(4, 4);
  c.translate(camera.position.x, camera.position.y);

  background.update();
  divineApple.update();

  collisionBlocks.forEach((collisionBlocks) => {
    collisionBlocks.update();
  });

  leftWallCollisionBlocks.forEach((leftWallCollisionBlocks) => {
    leftWallCollisionBlocks.update();
  });

  rightWallCollisionBlocks.forEach((rightWallCollisionBlocks) => {
    rightWallCollisionBlocks.update();
  });

  plataformCollisionBlocks.forEach((plataformCollisionBlocks) => {
    plataformCollisionBlocks.update();
  });

  player.update();

  // DRAW AND UPDATE TIMER
  c.font = "7px joystix";
  c.fillStyle = "white";
  c.fillText(getElapsedTime(), 215, Math.abs(camera.position.y) + 12);

  // If the a direction key is being pressed and the player is on the ground moves the player to the direction
  if (
    keys.KeyA.pressed ||
    (player.velocity.x < 0 &&
      !(player.velocity.y < 0) &&
      (player.floorCollisionDetected || player.plataformCollisionBlocks))
  ) {
    player.switchSprite("RunLeft");
    player.velocity.x = -2;
    player.PanCameraToTheRight({ canvas, camera }); ///////////////////////////////////// MOVE IT ////////////////////////////////////////
  } else if (
    keys.KeyD.pressed ||
    (player.velocity.x > 0 &&
      !(player.velocity.y < 0) &&
      (player.floorCollisionDetected || player.plataformCollisionBlocks))
  ) {
    player.switchSprite("Run");
    player.velocity.x = 2;
    player.PanCameraToTheLeft({ canvas, camera }); ///////////////////////////////////// MOVE IT ////////////////////////////////////////
  } else if (player.velocity.x === 0 && player.lastDirection === "left") {
    player.switchSprite("IdleLeft");
  } else if (player.velocity.x === 0) {
    player.switchSprite("Idle");
  }

  if (player.velocity.y < 0) {
    player.PanCameraDown({ canvas, camera });
    if (player.lastDirection === "right") player.switchSprite("Jump");
    else player.switchSprite("JumpLeft");
  } else if (player.velocity.y > 0) {
    player.PanCameraUp({ canvas, camera });
    if (player.lastDirection === "right") player.switchSprite("Fall");
    else player.switchSprite("FallLeft");
  }

  // Condition to make the player jump left when "A" was last pressed
  if (player.playerHasJumped && keys.KeyA.lastPressed === true)
    player.velocity.x = -2;

  // Condition to make the player jump right when "D" was last pressed
  if (player.playerHasJumped && keys.KeyD.lastPressed === true)
    player.velocity.x = 2;

  // Condition to make the player jump up when "W" was last pressed
  if (player.playerHasJumped && keys.KeyW.lastPressed === true)
    player.velocity.x = 0;

  if (player.floorCollisionDetected) {
    if (!keys.KeyA.pressed && !keys.KeyD.pressed) {
      player.velocity.y = 0;
      player.velocity.x = 0;
    }
  }

  if (player.plataformCollisionDetected) {
    if (!keys.KeyA.pressed && !keys.KeyD.pressed) {
      player.velocity.y = 0;
      player.velocity.x = 0;
      player.playerHasJumped = false;
      player.plataformCollisionDetected = false;
      player.floorCollisionDetected = true;
    }
  }

  if (!player.floorCollisionDetected) {
    player.plataformCollisionDetected = false;
  }

  // console.log(player.plataformCollisionDetected);

  if (keys.Space.pressed) {
    player.velocity.x = 0;
    intensityBar.drawBar();
  }

  // Bouncing off the walls mechanic
  if (player.wallCollisionDetected && !player.floorCollisionDetected) {
    player.velocity.x = player.velocity.x * -1;
    player.velocity.y = lastIntetensity / 1.5;
    keys.KeyA.lastPressed = false;
    keys.KeyD.lastPressed = false;
  }

  // Reset the keys, even if the player keeps holding and never releases it
  if (player.playerHasJumped) {
    keys.KeyA.pressed = false;
    keys.KeyD.pressed = false;
    keys.Space.pressed = false;
  }

  c.restore();
}

render();

/////////////////////// JUMP MECHANIC /////////////////////////

function increaseIntensity() {
  if ( keys.Space.pressed) {
    if (intensity <= -7) {
      intensity = -6;
      setTimeout(() => {
        intensity = 0
        intensityBar.color = "rgb(0, 255,0)"
      }, 200);
    }
      intensity -= 1;
    console.log(intensity);
    if (intensity <= -7) {
      intensityBar.color = "red"
    } else if (intensity <= -4) {
      intensityBar.color = "yellow"
    }
      setTimeout(increaseIntensity, 115);
      intensityBar.width = intensity - 1;
  }
}

function jumpCoreMechanic() {
  counting = false;
  player.velocity.y = intensity;
  player.playerHasJumped = true;
  lastIntetensity = intensity;
  // if (player.floorCollisionDetected) intensity = 0;
  intensityBar.width = 0;
}

///////////////////////// COMMANDS / KEY HANDLERS ///////////////////////////

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
            {
              keys.KeyD.pressed = false;
              keys.Space.pressed = true;
              counting = true;
              increaseIntensity();
              intensityBar.color = "rgb(0, 255,0)"
            }
            break;
          }
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
      intensity = 0
  }
});
