import * as THREE from "three";

const canvas = document.getElementById("canvas");

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a); // Dark background

// Camera setup
const camera = new THREE.PerspectiveCamera(
    75, // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
);
camera.position.set(0, 3, 12); // Position camera to see all objects
camera.lookAt(0, 0, 0); // Look at center of scene

// Ambient light - provides base illumination for all objects
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// Directional light - acts like sunlight from a specific direction
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Point light - adds a colored accent light
const pointLight = new THREE.PointLight(0x00ffff, 0.5);
pointLight.position.set(-5, 5, 5);
scene.add(pointLight);

// ============================================
// SPHERE GEOMETRY - Perfect for balls, planets, bubbles
// ============================================
const sphereGeometry = new THREE.SphereGeometry(
    1,      // radius
    32,     // widthSegments (more = smoother)
    32      // heightSegments (more = smoother)
);
const sphereMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xff6b6b,
    metalness: 0.3,
    roughness: 0.4
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-4.5, 0, 0); // Position on the left
scene.add(sphere);

// ============================================
// CYLINDER GEOMETRY - Great for pillars, cans, tubes
// ============================================
const cylinderGeometry = new THREE.CylinderGeometry(
    1,      // radiusTop
    1,      // radiusBottom
    2,      // height
    32      // radialSegments (more = smoother circular edge)
);
const cylinderMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x4ecdc4,
    metalness: 0.5,
    roughness: 0.3
});
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinder.position.set(-1.5, 0, 0); // Position center-left
scene.add(cylinder);

// ============================================
// CONE GEOMETRY - Perfect for traffic cones, mountains, party hats
// ============================================
const coneGeometry = new THREE.ConeGeometry(
    1,      // radius of base
    2,      // height
    32      // radialSegments
);
const coneMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffe66d,
    metalness: 0.2,
    roughness: 0.6
});
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.set(1.5, 0, 0); // Position center-right
scene.add(cone);

// ============================================
// TORUS GEOMETRY - Donut shape, great for rings, hoops
// ============================================
const torusGeometry = new THREE.TorusGeometry(
    1,      // radius of torus (donut size)
    0.4,    // tube radius (thickness of donut)
    16,     // radialSegments
    100     // tubularSegments (smoothness around the tube)
);
const torusMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xa8e6cf,
    metalness: 0.6,
    roughness: 0.2
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(4.5, 0, 0); // Position on the right
scene.add(torus);

// Grid helper - shows the ground plane
const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
gridHelper.position.y = -3;
scene.add(gridHelper);

// Create renderer
const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas,
    antialias: true // Smooth edges
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Animation loop - rotate all objects for better viewing
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate all geometries on multiple axes
    const time = Date.now() * 0.001; // Convert to seconds
    
    sphere.rotation.x = time * 0.5;
    sphere.rotation.y = time * 0.7;
    
    cylinder.rotation.x = time * 0.3;
    cylinder.rotation.y = time * 0.5;
    
    cone.rotation.x = time * 0.4;
    cone.rotation.y = time * 0.6;
    
    torus.rotation.x = time * 0.6;
    torus.rotation.y = time * 0.4;
    
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});