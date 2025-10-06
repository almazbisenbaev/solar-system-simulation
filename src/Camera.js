import * as THREE from 'three';

export class Camera {
  constructor(renderer) {
    this.threeCamera = renderer.camera;
    this.controls = renderer.controls;
    this.initialPosition = new THREE.Vector3(0, 300, 800);
    this.initialTarget = new THREE.Vector3(0, 0, 0);
  }

  // Legacy methods for compatibility
  move(deltaX, deltaY) {
    // Movement is now handled by OrbitControls
  }

  zoomIn() {
    const direction = new THREE.Vector3();
    this.threeCamera.getWorldDirection(direction);
    this.threeCamera.position.add(direction.multiplyScalar(100));
    this.controls.update();
  }

  zoomOut() {
    const direction = new THREE.Vector3();
    this.threeCamera.getWorldDirection(direction);
    this.threeCamera.position.add(direction.multiplyScalar(-100));
    this.controls.update();
  }

  reset() {
    this.threeCamera.position.copy(this.initialPosition);
    this.controls.target.copy(this.initialTarget);
    this.controls.update();
  }

  // New 3D-specific methods
  focusOnObject(position, distance = 200) {
    const targetPosition = new THREE.Vector3().copy(position);
    targetPosition.z += distance;
    
    this.threeCamera.position.copy(targetPosition);
    this.controls.target.copy(position);
    this.controls.update();
  }

  getPosition() {
    return this.threeCamera.position.clone();
  }

  getZoomLevel() {
    // Calculate zoom level based on distance from target
    const distance = this.threeCamera.position.distanceTo(this.controls.target);
    return 800 / distance; // Normalize to initial distance
  }
}