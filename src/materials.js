import * as THREE from "three";

const canvas = document.getElementById("canvas");

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e); // Dark blue background

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 15); // Pull back to see all spheres
camera.lookAt(0, 0, 0);

// Ambient light - base illumination for all objects
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Directional light - main light source (like sunlight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Point light - adds dynamic colored lighting
const pointLight = new THREE.PointLight(0xff00ff, 1);
pointLight.position.set(-5, 3, 5);
scene.add(pointLight);

// Another point light on the opposite side
const pointLight2 = new THREE.PointLight(0x00ffff, 0.8);
pointLight2.position.set(5, -3, 5);
scene.add(pointLight2);

// ============================================
// 1. MESH BASIC MATERIAL
// Simplest material - NO lighting calculation
// Use case: UI elements, backgrounds, objects that should
// always be visible regardless of lighting
// ============================================
const basicMaterial = new THREE.MeshBasicMaterial({
  color: 0xff6b6b, // Red color
  wireframe: false, // Show as solid (not wireframe)
});

// ============================================
// 2. MESH LAMBERT MATERIAL
// Matte (non-shiny) surfaces with lighting
// Use case: Matte surfaces like paper, unpolished wood,
// fabric, chalk. Good performance for non-reflective objects.
// ============================================
const lambertMaterial = new THREE.MeshLambertMaterial({
  color: 0x4ecdc4, // Cyan color
  emissive: 0x000000, // No glow by default
  wireframe: false,
});

// ============================================
// 3. MESH PHONG MATERIAL
// Shiny surfaces with specular highlights
// Use case: Plastic, polished surfaces, glossy paint.
// Creates visible light reflections (specular highlights).
// ============================================
const phongMaterial = new THREE.MeshPhongMaterial({
  color: 0xffe66d, // Yellow color
  shininess: 100, // How shiny (0-100+)
  specular: 0xffffff, // Color of the shine
  emissive: 0x000000,
  wireframe: false,
});

// ============================================
// 4. MESH STANDARD MATERIAL
// Physically Based Rendering (PBR) - realistic materials
// Use case: Most modern 3D applications. Provides realistic
// materials using metalness/roughness workflow. Good for
// metals, plastics, and general realistic rendering.
// ============================================
const standardMaterial = new THREE.MeshStandardMaterial({
  color: 0xa8e6cf, // Mint green
  metalness: 0.5, // How metallic (0 = non-metal, 1 = full metal)
  roughness: 0.5, // Surface roughness (0 = smooth, 1 = rough)
  emissive: 0x000000,
  wireframe: false,
});

// ============================================
// 5. MESH PHYSICAL MATERIAL
// Advanced PBR with extra features
// Use case: Car paint, gems, high-quality materials that need
// extra realism. Most expensive performance-wise but most realistic.
// ============================================
const physicalMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffa8e8, // Pink
  metalness: 0.8,
  roughness: 0.2,
  clearcoat: 1.0, // Clear coating layer (like car paint)
  clearcoatRoughness: 0.1, // Roughness of the clear coat
  reflectivity: 1.0, // How reflective
  emissive: 0x000000,
  wireframe: false,
});

// Create base geometry (we'll reuse this for all spheres)
const sphereGeometry = new THREE.SphereGeometry(1.5, 64, 64);
// Using 64 segments for smooth appearance

// Create 5 spheres, each with a different material
const basicSphere = new THREE.Mesh(sphereGeometry, basicMaterial);
basicSphere.position.set(-8, 2, 0);
scene.add(basicSphere);

const lambertSphere = new THREE.Mesh(sphereGeometry, lambertMaterial);
lambertSphere.position.set(-4, 2, 0);
scene.add(lambertSphere);

const phongSphere = new THREE.Mesh(sphereGeometry, phongMaterial);
phongSphere.position.set(0, 2, 0);
scene.add(phongSphere);

const standardSphere = new THREE.Mesh(sphereGeometry, standardMaterial);
standardSphere.position.set(4, 2, 0);
scene.add(standardSphere);

const physicalSphere = new THREE.Mesh(sphereGeometry, physicalMaterial);
physicalSphere.position.set(8, 2, 0);
scene.add(physicalSphere);

// Store references for interactive controls
const spheres = [
  basicSphere,
  lambertSphere,
  phongSphere,
  standardSphere,
  physicalSphere,
];
const materials = [
  basicMaterial,
  lambertMaterial,
  phongMaterial,
  standardMaterial,
  physicalMaterial,
];

// Create text labels using canvas textures
function createTextLabel(text) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 512;
  canvas.height = 128;

  context.fillStyle = "#000000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.font = "Bold 48px Arial";
  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.fillText(text, canvas.width / 2, canvas.height / 2 + 16);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(4, 1, 1);

  return sprite;
}

// Add labels below each sphere
const labels = [
  { text: "Basic", position: [-8, 0, 0] },
  { text: "Lambert", position: [-4, 0, 0] },
  { text: "Phong", position: [0, 0, 0] },
  { text: "Standard", position: [4, 0, 0] },
  { text: "Physical", position: [8, 0, 0] },
];

labels.forEach((label) => {
  const sprite = createTextLabel(label.text);
  sprite.position.set(label.position[0], label.position[1], label.position[2]);
  scene.add(sprite);
});

// Get control elements
const metalnessSlider = document.getElementById("metalness");
const roughnessSlider = document.getElementById("roughness");
const opacitySlider = document.getElementById("opacity");
const wireframeBtn = document.getElementById("toggleWireframe");
const emissiveBtn = document.getElementById("toggleEmissive");

const metalnessValue = document.getElementById("metalnessValue");
const roughnessValue = document.getElementById("roughnessValue");
const opacityValue = document.getElementById("opacityValue");

// Metalness control (only affects Standard and Physical materials)
metalnessSlider.addEventListener("input", (e) => {
  const value = parseFloat(e.target.value);
  metalnessValue.textContent = value.toFixed(1);

  // Only Standard and Physical materials have metalness
  standardMaterial.metalness = value;
  physicalMaterial.metalness = value;
});

// Roughness control (only affects Standard and Physical materials)
roughnessSlider.addEventListener("input", (e) => {
  const value = parseFloat(e.target.value);
  roughnessValue.textContent = value.toFixed(1);

  standardMaterial.roughness = value;
  physicalMaterial.roughness = value;
});

// Opacity control (affects all materials)
opacitySlider.addEventListener("input", (e) => {
  const value = parseFloat(e.target.value);
  opacityValue.textContent = value.toFixed(1);

  // Enable transparency and set opacity for all materials
  materials.forEach((material) => {
    material.transparent = value < 1.0;
    material.opacity = value;
  });
});

// Wireframe toggle
let wireframeEnabled = false;
wireframeBtn.addEventListener("click", () => {
  wireframeEnabled = !wireframeEnabled;
  materials.forEach((material) => {
    material.wireframe = wireframeEnabled;
  });
});

// Emissive (glow) toggle
let emissiveEnabled = false;
emissiveBtn.addEventListener("click", () => {
  emissiveEnabled = !emissiveEnabled;

  // Basic material doesn't have emissive property
  lambertMaterial.emissive.setHex(emissiveEnabled ? 0x002222 : 0x000000);
  phongMaterial.emissive.setHex(emissiveEnabled ? 0x222200 : 0x000000);
  standardMaterial.emissive.setHex(emissiveEnabled ? 0x002200 : 0x000000);
  physicalMaterial.emissive.setHex(emissiveEnabled ? 0x220022 : 0x000000);
});

// Create renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Animation loop - rotate spheres and animate lights
function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.001; // Convert to seconds

  // Rotate all spheres on Y axis
  spheres.forEach((sphere) => {
    sphere.rotation.y = time * 0.5;
    sphere.rotation.x = Math.sin(time * 0.3) * 0.2;
  });

  // Animate point lights in circles
  pointLight.position.x = Math.sin(time) * 8;
  pointLight.position.z = Math.cos(time) * 8;

  pointLight2.position.x = Math.sin(time + Math.PI) * 8;
  pointLight2.position.z = Math.cos(time + Math.PI) * 8;

  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
