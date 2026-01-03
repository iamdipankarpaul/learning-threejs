import * as THREE from "three";

const canvas = document.getElementById("canvas");

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a); // Very dark background

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 8, 20);
camera.lookAt(0, 0, 0);

// Create a ground plane
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x333333,
  roughness: 0.8,
  metalness: 0.2,
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
ground.position.y = -2;
scene.add(ground);

// Create center sphere
const sphereGeometry = new THREE.SphereGeometry(2, 64, 64);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.3,
  metalness: 0.7,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 0, 0);
scene.add(sphere);

// Create surrounding cubes to show light distribution
const cubeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const cubeMaterial = new THREE.MeshStandardMaterial({
  color: 0x4ecdc4,
  roughness: 0.5,
  metalness: 0.3,
});

const cubes = [];
const cubePositions = [
  [-6, -0.5, 0], // Left
  [6, -0.5, 0], // Right
  [0, -0.5, 6], // Front
];

cubePositions.forEach((pos) => {
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(pos[0], pos[1], pos[2]);
  cubes.push(cube);
  scene.add(cube);
});

// Add a torus for variety
const torusGeometry = new THREE.TorusGeometry(1.5, 0.5, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({
  color: 0xff6b6b,
  roughness: 0.4,
  metalness: 0.6,
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(0, 5, 0);
scene.add(torus);

// ============================================
// 1. AMBIENT LIGHT
// Provides overall base illumination, no direction
// Does not cast shadows
// Use case: Base lighting so nothing is completely black.
// Never use alone, combine with directional lights.
// Performance: Very cheap, no calculations needed.

// No helper for ambient light (it's everywhere equally)
// ============================================
const ambientLight = new THREE.AmbientLight(
  0xffffff, // White light
  0.3 // Low intensity
);
scene.add(ambientLight);

// ============================================
// 2. DIRECTIONAL LIGHT
// Parallel rays like sunlight, illuminates from a direction
// Use case: Outdoor scenes (sun/moon), main key light.
// All rays are parallel regardless of distance.
// Performance: Cheap, good for primary light source.
// ============================================
const directionalLight = new THREE.DirectionalLight(
  0xffffff, // White light
  1.0 // Full intensity
);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Helper to visualize light direction
const directionalHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  2 // Helper size
);
scene.add(directionalHelper);

// ============================================
// 3. POINT LIGHT
// Radiates light in all directions from a point (like a light bulb)
// Use case: Light bulbs, lamps, candles, explosions.
// Light diminishes with distance (uses distance and decay).
// Performance: Medium cost, use sparingly for many lights.
// ============================================
const pointLight = new THREE.PointLight(
  0xff00ff, // Magenta color
  1.0, // Intensity
  50, // Distance (light fades to 0 at this distance)
  2 // Decay (how fast light fades, 2 = realistic)
);
pointLight.position.set(-8, 3, 0);
scene.add(pointLight);

// Helper to visualize light position and range
const pointHelper = new THREE.PointLightHelper(
  pointLight,
  0.5 // Helper sphere size
);
scene.add(pointHelper);

// ============================================
// 4. SPOT LIGHT
// Cone of light from a point (like a flashlight or stage light)
// Use case: Flashlights, stage spotlights, car headlights.
// Creates dramatic focused lighting with soft edges.
// Performance: Most expensive, use carefully.
// ============================================
const spotLight = new THREE.SpotLight(
  0x00ffff, // Cyan color
  1.0, // Intensity
  30, // Distance
  Math.PI / 10, // Angle (cone width in radians)
  0.5, // Penumbra (softness of edge, 0-1)
  2 // Decay
);
spotLight.position.set(-6, 10, 0);
spotLight.target.position.set(0, 0, 0); // Point at center
scene.add(spotLight);
scene.add(spotLight.target); // Target must be in scene

// Helper to visualize cone
const spotHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotHelper);

// ============================================
// 5. HEMISPHERE LIGHT
// Sky/ground ambient lighting (different colors from top/bottom)
// Use case: Outdoor scenes with sky lighting, subtle ambient variation.
// Creates natural-looking ambient from above (sky) and below (ground bounce).
// Performance: Cheap, great alternative to plain ambient light.
// ============================================
const hemisphereLight = new THREE.HemisphereLight(
  0x0066ff, // Sky color (blue)
  0xff6600, // Ground color (orange)
  0.5 // Intensity
);
hemisphereLight.position.set(0, 10, 0);
scene.add(hemisphereLight);

// Helper shows sky and ground colors
const hemisphereHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  2 // Helper size
);
scene.add(hemisphereHelper);

// Store references for toggling
const helpers = {
  directional: directionalHelper,
  point: pointHelper,
  spot: spotHelper,
  hemisphere: hemisphereHelper,
};

// Initially hide some lights to avoid overwhelming the scene
hemisphereLight.visible = false;
hemisphereHelper.visible = false;

// Ambient Light Controls
const ambientToggle = document.getElementById("ambientToggle");
const ambientSlider = document.getElementById("ambientSlider");
const ambientIntensityDisplay = document.getElementById("ambientIntensity");

ambientToggle.addEventListener("change", (e) => {
  ambientLight.visible = e.target.checked;
});

ambientSlider.addEventListener("input", (e) => {
  const value = parseFloat(e.target.value);
  ambientLight.intensity = value;
  ambientIntensityDisplay.textContent = value.toFixed(1);
});

// Directional Light Controls
const directionalToggle = document.getElementById("directionalToggle");
const directionalSlider = document.getElementById("directionalSlider");
const directionalIntensityDisplay = document.getElementById(
  "directionalIntensity"
);

directionalToggle.addEventListener("change", (e) => {
  directionalLight.visible = e.target.checked;
  directionalHelper.visible = e.target.checked;
});

directionalSlider.addEventListener("input", (e) => {
  const value = parseFloat(e.target.value);
  directionalLight.intensity = value;
  directionalIntensityDisplay.textContent = value.toFixed(1);
});

// Point Light Controls
const pointToggle = document.getElementById("pointToggle");
const pointSlider = document.getElementById("pointSlider");
const pointIntensityDisplay = document.getElementById("pointIntensity");

pointToggle.addEventListener("change", (e) => {
  pointLight.visible = e.target.checked;
  pointHelper.visible = e.target.checked;
});

pointSlider.addEventListener("input", (e) => {
  const value = parseFloat(e.target.value);
  pointLight.intensity = value;
  pointIntensityDisplay.textContent = value.toFixed(1);
});

// Spot Light Controls
const spotToggle = document.getElementById("spotToggle");
const spotSlider = document.getElementById("spotSlider");
const spotAngleSlider = document.getElementById("spotAngleSlider");
const spotIntensityDisplay = document.getElementById("spotIntensity");
const spotAngleDisplay = document.getElementById("spotAngle");

spotToggle.addEventListener("change", (e) => {
  spotLight.visible = e.target.checked;
  spotHelper.visible = e.target.checked;
});

spotSlider.addEventListener("input", (e) => {
  const value = parseFloat(e.target.value);
  spotLight.intensity = value;
  spotIntensityDisplay.textContent = value.toFixed(1);
});

spotAngleSlider.addEventListener("input", (e) => {
  const value = parseFloat(e.target.value);
  spotLight.angle = value;
  spotAngleDisplay.textContent = value.toFixed(2);
});

// Hemisphere Light Controls
const hemisphereToggle = document.getElementById("hemisphereToggle");
const hemisphereSlider = document.getElementById("hemisphereSlider");
const hemisphereIntensityDisplay = document.getElementById(
  "hemisphereIntensity"
);

hemisphereToggle.addEventListener("change", (e) => {
  hemisphereLight.visible = e.target.checked;
  hemisphereHelper.visible = e.target.checked;
});

hemisphereSlider.addEventListener("input", (e) => {
  const value = parseFloat(e.target.value);
  hemisphereLight.intensity = value;
  hemisphereIntensityDisplay.textContent = value.toFixed(1);
});

// Helpers Toggle
const helpersToggle = document.getElementById("helpersToggle");
helpersToggle.addEventListener("change", (e) => {
  const visible = e.target.checked;
  Object.values(helpers).forEach((helper) => {
    // Only show helper if its light is also visible
    const lightVisible = helper.light ? helper.light.visible : true;
    helper.visible = visible && lightVisible;
  });
});

// Renderer setup
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.001;

  // Rotate center sphere
  sphere.rotation.y = time * 0.3;

  // Rotate torus
  torus.rotation.x = time * 0.5;
  torus.rotation.y = time * 0.05;

  // Gently bob cubes up and down
  cubes.forEach((cube, index) => {
    cube.position.y = -0.5 + Math.sin(time + index) * 0.3;
    cube.rotation.y = time * 0.5;
  });

  // Animate point light in a circle
  pointLight.position.x = Math.cos(time * 0.5) * 8;
  pointLight.position.z = Math.sin(time * 0.5) * 8;

  // Update helpers
  if (spotHelper.visible) spotHelper.update();
  if (directionalHelper.visible) directionalHelper.update();

  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
