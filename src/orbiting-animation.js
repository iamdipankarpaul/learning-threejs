import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvas = document.getElementById("canvas");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);

// Grid helper
const gridHelper = new THREE.GridHelper(100, 30, 0xffffff);
scene.add(gridHelper);

// Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 3, 50);
camera.lookAt(0, 0, 0);

// Orbit Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = true;
controls.minDistance = 3;
controls.maxDistance = 100;
controls.maxPolarAngle = Math.PI * 0.5;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const mainLight = new THREE.PointLight(0xffffff, 1.5, 50);
mainLight.position.set(0, 8, 0);
scene.add(mainLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(15, 10, 10);
scene.add(dirLight);

// Center object for orbit reference
const centerSphere = new THREE.Mesh(
  new THREE.SphereGeometry(2.5, 10, 10),
  new THREE.MeshStandardMaterial({ color: 0xffffff })
);
scene.add(centerSphere);

// ORBITING SPHERE (perfect circular motion)
const orbitSphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.8, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xff8844 })
);
scene.add(orbitSphere);

// ELLIPTICAL MOTION SPHERE
const ellipseSphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x44aaff })
);
scene.add(ellipseSphere);

// TILT ELLIPTICAL MOTION SPHERE
const tiltSphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x44aa77 })
);
scene.add(tiltSphere);

// Animation clock
const clock = new THREE.Clock();

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const time = clock.getElapsedTime();

  const radius = 5;
  const tilt = 1.5;

  // CIRCULAR ORBIT
  orbitSphere.position.x = Math.sin(time) * radius;
  orbitSphere.position.z = Math.cos(time) * radius;

  // ELLIPTICAL MOTION
  ellipseSphere.position.x = Math.sin(time) * (radius + 6);
  ellipseSphere.position.z = Math.cos(time) * (radius + 3);

  // TILT ELLIPTICAL ORBIT
  tiltSphere.position.x = Math.sin(time) * (radius + 15);
  tiltSphere.position.z = Math.cos(time) * (radius + 8);
  tiltSphere.position.y = Math.sin(time) * tilt;

  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
