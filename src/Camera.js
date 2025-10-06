export class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.zoomLevel = 1;
  }

  move(deltaX, deltaY) {
    this.x += deltaX;
    this.y += deltaY;
  }

  zoomIn() {
    this.zoomLevel *= 1.5;
  }

  zoomOut() {
    this.zoomLevel /= 1.5;
  }

  reset() {
    this.zoomLevel = 1;
    this.x = 0;
    this.y = 0;
  }
}