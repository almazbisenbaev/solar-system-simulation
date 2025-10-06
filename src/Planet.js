export class Planet {
  constructor(data) {
    this.name = data.name;
    this.color = data.color;
    this.radius = data.radius;
    this.distance = data.distance;
    this.speed = data.speed;
    this.angle = data.angle || 0;
    this.realRadius = data.realRadius;
    this.realDistance = data.realDistance;
    this.orbitalPeriod = data.orbitalPeriod;
    this.hasRings = data.hasRings || false;
  }

  update(deltaTime, speedMultiplier) {
    // Update orbital position using real time
    // deltaTime is in seconds, convert to days: 1 day = 86400 seconds
    const daysPassed = (deltaTime * speedMultiplier) / 86400;
    
    // Convert degrees per day to radians per day, then multiply by days passed
    const degreesThisFrame = this.speed * daysPassed;
    const radiansThisFrame = degreesThisFrame * (Math.PI / 180);
    
    this.angle += radiansThisFrame;
    if (this.angle > Math.PI * 2) this.angle -= Math.PI * 2;
  }

  getPosition(centerX, centerY, zoomLevel, cameraX, cameraY) {
    const scaledDistance = this.distance * zoomLevel;
    const x = centerX + Math.cos(this.angle) * scaledDistance - cameraX;
    const y = centerY + Math.sin(this.angle) * scaledDistance - cameraY;
    
    return { x, y };
  }

  draw(ctx, centerX, centerY, zoomLevel, cameraX, cameraY) {
    const scaledDistance = this.distance * zoomLevel;
    const scaledRadius = this.radius * zoomLevel;
    
    const position = this.getPosition(centerX, centerY, zoomLevel, cameraX, cameraY);
    const { x, y } = position;
    
    // Saturn's rings
    if (this.hasRings) {
      ctx.beginPath();
      ctx.ellipse(x, y, scaledRadius * 1.8, scaledRadius * 0.3, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(200, 200, 200, 0.6)';
      ctx.lineWidth = Math.max(1, zoomLevel);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.ellipse(x, y, scaledRadius * 2.2, scaledRadius * 0.4, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(180, 180, 180, 0.4)';
      ctx.lineWidth = Math.max(1, zoomLevel * 0.5);
      ctx.stroke();
    }
    
    // Planet body
    ctx.beginPath();
    ctx.arc(x, y, scaledRadius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    
    // Subtle glow
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, scaledRadius * 2);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.beginPath();
    ctx.arc(x, y, scaledRadius * 2, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    return { x, y, radius: scaledRadius, planet: this };
  }

  isPointInside(mouseX, mouseY, planetPosition) {
    const distance = Math.sqrt((mouseX - planetPosition.x) ** 2 + (mouseY - planetPosition.y) ** 2);
    return distance <= planetPosition.radius + 5;
  }
}