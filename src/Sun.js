import * as THREE from 'three';

export class Sun {
  constructor(scene) {
    this.scene = scene;
    this.radius = 30; // Scaled for 3D
    this.realRadius = "696,340 km";
    
    this.createSun();
  }

  createSun() {
    // Sun geometry
    const geometry = new THREE.SphereGeometry(this.radius, 64, 32);
    
    // Create animated sun material with glow
    const sunTexture = this.createSunTexture();
    const material = new THREE.MeshBasicMaterial({
      map: sunTexture,
      emissive: new THREE.Color(0xffaa00),
      emissiveIntensity: 0.6
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(0, 0, 0);
    
    // Create glow effect
    this.createGlowEffect();
    
    this.scene.add(this.mesh);
    
    // Animate sun rotation
    this.animationSpeed = 0.005;
  }

  createSunTexture() {
    // Create a procedural sun texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    
    // Create gradient
    const gradient = context.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, '#ffdd44');
    gradient.addColorStop(0.4, '#ff8800');
    gradient.addColorStop(0.7, '#ff4400');
    gradient.addColorStop(1, '#cc2200');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 512);
    
    // Add some noise for texture
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 3;
      context.fillStyle = `rgba(255, 255, 0, ${Math.random() * 0.3})`;
      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2);
      context.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  createGlowEffect() {
    // Outer glow
    const glowGeometry = new THREE.SphereGeometry(this.radius * 1.5, 32, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });
    
    this.glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    this.glowMesh.position.copy(this.mesh.position);
    this.scene.add(this.glowMesh);
    
    // Corona effect
    const coronaGeometry = new THREE.SphereGeometry(this.radius * 2, 32, 16);
    const coronaMaterial = new THREE.MeshBasicMaterial({
      color: 0xffdd44,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    });
    
    this.coronaMesh = new THREE.Mesh(coronaGeometry, coronaMaterial);
    this.coronaMesh.position.copy(this.mesh.position);
    this.scene.add(this.coronaMesh);
  }

  update(deltaTime) {
    // Rotate sun
    this.mesh.rotation.y += this.animationSpeed * deltaTime * 60;
    
    // Animate glow
    const time = Date.now() * 0.001;
    this.glowMesh.material.opacity = 0.2 + Math.sin(time * 2) * 0.1;
    this.coronaMesh.material.opacity = 0.05 + Math.sin(time * 1.5) * 0.05;
  }

  getPosition() {
    return this.mesh.position;
  }

  // Legacy method for compatibility
  draw() {
    // Rendering is now handled by Three.js
  }
}