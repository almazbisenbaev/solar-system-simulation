import { SolarSystem } from './SolarSystem.js';
import { Renderer } from './Renderer.js';
import { Controls } from './Controls.js';
import { Camera } from './Camera.js';
import './style.css';

export class App {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.camera = new Camera();
    this.renderer = new Renderer(this.canvas);
    this.solarSystem = new SolarSystem();
    this.controls = new Controls(this.canvas, this.camera);
    this.lastTime = performance.now();
    
    this.init();
  }

  init() {
    // Set up controls callback for speed changes
    this.controls.onSpeedChange = (speed) => {
      this.solarSystem.setSpeed(speed);
    };

    // Set up reset callback
    this.controls.onReset = () => {
      this.solarSystem.reset();
    };

    // Initialize zoom display
    this.controls.updateZoomDisplay();

    // Start the animation loop
    this.animate(performance.now());
  }

  animate = (currentTime) => {
    // Calculate delta time in seconds
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    
    // Clear canvas
    this.renderer.clear();
    
    // Update solar system with delta time
    this.solarSystem.update(deltaTime);
    
    // Draw solar system and get planet positions
    const planetPositions = this.solarSystem.draw(this.renderer, this.camera);
    
    // Check for planet hover
    const mousePos = this.controls.getMousePosition();
    const hoveredPlanet = this.controls.checkPlanetHover(mousePos.x, mousePos.y, planetPositions);
    this.controls.updatePlanetInfo(hoveredPlanet);
    
    requestAnimationFrame(this.animate);
  };
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new App();
});