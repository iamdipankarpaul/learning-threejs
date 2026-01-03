import * as THREE from "three";

const canvas = document.getElementById("canvas");

// 1. scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// 2. camera
const w = window.innerWidth;
const h = window.innerHeight;

const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0, 0, 5);

// 3. geometry
const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 0);
const boxGeometry = new THREE.BoxGeometry(2, 0.1, 2);

// 4. material
const icosahedronMaterial = new THREE.MeshLambertMaterial({
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
box.position.y = -1.5;

scene.add(icosahedron);
scene.add(box);

// 6. light
const spotLight = new THREE.SpotLight(0xffffff, 100);
spotLight.position.set(10, 10, 10);
scene.add(spotLight);

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
