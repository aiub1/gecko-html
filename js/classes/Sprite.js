 class Sprite {
  constructor({ position, imageSrc, frameRate = 1, scale = 1 }) {
    this.position = position;
    this.scale = scale;
    this.frameRate = frameRate;
    this.loaded = false;
    this.image = new Image();
    
    this.image.onload = () => {
      this.width = (this.image.width / this.frameRate) * this.scale;
      this.height = (this.image.height) * this.scale;
      this.loaded = true;
    };
    this.image.src = imageSrc;
    this.image.onload();
    this.currentFrame = 0;
    this.frameBuffer = 4;
    this.elapsedFrames = 0;
  }

  

  drawSprite() {
  
    if (!this.loaded) return;
    const cropbox = {
      position: {
        x: this.currentFrame * (this.image.width / this.frameRate),
        y: 0,
      },
      width: this.image.width / this.frameRate,
      height: this.image.height,
    };


    c.drawImage(
      this.image,
      cropbox.position.x,
      cropbox.position.y,
      cropbox.width,
      cropbox.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
   }
   
   updateImage(newSrc) {
    this.image.src = newSrc;
    this.image.onload = () => {
      this.drawSprite();
    };
  }

  update() {
    this.drawSprite();
    this.updateFrames();
  }

  updateFrames() {
    this.elapsedFrames++;

    if (this.elapsedFrames % this.frameBuffer === 0) {
      if (this.currentFrame < this.frameRate - 1) this.currentFrame++;
      else this.currentFrame = 0;
    }
  }
}
