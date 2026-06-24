// --- 1. Custom Cursor Logic ---
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let outlineX = mouseX;
let outlineY = mouseY;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
});

function animateCursor() {
    let dx = mouseX - outlineX;
    let dy = mouseY - outlineY;
    
    outlineX += dx * 0.15;
    outlineY += dy * 0.15;
    
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

const hoverTargets = document.querySelectorAll('.hover-target');
hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
        cursorOutline.style.width = '60px';
        cursorOutline.style.height = '60px';
        cursorOutline.style.backgroundColor = 'rgba(74, 222, 128, 0.1)';
    });
    target.addEventListener('mouseleave', () => {
        cursorOutline.style.width = '40px';
        cursorOutline.style.height = '40px';
        cursorOutline.style.backgroundColor = 'transparent';
    });
});

// --- 2. GSAP Scroll Animations ---
gsap.registerPlugin(ScrollTrigger);

gsap.to(".hero-content", {
    yPercent: 50,
    ease: "none",
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

const revealUpElements = document.querySelectorAll('.reveal-up');
revealUpElements.forEach(el => {
    gsap.fromTo(el, 
        { y: 50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        }
    );
});

const magneticEls = document.querySelectorAll('.magnetic');
magneticEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(el, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    el.addEventListener('mouseleave', () => {
        gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
        });
    });
});

// --- 3. Immersive Colorful Helix & Neural Network Background ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

// Fog to blend particles into the distance
scene.fog = new THREE.FogExp2(0x050505, 0.002);

// Camera setup
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.z = 300;
camera.position.y = 100;
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
// Use additive blending for glowing effect
container.appendChild(renderer.domElement);

// --- Particle Textures (Soft Glow) ---
function createGlowTexture() {
    let canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    let context = canvas.getContext('2d');
    let gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 32, 32);
    let texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}
const glowTexture = createGlowTexture();

// --- 3A. Gaseous Colorful Helix ---
const gasCount = 15000;
const gasGeo = new THREE.BufferGeometry();
const gasPositions = new Float32Array(gasCount * 3);
const gasColors = new Float32Array(gasCount * 3);
// For animation
const gasPhases = new Float32Array(gasCount);

const colorCyan = new THREE.Color(0x00f0ff);
const colorMagenta = new THREE.Color(0xff0055);
const colorPurple = new THREE.Color(0x8a2be2);

for (let i = 0; i < gasCount; i++) {
    // 3 arms of the helix
    let arm = i % 3;
    let t = Math.random() * Math.PI * 40; // Height spread (20 turns)
    
    // Spread for gaseous volume
    let radius = 60 + Math.random() * 40; 
    let angleOffset = (arm * Math.PI * 2) / 3;
    
    let x = radius * Math.cos(t + angleOffset);
    let y = (t - Math.PI * 20) * 12; // vertical spread from -something to +something
    let z = radius * Math.sin(t + angleOffset);
    
    // Add noise for a fuzzy, cloud-like distribution
    x += (Math.random() - 0.5) * 60;
    y += (Math.random() - 0.5) * 60;
    z += (Math.random() - 0.5) * 60;
    
    gasPositions[i * 3] = x;
    gasPositions[i * 3 + 1] = y;
    gasPositions[i * 3 + 2] = z;
    
    // Mix Colors
    let mixColor = arm === 0 ? colorCyan : (arm === 1 ? colorMagenta : colorPurple);
    gasColors[i * 3] = mixColor.r;
    gasColors[i * 3 + 1] = mixColor.g;
    gasColors[i * 3 + 2] = mixColor.b;

    // Random phase for wafting animation
    gasPhases[i] = Math.random() * Math.PI * 2;
}

gasGeo.setAttribute('position', new THREE.BufferAttribute(gasPositions, 3));
gasGeo.setAttribute('color', new THREE.BufferAttribute(gasColors, 3));
gasGeo.setAttribute('phase', new THREE.BufferAttribute(gasPhases, 1));

const gasMaterial = new THREE.PointsMaterial({
    size: 6,
    vertexColors: true,
    map: glowTexture,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

const gasHelix = new THREE.Points(gasGeo, gasMaterial);
scene.add(gasHelix);

// --- 3B. Neural Network ---
// A sparse collection of points inside the helix that draw connecting lines
const netCount = 200;
const netGeo = new THREE.BufferGeometry();
const netPositions = new Float32Array(netCount * 3);
const netVelocities = [];

for (let i = 0; i < netCount; i++) {
    netPositions[i * 3] = (Math.random() - 0.5) * 300;
    netPositions[i * 3 + 1] = (Math.random() - 0.5) * 600;
    netPositions[i * 3 + 2] = (Math.random() - 0.5) * 300;
    
    netVelocities.push({
        x: (Math.random() - 0.5) * 0.5,
        y: (Math.random() - 0.5) * 0.5,
        z: (Math.random() - 0.5) * 0.5
    });
}
netGeo.setAttribute('position', new THREE.BufferAttribute(netPositions, 3));

const netMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 3,
    map: glowTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const netPoints = new THREE.Points(netGeo, netMaterial);
scene.add(netPoints);

// The lines representing neural connections
const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending
});
let lineMesh = new THREE.LineSegments(new THREE.BufferGeometry(), lineMaterial);
scene.add(lineMesh);

// Mouse parallax effect setup
let targetMouseX = 0;
let targetMouseY = 0;
window.addEventListener('mousemove', (event) => {
    targetMouseX = (event.clientX - window.innerWidth / 2) * 0.001;
    targetMouseY = (event.clientY - window.innerHeight / 2) * 0.001;
});

// Scroll interaction
let scrollY = window.scrollY;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

const clock = new THREE.Clock();

function animateThree() {
    requestAnimationFrame(animateThree);
    const time = clock.getElapsedTime();
    
    // 1. Rotate the whole gaseous helix
    gasHelix.rotation.y = time * 0.1;
    
    // Wafting gas effect (optional sine wave distortion on geometry, but expensive)
    // Instead, we just rotate it, and use additive blending to make it look fluid.

    // 2. Animate Neural Network nodes
    const nPos = netPoints.geometry.attributes.position.array;
    const linePositions = [];
    
    for (let i = 0; i < netCount; i++) {
        let ix = i * 3;
        let iy = i * 3 + 1;
        let iz = i * 3 + 2;
        
        // Move nodes
        nPos[ix] += netVelocities[i].x;
        nPos[iy] += netVelocities[i].y;
        nPos[iz] += netVelocities[i].z;
        
        // Bounding box bounce
        if (Math.abs(nPos[ix]) > 150) netVelocities[i].x *= -1;
        if (Math.abs(nPos[iy]) > 400) netVelocities[i].y *= -1;
        if (Math.abs(nPos[iz]) > 150) netVelocities[i].z *= -1;
        
        // Form connections if close enough
        for (let j = i + 1; j < netCount; j++) {
            let jx = j * 3;
            let jy = j * 3 + 1;
            let jz = j * 3 + 2;
            
            let dx = nPos[ix] - nPos[jx];
            let dy = nPos[iy] - nPos[jy];
            let dz = nPos[iz] - nPos[jz];
            let distSq = dx*dx + dy*dy + dz*dz;
            
            // Connect if distance squared < 5000 (roughly ~70 units)
            if (distSq < 5000) {
                linePositions.push(
                    nPos[ix], nPos[iy], nPos[iz],
                    nPos[jx], nPos[jy], nPos[jz]
                );
            }
        }
    }
    netPoints.geometry.attributes.position.needsUpdate = true;
    
    // Update lines geometry
    lineMesh.geometry.dispose();
    lineMesh.geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    
    // 3. Move camera smoothly based on mouse (parallax) and scroll
    camera.position.x += (targetMouseX * 100 - camera.position.x) * 0.05;
    // Base Y is 100, scroll pushes camera down the helix
    let targetCamY = 100 - scrollY * 0.2; 
    camera.position.y += (targetCamY - camera.position.y) * 0.05;
    
    camera.lookAt(0, targetCamY - 100, 0);

    renderer.render(scene, camera);
}
animateThree();

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
