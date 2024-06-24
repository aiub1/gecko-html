class Player extends Sprite {
  constructor({
    canvas,
    position,
    collisionBlocks,
    plataformCollisionBlocks,
    imageSrc,
    frameRate,
    scale = 0.5,
    animations,
  }) {
    super({ imageSrc, frameRate, scale });
    this.canvas = canvas;
    this.position = position;
    this.velocity = {
      x: 0,
      y: 1,
    };

    this.collisionBlocks = collisionBlocks;
    this.plataformCollisionBlocks = plataformCollisionBlocks;

    this.hitbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 0,
      height: 0,
    };

    this.floorCollisionDetected = false;
    this.plataformCollisionDetected = false;
    this.wallCollisionDetected = false;
    this.lastDirection = "right";
    this.playerHasJumped = false;

    // Loops through the animations array and creates Image Objects for each sprite
    this.animations = animations;

    for (let key in this.animations) {
      const image = new Image();
      image.src = this.animations[key].imageSrc;

      this.animations[key].image = image;
    }

    this.cameraBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 200,
      height: 85,
    };
  }

  //  SWITCHES THE PLAYER SPRITES
  switchSprite(key) {
    if (this.image === this.animations[key].image || !this.loaded) return;

    this.currentFrame = 0;
    this.image = this.animations[key].image;
    this.frameBuffer = this.animations[key].frameBuffer;
    this.frameRate = this.animations[key].frameRate;
  }

  // Updates the position of the camera box as the player moves
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

  PanCameraToTheLeft({ canvas, camera }) {
    const cameraBoxRightSide = this.cameraBox.position.x + this.cameraBox.width;
    const scaledDownCanvasWidth = canvas.width / 4;

    if (cameraBoxRightSide >= 576) return;

    if (
      cameraBoxRightSide >=
      scaledDownCanvasWidth + Math.abs(camera.position.x)
    ) {
      camera.position.x -= this.velocity.x;
    }
  }

  PanCameraToTheRight({ canvas, camera }) {
    const cameraBoxLeftSide = this.cameraBox.position.x;

    if (cameraBoxLeftSide <= 0) return;

    if (cameraBoxLeftSide <= Math.abs(camera.position.x)) {
      camera.position.x -= this.velocity.x;
    }
  }

  PanCameraDown({ canvas, camera }) {
    const cameraBoxTop = this.cameraBox.position.y;

    if (cameraBoxTop + this.velocity.y <= 0) return;

    if (cameraBoxTop <= Math.abs(camera.position.y)) {
      camera.position.y -= this.velocity.y;
    }
  }
  PanCameraUp({ canvas, camera }) {
    const cameraBoxBottom = this.cameraBox.position.y + this.cameraBox.height;
    const scaledCanvasHeight = canvas.height / 4;

    if (cameraBoxBottom + this.velocity.y >= 432) return;

    if (cameraBoxBottom >= Math.abs(camera.position.y) + scaledCanvasHeight) {
      camera.position.y -= this.velocity.y;
    }
  }

  // UPDATES THE PLAYER'S ATTRIBUTES EVERY FRAME
  update() {
    this.updateFrames();
    this.updateHitbox();

    // This draws out the camera box for visualization
    this.updateCameraBox();
    c.fillStyle = "rgba(0, 0, 255, 0.2)";
    c.fillRect(
      this.cameraBox.position.x,
      this.cameraBox.position.y,
      this.cameraBox.width,
      this.cameraBox.height
    );

    // // This draws out the full size of the image sprite file
    // c.fillStyle = "rgba(0, 255, 0, 0.2)";
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);

    // This draws out the hitbox for visualization;
    c.fillStyle = "rgba(255, 0, 0, 0.2)";
    c.fillRect(
      this.hitbox.position.x,
      this.hitbox.position.y,
      this.hitbox.width,
      this.hitbox.height
    );

    this.drawSprite();

    this.position.x += this.velocity.x;
    this.updateHitbox();
    this.checkForHorizontalCollisions();
    this.applyGravity();
    this.updateHitbox();
    this.checkForVerticalCollisions();
    this.updateLastDirection();
    this.checkForFloorCollisions();
    // console.log(this.velocity.y);
  }a

  // UPDATES THE HITBOX POSITION TO FOLLOW THE PLAYER
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

  // APPLIES GRAVITY TO THE PLAYER
  applyGravity() {
    this.velocity.y += gravity;
    this.position.y += this.velocity.y;
  }

  // CHECK FOR COLLISIONS ON THE X AXIS
  checkForHorizontalCollisions() {
    this.wallCollisionDetected = false;

    // PREVENTS THE PLAYER FROM MOVING OUTSIDE OF THE CANVAS
    if (this.hitbox.position.x <= 0) {
      this.velocity.x = 0;
      const offset = this.hitbox.position.x - this.position.x;
      this.position.x = 0 - offset - 0.01;
    }

    if (this.hitbox.position.x + this.hitbox.width >= 576) {
      // NOTE TO SELF: MAKE THE VALUE DYNAMIC LATER
      this.velocity.x = 0;
      const offset =
        this.hitbox.position.x - this.position.x + this.hitbox.width;
      this.position.x = 576 - offset - 0.01;
    }

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
    // PLATAFORM COLLISIONS DETECTION
    for (let i = 0; i < this.plataformCollisionBlocks.length; i++) {
      const plataformCollisions = this.plataformCollisionBlocks[i];

      if (
        collision({
          object1: this.hitbox,
          object2: plataformCollisions,
          canvas: this.canvas,
        })
      ) {
        this.wallCollisionDetected = true;
        if (this.velocity.x > 0) {
          this.velocity.x = 0;
          this.velocity.y = 0;

          const offset =
            this.hitbox.position.x - this.position.x + this.hitbox.width;

          this.position.x = plataformCollisions.position.x - offset - 0.01;
        }

        if (this.velocity.x < 0) {
          const offset = this.hitbox.position.x - this.position.x;

          this.velocity.x = 0;
          this.velocity.y = 0;
          this.position.x =
            plataformCollisions.position.x +
            plataformCollisions.width -
            offset +
            0.01;
        }
      }
    }
  }

  // CHECK FOR COLLISIONS ON THE Y AXIS
  checkForVerticalCollisions() {
    // COLLISION BLOCKS DETECTION
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
          this.floorCollisionDetected = true;
          this.playerHasJumped = false;
          this.velocity.y = 0;

          const offset = this.hitbox.position.y - this.position.y;
          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.05;
        }
      }
    }
    // PLATAFORM COLLISIONS DETECTION
    for (let i = 0; i < this.plataformCollisionBlocks.length; i++) {
      const plataformCollisions = this.plataformCollisionBlocks[i];

      if (
        collision({
          object1: this.hitbox,
          object2: plataformCollisions,
          canvas: this.canvas,
        })
      ) {
        if (this.velocity.y > 0) {
          this.floorCollisionDetected = true;
          this.plataformCollisionDetected = true;
          this.playerHasJumped = false;
          this.velocity.y = 0;

          console.log("teste");
          this.plataformCollisionDetected = true;
          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;

          this.position.y = plataformCollisions.position.y - offset - 0.01;
        }

        if (this.velocity.y < 0) {
          this.floorCollisionDetected = true;
          this.playerHasJumped = false;
          this.velocity.y = 0;

          const offset = this.hitbox.position.y - this.position.y;

          this.position.y =
            plataformCollisions.position.y +
            plataformCollisions.height -
            offset +
            0.01;
        }
      }
    }
  }

  // CHECK IF THE PLAYER IS GROUNDED ON THE FLOOR
  checkForFloorCollisions() {
    // COLLISION BLOCKS DETECTION
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
        // PLATAFORM COLLISIONS DETECTION
        for (let i = 0; i < this.plataformCollisionBlocks.length; i++) {
          const plataformCollisions = this.plataformCollisionBlocks[i];

          if (
            floorCollision({
              player: this,
              object1: this.hitbox,
              object2: plataformCollisions,
            })
          ) {
            this.floorCollisionDetected = true;
            this.playerHasJumped = false;
          } else {
            this.floorCollisionDetected = false;
          }
        }
      }
    }
  }

  // KEEP TRACK OF PLAYER'S LAST DIRECTION
  // Used on sprite swapping and the mechanic for bouncing off the walls
  updateLastDirection() {
    if (this.velocity.x > 0) {
      this.lastDirection = "right";
    } else if (this.velocity.x < 0) {
      this.lastDirection = "left";
    }
  }
}
