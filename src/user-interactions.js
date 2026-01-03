import * as THREE from "three";

const canvas = document.getElementById("canvas");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

// Camera
const w = window.innerWidth;
const h = window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0, 5, 8);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(w, h);
renderer.shadowMap.enabled = true;

// Geometries
const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 1);
const boxGeometry = new THREE.BoxGeometry(3, 0.15, 3);
const torusGeometry = new THREE.TorusGeometry(3, 0.1, 16, 100);

// Materials with better lighting properties
const icosahedronMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ffff,
  metalness: 0.3,
  roughness: 0.4,
  emissive: 0x004444,
});

const boxMaterial = new THREE.MeshStandardMaterial({
  color: 0xff3366,
  metalness: 0.2,
  roughness: 0.8,
  emissive: 0x220011,
});

const torusMaterial = new THREE.MeshStandardMaterial({
  color: 0xffaa00,
  metalness: 0.5,
  roughness: 0.3,
  emissive: 0x442200,
});

// Meshes
const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
const box = new THREE.Mesh(boxGeometry, boxMaterial);
const torus = new THREE.Mesh(torusGeometry, torusMaterial);

box.position.y = -0.8;
torus.position.set(0, 0, 0);
icosahedron.position.set(0, 1, 0);

scene.add(icosahedron, box, torus);

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 50);
spotLight.position.set(10, 10, 10);
spotLight.castShadow = true;
scene.add(spotLight);

const pointLight = new THREE.PointLight(0xff00ff, 30);
pointLight.position.set(-5, 5, 5);
scene.add(pointLight);

// Mouse interaction
let mouseX = 0;
let mouseY = 0;

const onMouseMove = (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
};

window.addEventListener("mousemove", onMouseMove);

// Animation
function animateScene() {
  requestAnimationFrame(animateScene);

  // Rotate objects
  icosahedron.rotation.x += 0.01;
  icosahedron.rotation.y += 0.01;

  box.rotation.y += 0.005;

  torus.rotation.x += 0.005;
  torus.rotation.y += 0.01;
  torus.rotation.z += 0.005;

  // Camera follows mouse slightly
  camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
  camera.position.y += (mouseY * 2 - camera.position.y + 1) * 0.05;
  camera.lookAt(scene.position);

  // Animate point light in a circle
  const time = Date.now() * 0.001;
  pointLight.position.x = Math.sin(time) * 5;
  pointLight.position.z = Math.cos(time) * 5;

  renderer.render(scene, camera);
}

animateScene();

// Handle resize
const onResize = () => {
  const w = window.innerWidth;
  const h = window.innerHeight;

  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
};

window.addEventListener("resize", onResize);
