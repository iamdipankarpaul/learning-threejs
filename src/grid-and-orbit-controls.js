import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvas = document.getElementById("canvas");

// 1. scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// Grid
const gridHelper = new THREE.GridHelper(10, 20, 0x444444, 0x888888);
scene.add(gridHelper);

// 2. camera
const w = window.innerWidth;
const h = window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0, 3, 6);

// Orbit Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = true;
controls.minDistance = 3;
controls.maxDistance = 20;
controls.maxPolarAngle = Math.PI * 0.5;

// 3. geometry
const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 1);
const boxGeometry = new THREE.BoxGeometry(2.5, 0.1, 2.5);

// 4. material
const icosahedronMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  emissive: 0x00aa00,
});
const boxMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  emissive: 0xaa0000,
});

// 5. mesh
const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
const box = new THREE.Mesh(boxGeometry, boxMaterial);

icosahedron.position.set(0, 1.2, 0);
box.position.set(0, 0, 0);

scene.add(icosahedron, box);

// 6. light
scene.add(new THREE.AmbientLight(0xffffff, 0.3));

const dirLight = new THREE.DirectionalLight(0xffff00, 100);
dirLight.position.set(15, 15, 10);
scene.add(dirLight);

// 7. renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(w, h);

// 8. function to animate our scene and re-render it on each frame
function animateScene() {
  window.requestAnimationFrame(animateScene);

  icosahedron.rotation.x += 0.01;
  icosahedron.rotation.y += 0.01;

  box.rotation.y += 0.005;

  renderer.render(scene, camera);
}

animateScene();

// 9. handle window resize
window.addEventListener("resize", () => {
  const w = window.innerWidth;
  const h = window.innerHeight;

  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});
