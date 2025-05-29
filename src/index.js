import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CtruhSphereGeometry } from "./geometry/CtruhSphereGeometry";

class CtruhPlanetaryExplorer {
  constructor() {
    console.log("Developer Fingerprint: Divys Shiv Pandey - Project for Ctruh Assignment");

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.mainPlanet = null;
    this.moon = null;
    this.stars = null;
    this.light = null;
    this.canvas = null;
    this.container = null;
    this.controls = null;
    this.clock = new THREE.Clock();

    this.setupInfoPanel();
    this.init();
    this.animate();
  }

  init() {
    this.container = document.getElementById('canvas-container');
    this.canvas = document.getElementById('canvas');
    if (!this.canvas || !this.container) {
      console.error('Canvas or container element not found');
      return;
    }

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.onWindowResize();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enablePan = false; // Disable moving of the target

    this.addLights();
    this.createMainPlanet();
    this.createMoon();
    this.createStarfield();

    window.addEventListener('resize', () => this.onWindowResize());
  }

  setupInfoPanel() {
    const infoPanel = document.getElementById('info-panel');
    infoPanel.addEventListener('click', () => {
      infoPanel.style.opacity = '0';
      setTimeout(() => {
        infoPanel.style.display = 'none';
      }, 300);
    });
  }

  addLights() {
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    this.light = new THREE.DirectionalLight(0xffffff, 1);
    this.light.position.set(1, 1, 1);
    this.scene.add(this.light);
  }

  createMainPlanet() {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('./assets/earth.jpg');
    const geometry = new CtruhSphereGeometry(1, 64, 64).geometry;
    geometry.name = 'Ctruh earth';
    const material = new THREE.MeshPhongMaterial({
      map: texture,
    });
    this.mainPlanet = new THREE.Mesh(geometry, material);
    this.scene.add(this.mainPlanet);

    console.log('Earth Sphere: ', geometry);
  }

  createMoon() {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('./assets/moon.jpeg');
    const geometry = new CtruhSphereGeometry(0.2, 32, 32).geometry;
    geometry.name = 'Ctruh moon';
    const material = new THREE.MeshPhongMaterial({
      map: texture,
    });
    this.moon = new THREE.Mesh(geometry, material);

    this.moonPivot = new THREE.Object3D();
    this.moonPivot.add(this.moon);
    this.scene.add(this.moonPivot);

    this.moon.position.set(2, 0, 0);

    console.log('Moon Sphere: ', geometry);
  }

  createStarfield() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    for (let i = 0; i < 1000; i++) {
      vertices.push(
        THREE.MathUtils.randFloatSpread(2000),
        THREE.MathUtils.randFloatSpread(2000),
        THREE.MathUtils.randFloatSpread(2000)
      );
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
    this.stars = new THREE.Points(geometry, material);
    this.scene.add(this.stars);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.controls.update();

    const time = this.clock.getElapsedTime();

    this.mainPlanet.rotation.y = time * 0.1;
    this.moonPivot.rotation.y = time * 0.5;
    this.moon.rotation.y = time * 0.4;

    this.stars.rotation.y = time * 0.01;

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
}

const explorer = new CtruhPlanetaryExplorer();