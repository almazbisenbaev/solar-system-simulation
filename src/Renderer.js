import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50000);
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    
    this.setupRenderer();
    this.setupLighting();
    this.setupControls();
    this.createStarField();
    
    window.addEventListener('resize', () => this.onWindowResize());
  }

  setupRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.physicallyCorrectLights = true;
    
    // Better colors and contrast
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.scene.background = new THREE.Color(0x000011);
  }

  setupLighting() {
    // Ambient light for overall scene illumination
    this.ambientLight = new THREE.AmbientLight(0x202040, 0.05);
    this.scene.add(this.ambientLight);
    
    // Sun light (main point light)
    this.sunLight = new THREE.PointLight(0xffffff, 3, 0, 1.5);
    this.sunLight.position.set(0, 0, 0);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 4096;
    this.sunLight.shadow.mapSize.height = 4096;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 2000;
    this.sunLight.shadow.radius = 4;
    this.sunLight.shadow.blurSamples = 25;
    this.scene.add(this.sunLight);
    
    // Additional fill light for better planet visibility
    this.fillLight = new THREE.DirectionalLight(0x4444aa, 0.1);
    this.fillLight.position.set(-1000, 500, 1000);
    this.scene.add(this.fillLight);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 50;
    this.controls.maxDistance = 8000;
    this.controls.maxPolarAngle = Math.PI;
    
    // Set initial camera position
    this.camera.position.set(0, 300, 800);
    this.controls.update();
  }

  createStarField() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 15000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    
    const starColors = [
      new THREE.Color(0xffffff), // White
      new THREE.Color(0xffffcc), // Warm white
      new THREE.Color(0xffcccc), // Red
      new THREE.Color(0xccccff), // Blue
      new THREE.Color(0xffffaa), // Yellow
    ];
    
    for (let i = 0; i < starCount; i++) {
      // Create stars in a large sphere around the solar system
      const radius = 15000 + Math.random() * 15000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Random star color
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Random star size
      sizes[i] = Math.random() * 3 + 1;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const starMaterial = new THREE.PointsMaterial({
      size: 2,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    
    this.stars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(this.stars);
    
    // Add nebula effect
    this.createNebula();
  }

  createNebula() {
    const nebulaGeometry = new THREE.PlaneGeometry(50000, 50000);
    const nebulaTexture = this.createNebulaTexture();
    const nebulaMaterial = new THREE.MeshBasicMaterial({
      map: nebulaTexture,
      transparent: true,
      opacity: 0.03,
      side: THREE.DoubleSide
    });
    
    this.nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    this.nebula.position.z = -25000;
    this.scene.add(this.nebula);
  }

  createNebulaTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    
    // Create gradient nebula effect
    const gradient = context.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, 'rgba(100, 50, 200, 0.8)');
    gradient.addColorStop(0.3, 'rgba(200, 100, 150, 0.4)');
    gradient.addColorStop(0.6, 'rgba(150, 200, 100, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 512);
    
    // Add noise
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 3;
      
      context.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2);
      context.fill();
    }
    
    return new THREE.CanvasTexture(canvas);
  }

  addOrbitRing(radius) {
    const geometry = new THREE.RingGeometry(radius - 0.5, radius + 0.5, 64);
    const material = new THREE.MeshBasicMaterial({
      color: 0x444444,
      opacity: 0.2,
      transparent: true,
      side: THREE.DoubleSide
    });
    const orbit = new THREE.Mesh(geometry, material);
    orbit.rotation.x = -Math.PI / 2;
    this.scene.add(orbit);
    return orbit;
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  // Legacy methods for compatibility during transition
  clear() {
    // No longer needed with Three.js
  }

  getCenterPosition() {
    return { x: 0, y: 0, z: 0 };
  }
}