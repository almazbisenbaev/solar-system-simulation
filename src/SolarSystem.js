import { Planet } from './Planet.js';
import { Sun } from './Sun.js';

export class SolarSystem {
  constructor() {
    this.speedMultiplier = 1;
    this.simulationTimeInDays = 0;
    
    // Initialize the sun
    this.sun = new Sun();
    
    // Initialize planets with realistic planetary data
    this.planets = this.createPlanets();
  }

  createPlanets() {
    const planetData = [
      {
        name: "Mercury",
        color: "#8C7853",
        radius: 2.44,
        distance: 80,
        speed: 4.092, // 360° ÷ 87.97 days = 4.092°/day
        angle: 0,
        realRadius: "2,439 km",
        realDistance: "57.9 million km",
        orbitalPeriod: "87.97 days"
      },
      {
        name: "Venus",
        color: "#FFC649",
        radius: 6.05,
        distance: 110,
        speed: 1.602, // 360° ÷ 224.7 days = 1.602°/day
        angle: 0,
        realRadius: "6,051 km",
        realDistance: "108.2 million km",
        orbitalPeriod: "224.7 days"
      },
      {
        name: "Earth",
        color: "#6B93D6",
        radius: 6.37,
        distance: 150,
        speed: 0.9856, // 360° ÷ 365.25 days = 0.9856°/day
        angle: 0,
        realRadius: "6,371 km",
        realDistance: "149.6 million km",
        orbitalPeriod: "365.25 days"
      },
      {
        name: "Mars",
        color: "#C1440E",
        radius: 3.39,
        distance: 200,
        speed: 0.5240, // 360° ÷ 687 days = 0.5240°/day
        angle: 0,
        realRadius: "3,389 km",
        realDistance: "227.9 million km",
        orbitalPeriod: "687 days"
      },
      {
        name: "Jupiter",
        color: "#D8CA9D",
        radius: 25,
        distance: 320,
        speed: 0.0831, // 360° ÷ 4333 days (11.86 years) = 0.0831°/day
        angle: 0,
        realRadius: "69,911 km",
        realDistance: "778.5 million km",
        orbitalPeriod: "11.86 years"
      },
      {
        name: "Saturn",
        color: "#FAD5A5",
        radius: 20,
        distance: 420,
        speed: 0.0334, // 360° ÷ 10759 days (29.46 years) = 0.0334°/day
        angle: 0,
        realRadius: "58,232 km",
        realDistance: "1.43 billion km",
        orbitalPeriod: "29.46 years",
        hasRings: true
      },
      {
        name: "Uranus",
        color: "#4FD0E3",
        radius: 10,
        distance: 520,
        speed: 0.0117, // 360° ÷ 30687 days (84.01 years) = 0.0117°/day
        angle: 0,
        realRadius: "25,362 km",
        realDistance: "2.87 billion km",
        orbitalPeriod: "84.01 years"
      },
      {
        name: "Neptune",
        color: "#4B70DD",
        radius: 9.8,
        distance: 620,
        speed: 0.0060, // 360° ÷ 60190 days (164.8 years) = 0.0060°/day
        angle: 0,
        realRadius: "24,622 km",
        realDistance: "4.50 billion km",
        orbitalPeriod: "164.8 years"
      }
    ];

    return planetData.map(data => new Planet(data));
  }

  setSpeed(multiplier) {
    this.speedMultiplier = multiplier;
  }

  update(deltaTime) {
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
    const center = renderer.getCenterPosition();
    const { x: centerX, y: centerY } = center;

    // Draw background stars
    renderer.drawStars(camera.x, camera.y);
    
    // Draw orbital paths
    this.planets.forEach(planet => {
      renderer.drawOrbit(planet.distance, centerX, centerY, camera.zoomLevel, camera.x, camera.y);
    });
    
    // Draw sun
    this.sun.draw(renderer.ctx, centerX, centerY, camera.zoomLevel, camera.x, camera.y);
    
    // Draw planets and collect their positions
    const planetPositions = [];
    this.planets.forEach(planet => {
      const pos = planet.draw(renderer.ctx, centerX, centerY, camera.zoomLevel, camera.x, camera.y);
      planetPositions.push(pos);
    });

    return planetPositions;
  }
}