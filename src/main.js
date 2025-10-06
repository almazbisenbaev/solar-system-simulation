import { SolarSystem } from './SolarSystem.js';
import { Renderer } from './Renderer.js';
import { Controls } from './Controls.js';
import { Camera } from './Camera.js';
import './style.css';

export class App {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.renderer = new Renderer(this.canvas);
    this.camera = new Camera(this.renderer);
    this.solarSystem = new SolarSystem(this.renderer.scene);
    this.controls = new Controls(this.canvas, this.camera, this.solarSystem);
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
    
    // Update solar system with delta time
    this.solarSystem.update(deltaTime);
    
    // Render the 3D scene
    this.renderer.render();
    
    requestAnimationFrame(this.animate);
  };
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new App();
});