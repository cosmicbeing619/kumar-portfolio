// --- Three.js Setup ---
const container = document.getElementById('canvas-container');

// Scene, Camera, Renderer
const scene = new THREE.Scene();
// Add some fog for depth
scene.fog = new THREE.FogExp2(0x0b0c10, 0.001);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// --- Particle System (Data Nodes) ---
const particleCount = 1500;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

// Colors based on CSS variables
const color1 = new THREE.Color(0x66fcf1); // accent-1
const color2 = new THREE.Color(0x45a29e); // accent-2

for (let i = 0; i < particleCount * 3; i += 3) {
    // Random positions in a sphere
    const radius = 60;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    positions[i] = x;
    positions[i + 1] = y;
    positions[i + 2] = z;

    // Mix colors
    const mixedColor = color1.clone().lerp(color2, Math.random());
    colors[i] = mixedColor.r;
    colors[i + 1] = mixedColor.g;
    colors[i + 2] = mixedColor.b;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// --- Interactive Parallax ---
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.05;
    mouseY = (event.clientY - windowHalfY) * 0.05;
});

// Smooth scroll listener for rotation effect
let scrollY = window.scrollY;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// --- Animation Loop ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();

    // Slow rotation
    particles.rotation.y = elapsedTime * 0.05;
    particles.rotation.x = elapsedTime * 0.02;

    // Parallax easing
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    
    camera.position.x += (mouseX * 0.05 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.05 - camera.position.y) * 0.05;
    
    // Add scroll effect to camera Z
    camera.position.z = 30 - (scrollY * 0.01);
    
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

animate();

// --- Window Resize ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Simple Glitch Effect for Title ---
const glitchText = document.querySelector('.glitch');
setInterval(() => {
    if(Math.random() > 0.95) {
        glitchText.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
        glitchText.style.color = '#fff';
        setTimeout(() => {
            glitchText.style.transform = 'translate(0, 0)';
            glitchText.style.color = 'var(--text-primary)';
        }, 50);
    }
}, 100);
