export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.resizeCanvas();
    
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawStars(cameraX, cameraY) {
    // Generate consistent stars based on camera position
    const starDensity = 0.0003;
    const viewWidth = this.canvas.width;
    const viewHeight = this.canvas.height;
    
    for (let i = 0; i < viewWidth * viewHeight * starDensity; i++) {
      const x = (Math.sin(i * 12.345 + cameraX * 0.001) * 0.5 + 0.5) * viewWidth;
      const y = (Math.cos(i * 67.890 + cameraY * 0.001) * 0.5 + 0.5) * viewHeight;
      const size = Math.abs(Math.sin(i * 3.456)) * 1.5 + 0.5;
      
      this.drawStar(x, y, size);
    }
  }

  drawStar(x, y, size) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1 + 0.05})`;
    this.ctx.fill();
  }

  drawOrbit(distance, centerX, centerY, zoomLevel, cameraX, cameraY) {
    this.ctx.beginPath();
    this.ctx.arc(centerX - cameraX, centerY - cameraY, distance * zoomLevel, 0, Math.PI * 2);
    this.ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  getCenterPosition() {
    return {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2
    };
  }
}