export class Controls {
  constructor(canvas, camera) {
    this.canvas = canvas;
    this.camera = camera;
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.hoveredPlanet = null;

    this.bindEvents();
    this.bindSpeedButtons();
    this.bindZoomButtons();
  }

  bindEvents() {
    // Mouse controls for panning
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
    this.canvas.addEventListener('mouseleave', () => this.handleMouseUp());

    // Touch controls for mobile
    this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
  }

  bindSpeedButtons() {
    // Attach event listeners to speed buttons
    const speedButtons = document.querySelectorAll('.speed-btn');
    speedButtons.forEach(btn => {
      const speed = btn.textContent === 'Real' ? 1 : parseInt(btn.textContent.replace('x', ''));
      btn.addEventListener('click', () => this.setSpeed(speed, btn));
    });
  }

  bindZoomButtons() {
    // Create global functions for HTML onclick handlers
    window.zoomIn = () => this.zoomIn();
    window.zoomOut = () => this.zoomOut();
    window.fitView = () => this.fitView();
    window.resetSimulation = () => this.resetSimulation();
  }

  handleMouseDown(e) {
    this.isDragging = true;
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
  }

  handleMouseMove(e) {
    if (this.isDragging) {
      const deltaX = e.clientX - this.lastMouseX;
      const deltaY = e.clientY - this.lastMouseY;
      
      this.camera.move(-deltaX, -deltaY);
    }
    
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
  }

  handleMouseUp() {
    this.isDragging = false;
  }

  handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    this.isDragging = true;
    this.lastMouseX = touch.clientX;
    this.lastMouseY = touch.clientY;
  }

  handleTouchMove(e) {
    e.preventDefault();
    if (this.isDragging && e.touches.length === 1) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - this.lastMouseX;
      const deltaY = touch.clientY - this.lastMouseY;
      
      this.camera.move(-deltaX, -deltaY);
      
      this.lastMouseX = touch.clientX;
      this.lastMouseY = touch.clientY;
    }
  }

  handleTouchEnd(e) {
    e.preventDefault();
    this.isDragging = false;
  }

  setSpeed(speed, buttonElement) {
    if (this.onSpeedChange) {
      this.onSpeedChange(speed);
    }
    
    const displayText = speed === 1 ? 'Real' : speed + 'x';
    document.getElementById('current-speed').textContent = displayText;
    
    // Update button states
    document.querySelectorAll('.speed-btn').forEach(btn => btn.classList.remove('active'));
    buttonElement.classList.add('active');
  }

  zoomIn() {
    this.camera.zoomIn();
    this.updateZoomDisplay();
  }

  zoomOut() {
    this.camera.zoomOut();
    this.updateZoomDisplay();
  }

  fitView() {
    this.camera.reset();
    this.updateZoomDisplay();
  }

  resetSimulation() {
    if (this.onReset) {
      this.onReset();
    }
  }

  updateZoomDisplay() {
    const zoomPercentage = Math.round(this.camera.zoomLevel * 100) + '%';
    document.getElementById('current-zoom').textContent = zoomPercentage;
  }

  checkPlanetHover(mouseX, mouseY, planetPositions) {
    for (let pos of planetPositions) {
      const distance = Math.sqrt((mouseX - pos.x) ** 2 + (mouseY - pos.y) ** 2);
      if (distance <= pos.radius + 5) {
        return pos.planet;
      }
    }
    return null;
  }

  updatePlanetInfo(planet) {
    const infoDiv = document.getElementById('planet-info');
    if (planet) {
      infoDiv.innerHTML = `
        <strong>${planet.name}</strong><br>
        Radius: ${planet.realRadius}<br>
        Distance from Sun: ${planet.realDistance}<br>
        Orbital Period: ${planet.orbitalPeriod}
      `;
    } else {
      infoDiv.innerHTML = 'Hover over planets for information';
    }
  }

  getMousePosition() {
    return { x: this.lastMouseX, y: this.lastMouseY };
  }
}