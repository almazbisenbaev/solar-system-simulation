export class Sun {
  constructor() {
    this.radius = 15; // Scaled down significantly
    this.color = "#FDB813";
    this.realRadius = "696,340 km";
  }

  draw(ctx, centerX, centerY, zoomLevel, cameraX, cameraY) {
    const sunX = centerX - cameraX;
    const sunY = centerY - cameraY;
    const scaledRadius = this.radius * zoomLevel;
    
    // Glow effect
    const gradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, scaledRadius * 3);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(0.4, 'rgba(253, 184, 19, 0.8)');
    gradient.addColorStop(1, 'rgba(253, 184, 19, 0)');
    
    ctx.beginPath();
    ctx.arc(sunX, sunY, scaledRadius * 3, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Sun body
    ctx.beginPath();
    ctx.arc(sunX, sunY, scaledRadius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}