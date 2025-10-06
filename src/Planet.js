import * as THREE from 'three';

export class Planet {
  constructor(data, scene) {
    this.scene = scene;
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
    
    this.create3DPlanet();
    this.createOrbitTrail();
  }

  create3DPlanet() {
    // Planet geometry with higher detail
    const geometry = new THREE.SphereGeometry(this.radius, 64, 32);
    
    // Create planet-specific materials
    const material = this.createPlanetMaterial();
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.userData.planet = this; // For raycasting
    
    // Create planet group for rotation
    this.group = new THREE.Group();
    this.group.add(this.mesh);
    
    // Add special features
    if (this.hasRings) {
      this.createRings();
    }
    
    if (this.name === 'Earth') {
      this.createAtmosphere();
      this.createClouds();
    }
    
    if (this.name === 'Jupiter' || this.name === 'Saturn') {
      this.createGasGiantBands();
    }
    
    this.scene.add(this.group);
    
    // Set initial position
    this.updatePosition();
    
    // Rotation speed (realistic relative to planet size and type)
    this.rotationSpeed = this.getRotationSpeed();
  }

  createPlanetMaterial() {
    const texture = this.createProceduralTexture();
    
    return new THREE.MeshPhongMaterial({
      map: texture,
      shininess: this.getShininess(),
      specular: new THREE.Color(this.getSpecularColor()),
      bumpMap: texture,
      bumpScale: 0.1
    });
  }

  createProceduralTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    
    // Create planet-specific textures
    switch (this.name) {
      case 'Earth':
        this.createEarthTexture(context, canvas);
        break;
      case 'Mars':
        this.createMarsTexture(context, canvas);
        break;
      case 'Jupiter':
        this.createJupiterTexture(context, canvas);
        break;
      case 'Saturn':
        this.createSaturnTexture(context, canvas);
        break;
      default:
        this.createBasicTexture(context, canvas);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  createEarthTexture(ctx, canvas) {
    // Create Earth-like continents and oceans
    ctx.fillStyle = '#1e40af'; // Ocean blue
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add landmasses
    ctx.fillStyle = '#22c55e'; // Land green
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const width = 30 + Math.random() * 80;
      const height = 20 + Math.random() * 40;
      
      ctx.beginPath();
      ctx.ellipse(x, y, width, height, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add clouds (will be separate layer)
    this.needsClouds = true;
  }

  createMarsTexture(ctx, canvas) {
    // Mars surface with varied reds and browns
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#cd5c5c');
    gradient.addColorStop(0.5, '#a0522d');
    gradient.addColorStop(1, '#8b4513');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add surface features
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = 2 + Math.random() * 8;
      
      ctx.fillStyle = `rgba(139, 69, 19, ${0.3 + Math.random() * 0.4})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  createJupiterTexture(ctx, canvas) {
    // Jupiter's bands
    const bandColors = ['#d4a574', '#b8956a', '#9c8560', '#807556'];
    const bandHeight = canvas.height / bandColors.length;
    
    bandColors.forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.fillRect(0, index * bandHeight, canvas.width, bandHeight);
      
      // Add turbulence
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = index * bandHeight + Math.random() * bandHeight;
        const width = 20 + Math.random() * 40;
        const height = 5 + Math.random() * 10;
        
        ctx.fillStyle = `rgba(200, 150, 100, ${0.3 + Math.random() * 0.4})`;
        ctx.beginPath();
        ctx.ellipse(x, y, width, height, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  createSaturnTexture(ctx, canvas) {
    // Similar to Jupiter but with different colors
    const bandColors = ['#fad5a5', '#f0c674', '#e6b84a', '#dca920'];
    const bandHeight = canvas.height / bandColors.length;
    
    bandColors.forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.fillRect(0, index * bandHeight, canvas.width, bandHeight);
    });
  }

  createBasicTexture(ctx, canvas) {
    // Basic rocky planet texture
    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add surface variation
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = 1 + Math.random() * 4;
      
      ctx.fillStyle = `rgba(0, 0, 0, ${0.1 + Math.random() * 0.2})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  getShininess() {
    switch (this.name) {
      case 'Earth': return 100;
      case 'Venus': return 200;
      case 'Mercury': return 300;
      default: return 30;
    }
  }

  getSpecularColor() {
    switch (this.name) {
      case 'Earth': return 0x4444ff;
      case 'Mars': return 0x442222;
      default: return 0x222222;
    }
  }

  getRotationSpeed() {
    // Realistic rotation speeds (scaled)
    switch (this.name) {
      case 'Jupiter': return 0.05; // Fast rotation
      case 'Saturn': return 0.045;
      case 'Earth': return 0.02;
      case 'Mars': return 0.019;
      case 'Venus': return -0.001; // Retrograde rotation
      default: return 0.015;
    }
  }

  createRings() {
    const ringGeometry = new THREE.RingGeometry(this.radius * 1.5, this.radius * 2.5, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xcccccc,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    
    const rings = new THREE.Mesh(ringGeometry, ringMaterial);
    rings.rotation.x = -Math.PI / 2;
    rings.rotation.z = Math.random() * Math.PI / 4; // Slight tilt
    
    this.group.add(rings);
  }

  createAtmosphere() {
    const atmosphereGeometry = new THREE.SphereGeometry(this.radius * 1.05, 32, 16);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x6699ff,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide
    });
    
    this.atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    this.group.add(this.atmosphere);
  }

  createClouds() {
    const cloudGeometry = new THREE.SphereGeometry(this.radius * 1.02, 32, 16);
    const cloudTexture = this.createCloudTexture();
    const cloudMaterial = new THREE.MeshBasicMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.4
    });
    
    this.clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    this.group.add(this.clouds);
  }

  createCloudTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    
    // Transparent background
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add cloud formations
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = 20 + Math.random() * 40;
      
      context.fillStyle = `rgba(255, 255, 255, ${0.6 + Math.random() * 0.4})`;
      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2);
      context.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  createGasGiantBands() {
    // Add subtle glow effect for gas giants
    const glowGeometry = new THREE.SphereGeometry(this.radius * 1.1, 32, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: this.name === 'Jupiter' ? 0xffaa44 : 0xffdd88,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    });
    
    this.glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.group.add(this.glow);
  }

  createOrbitTrail() {
    const points = [];
    const segments = 64;
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * this.distance;
      const z = Math.sin(angle) * this.distance;
      points.push(new THREE.Vector3(x, 0, z));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x444444,
      transparent: true,
      opacity: 0.3
    });
    
    this.orbitLine = new THREE.Line(geometry, material);
    this.scene.add(this.orbitLine);
  }

  update(deltaTime, speedMultiplier) {
    // Update orbital position using real time
    const daysPassed = (deltaTime * speedMultiplier) / 86400;
    const degreesThisFrame = this.speed * daysPassed;
    const radiansThisFrame = degreesThisFrame * (Math.PI / 180);
    
    this.angle += radiansThisFrame;
    if (this.angle > Math.PI * 2) this.angle -= Math.PI * 2;
    
    // Update position
    this.updatePosition();
    
    // Rotate planet on its axis
    this.mesh.rotation.y += this.rotationSpeed * deltaTime * 60;
    
    // Animate clouds for Earth
    if (this.clouds) {
      this.clouds.rotation.y += this.rotationSpeed * 0.8 * deltaTime * 60;
    }
    
    // Animate atmosphere shimmer
    if (this.atmosphere) {
      this.atmosphere.material.opacity = 0.1 + Math.sin(Date.now() * 0.001) * 0.05;
    }
    
    // Animate gas giant glow
    if (this.glow) {
      this.glow.material.opacity = 0.05 + Math.sin(Date.now() * 0.002) * 0.05;
    }
  }

  updatePosition() {
    const x = Math.cos(this.angle) * this.distance;
    const z = Math.sin(this.angle) * this.distance;
    this.group.position.set(x, 0, z);
  }

  getPosition() {
    return this.group.position.clone();
  }

  get3DPosition() {
    return {
      x: this.group.position.x,
      y: this.group.position.y,
      z: this.group.position.z,
      radius: this.radius,
      planet: this
    };
  }

  // Legacy methods for compatibility
  draw() {
    // Rendering is now handled by Three.js
    return this.get3DPosition();
  }

  isPointInside(mouseX, mouseY, planetPosition) {
    // This will be handled by raycasting in 3D
    return false;
  }
}