import { Planet } from './Planet.js';
import { Sun } from './Sun.js';
import * as THREE from 'three';

export class SolarSystem {
  constructor(scene) {
    this.scene = scene;
    this.speedMultiplier = 1;
    this.simulationTimeInDays = 0;
    
    // Initialize the sun
    this.sun = new Sun(scene);
    
    // Initialize planets with realistic planetary data
    this.planets = this.createPlanets();
    
    // Setup raycasting for planet interaction
    this.setupRaycasting();
  }

  createPlanets() {
    const planetData = [
      {
        name: "Mercury",
        color: "#8C7853",
        radius: 4,
        distance: 80,
        speed: 4.092,
        angle: Math.random() * Math.PI * 2, // Random starting positions
        realRadius: "2,439 km",
        realDistance: "57.9 million km",
        orbitalPeriod: "87.97 days"
      },
      {
        name: "Venus",
        color: "#FFC649",
        radius: 8,
        distance: 110,
        speed: 1.602,
        angle: Math.random() * Math.PI * 2,
        realRadius: "6,051 km",
        realDistance: "108.2 million km",
        orbitalPeriod: "224.7 days"
      },
      {
        name: "Earth",
        color: "#6B93D6",
        radius: 8.5,
        distance: 150,
        speed: 0.9856,
        angle: Math.random() * Math.PI * 2,
        realRadius: "6,371 km",
        realDistance: "149.6 million km",
        orbitalPeriod: "365.25 days"
      },
      {
        name: "Mars",
        color: "#C1440E",
        radius: 5.5,
        distance: 200,
        speed: 0.5240,
        angle: Math.random() * Math.PI * 2,
        realRadius: "3,389 km",
        realDistance: "227.9 million km",
        orbitalPeriod: "687 days"
      },
      {
        name: "Jupiter",
        color: "#D8CA9D",
        radius: 28,
        distance: 320,
        speed: 0.0831,
        angle: Math.random() * Math.PI * 2,
        realRadius: "69,911 km",
        realDistance: "778.5 million km",
        orbitalPeriod: "11.86 years"
      },
      {
        name: "Saturn",
        color: "#FAD5A5",
        radius: 24,
        distance: 420,
        speed: 0.0334,
        angle: Math.random() * Math.PI * 2,
        realRadius: "58,232 km",
        realDistance: "1.43 billion km",
        orbitalPeriod: "29.46 years",
        hasRings: true
      },
      {
        name: "Uranus",
        color: "#4FD0E3",
        radius: 14,
        distance: 520,
        speed: 0.0117,
        angle: Math.random() * Math.PI * 2,
        realRadius: "25,362 km",
        realDistance: "2.87 billion km",
        orbitalPeriod: "84.01 years"
      },
      {
        name: "Neptune",
        color: "#4B70DD",
        radius: 13,
        distance: 620,
        speed: 0.0060,
        angle: Math.random() * Math.PI * 2,
        realRadius: "24,622 km",
        realDistance: "4.50 billion km",
        orbitalPeriod: "164.8 years"
      }
    ];

    return planetData.map(data => new Planet(data, this.scene));
  }

  setupRaycasting() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoveredPlanet = null;
  }

  setSpeed(multiplier) {
    this.speedMultiplier = multiplier;
  }

  update(deltaTime) {
    // Update sun animation
    this.sun.update(deltaTime);
    
    // Update all planets with delta time
    this.planets.forEach(planet => {
      planet.update(deltaTime, this.speedMultiplier);
    });

    // Track simulation time in days (1 day = 86400 seconds)
    const daysPassed = (deltaTime * this.speedMultiplier) / 86400;
    this.simulationTimeInDays += daysPassed;
    
    // Update time display
    this.updateTimeDisplay();
  }

  updateTimeDisplay() {
    const timeElement = document.getElementById('sim-time');
    if (timeElement) {
      if (this.simulationTimeInDays < 365) {
        timeElement.textContent = `${Math.floor(this.simulationTimeInDays)} days`;
      } else {
        const years = Math.floor(this.simulationTimeInDays / 365.25);
        const remainingDays = Math.floor(this.simulationTimeInDays % 365.25);
        timeElement.textContent = `${years}y ${remainingDays}d`;
      }
    }
  }

  reset() {
    this.simulationTimeInDays = 0;
    this.planets.forEach(planet => {
      planet.angle = 0;
    });
    this.updateTimeDisplay();
  }

  draw(renderer, camera) {
    // Rendering is now handled by Three.js renderer
    // Return planet positions for mouse interaction
    const planetPositions = this.planets.map(planet => planet.get3DPosition());
    return planetPositions;
  }

  checkPlanetHover(mouseX, mouseY, camera) {
    // Update mouse coordinates for raycasting
    this.mouse.x = (mouseX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(mouseY / window.innerHeight) * 2 + 1;

    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, camera.threeCamera);

    // Get all planet meshes
    const planetMeshes = this.planets.map(planet => planet.mesh);

    // Check for intersections
    const intersects = this.raycaster.intersectObjects(planetMeshes);

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      return intersectedObject.userData.planet;
    }

    return null;
  }
}