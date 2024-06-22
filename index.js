/////////////// Canvas Config /////////////
const playBtn = document.getElementById("playBtn");
const playPrompt = document.getElementById("playPrompt");
const navButtons = document.querySelectorAll("#nav-scroll");
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const scaledCanvas = {
  width: canvas.height / 4,
  height: canvas.height / 4,
};

playBtn.addEventListener('click', () => {
  playPrompt.style.display = 'none';
  canvas.style.display = 'block';
})


const scrollToElem = (element) => {
  element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
}

navButtons.forEach(button => {
  const name = button.getAttribute("name");
  const scrollTo = document.getElementById(name);
  button.addEventListener('click', () => scrollToElem(scrollTo))
});

/////////////// DEFINE COLLISION BLOCKS ///////////////////

const floorCollisions2D = [];
for (let i = 0; i < floorCollisions.length; i += 36) {
  floorCollisions2D.push(floorCollisions.slice(i, i + 36));
}

const plataformCollisions2D = [];
for (let i = 0; i < plataformCollisions.length; i += 36) {
  plataformCollisions2D.push(plataformCollisions.slice(i, i + 36));
}

const collisionBlocks = [];
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
    if (symbol === 202) {
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

////////////////// OVERALL CONFIGURATIONS //////////////////

const gravity = 0.2;

const player = new Player({
  canvas,
  position: {
    x: 100,
    y: 350,
  },
  collisionBlocks,
  plataformCollisionBlocks,
  imageSrc: "./assets/sprites/player/Idle.png",
  frameRate: 8,
  animations: {
    Idle: {
      imageSrc: "./assets/sprites/player/Idle.png",
      frameRate: 8,
      frameBuffer: 5,
    },
    IdleLeft: {
      imageSrc: "./assets/sprites/player/IdleLeft.png",
      frameRate: 8,
      frameBuffer: 5,
    },
    Run: {
      imageSrc: "./assets/sprites/player/Run.png",
      frameRate: 8,
      frameBuffer: 5,
    },
    RunLeft: {
      imageSrc: "./assets/sprites/player/RunLeft.png",
      frameRate: 8,
      frameBuffer: 5,
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
  imageSrc: "./assets/background.png",
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

const backgroundImageHeight = 432;

const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + scaledCanvas.height,
  },
};

function render() {
  window.requestAnimationFrame(render);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  c.save();
  c.scale(4, 4);
  c.translate(camera.position.x, camera.position.y);
  background.update();
  collisionBlocks.forEach((collisionBlocks) => {
    collisionBlocks.update();
  });
  plataformCollisionBlocks.forEach((plataformCollisionBlocks) => {
    plataformCollisionBlocks.update();
  });

  player.update();

  
  // If the a direction key is being pressed and the player is on the ground moves the player to the direction
  if (
    keys.KeyA.pressed &&
    !(player.velocity.y < 0) &&
    player.floorCollisionDetected
    // && player.floorCollisionDetected
  ) {
    player.switchSprite("RunLeft");
    player.velocity.x = -2;
    player.PanCameraToTheRight({ canvas, camera }); ///////////////////////////////////// MOVE IT ////////////////////////////////////////
  } else if (
    keys.KeyD.pressed &&
    !(player.velocity.y < 0) &&
    player.floorCollisionDetected
    // && player.floorCollisionDetected
  ) {
    player.switchSprite("Run");
    player.velocity.x = 2;
    player.PanCameraToTheLeft({ canvas, camera }); ///////////////////////////////////// MOVE IT ////////////////////////////////////////
  } else if (player.velocity.x === 0 && player.lastDirection === "left") {
    player.switchSprite("IdleLeft");
  } else if (player.velocity.x === 0) {
    player.switchSprite("Idle");
  }

  // Condition to make the player jump left when "A" was last pressed
  if (player.velocity.y < 0 && keys.KeyA.lastPressed === true && !counting)
    player.velocity.x = -3;

  // Condition to make the player jump right when "D" was last pressed
  if (player.velocity.y < 0 && keys.KeyD.lastPressed === true)
    player.velocity.x = 3;

  // Condition to make the player jump up when "W" was last pressed
  if (
    player.velocity.y < 0 &&
    keys.KeyW.lastPressed === true &&
    !player.checkForFloorCollisions()
  )
    player.velocity.x = 0;

  if (
    !keys.KeyA.pressed &&
    !keys.KeyD.pressed &&
    player.floorCollisionDetected
  ) {
    player.velocity.x = 0;
  }

  if (keys.Space.pressed) {
    player.velocity.x = 0;
    intensityBar.drawBar();
  }

  // Bouncing off the walls mechanic
  // if (player.wallCollisionDetected & !player.floorCollisionDetected) {
  //   player.velocity.x = 5;
  // }
  if (player.velocity.y < 0) {
    player.PanCameraDown({ canvas, camera });
    if (player.lastDirection === "right") player.switchSprite("Jump");
    else player.switchSprite("JumpLeft");
  } else if (player.velocity.y > 0) {
    player.PanCameraUp({ canvas, camera });
    if (player.lastDirection === "right") player.switchSprite("Fall");
    else player.switchSprite("FallLeft");
  }

  c.restore();
}

render();

/////////////////////// JUMP MECHANIC /////////////////////////

let intensity = 0;
let counting = false;
let timer = null;

function increaseIntensity() {
  if (counting) {
    if (intensity == -10) intensity = 0;
    intensity--;
    console.log(intensity);
    setTimeout(increaseIntensity, 70);
    intensityBar.width = intensity;
  }
}

function jumpCoreMechanic() {
  counting = false;
  player.velocity.y = intensity;
  player.playerHasJumped = true;
  intensity = 0;
  intensityBar.width = 0;
}

///////////////////////// COMMANDS / KEY HANDLERS ///////////////////////////

window.addEventListener("keydown", (event) => {
  if (!player.playerHasJumped)
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
          }
          break;
        }
    }
});

window.addEventListener("keyup", (event) => {
  switch (event.code) {
    case "KeyA":
      keys.KeyA.pressed = false;
      player.velocity.x = 0;
      break;
    case "KeyD":
      keys.KeyD.pressed = false;
      player.velocity.x = 0;
      break;
    case "Space":
      keys.Space.pressed = false;
      jumpCoreMechanic();
  }
});
