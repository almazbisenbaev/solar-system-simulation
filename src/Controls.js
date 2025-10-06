export class Controls {
  constructor(canvas, camera, solarSystem) {
    this.canvas = canvas;
    this.camera = camera;
    this.solarSystem = solarSystem;
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.hoveredPlanet = null;

    this.bindEvents();
    this.bindSpeedButtons();
    this.bindZoomButtons();
  }

  bindEvents() {
    // Mouse controls are now handled by OrbitControls
    // We only need to track mouse position for planet hover
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    
    // Add scroll wheel zoom support
    this.canvas.addEventListener('wheel', (e) => this.handleWheel(e));
    
    // Add keyboard controls
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    
    // Touch controls for mobile are handled by OrbitControls
  }

  handleKeyDown(e) {
    switch (e.key.toLowerCase()) {
      case 'r':
        this.resetSimulation();
        break;
      case 'f':
        this.fitView();
        break;
      case '1':
        this.setSpeed(1, document.querySelector('.speed-btn[data-speed="1"]'));
        break;
      case '2':
        this.setSpeed(10, document.querySelector('.speed-btn[data-speed="10"]'));
        break;
      case '3':
        this.setSpeed(100, document.querySelector('.speed-btn[data-speed="100"]'));
        break;
      case '4':
        this.setSpeed(1000, document.querySelector('.speed-btn[data-speed="1000"]'));
        break;
      case ' ':
        e.preventDefault();
        // Toggle pause/play
        const currentSpeed = this.getCurrentSpeed();
        if (currentSpeed > 0) {
          this.pausedSpeed = currentSpeed;
          this.setSpeed(0, null);
        } else {
          this.setSpeed(this.pausedSpeed || 1, null);
        }
        break;
    }
  }

  getCurrentSpeed() {
    // This would need to be implemented to get current speed from simulation
    return 1; // Default fallback
  }

  bindSpeedButtons() {
    // Attach event listeners to speed buttons
    const speedButtons = document.querySelectorAll('.speed-btn[data-speed]');
    speedButtons.forEach(btn => {
      const speed = parseInt(btn.getAttribute('data-speed'));
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

  handleMouseMove(e) {
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
    
    // Check for planet hover using raycasting
    if (this.solarSystem) {
      const hoveredPlanet = this.solarSystem.checkPlanetHover(e.clientX, e.clientY, this.camera);
      this.updatePlanetInfo(hoveredPlanet);
    }
  }

  handleWheel(e) {
    // Prevent default scroll behavior
    e.preventDefault();
  }

  setSpeed(speed, buttonElement) {
    if (this.onSpeedChange) {
      this.onSpeedChange(speed);
    }
    
    const displayText = speed === 1 ? 'Real' : speed + 'x';
    document.getElementById('current-speed').textContent = displayText;
    
    // Update button states
    document.querySelectorAll('.speed-btn[data-speed]').forEach(btn => btn.classList.remove('active'));
    if (buttonElement) {
      buttonElement.classList.add('active');
    }
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
    const zoomPercentage = Math.round(this.camera.getZoomLevel() * 100) + '%';
    document.getElementById('current-zoom').textContent = zoomPercentage;
  }

  checkPlanetHover(mouseX, mouseY, planetPositions) {
    // This is now handled by the SolarSystem's raycasting
    return this.solarSystem ? this.solarSystem.checkPlanetHover(mouseX, mouseY, this.camera) : null;
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