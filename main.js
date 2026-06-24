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
    
    // Dot follows exactly
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
});

// Animate outline with easing
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

// Hover Effects for cursor
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

// Hero Parallax
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

// Reveal Up Animation
const revealUpElements = document.querySelectorAll('.reveal-up');
revealUpElements.forEach(el => {
    gsap.to(el, {
        scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
    });
});

// Magnetic Buttons
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

// --- 3. Advanced Three.js Neural Network ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 200;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Particles setup
const particleCount = 400; // optimized for lines
const particles = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
const particleVelocities = [];

for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 400;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 400;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 400;
    
    particleVelocities.push({
        x: (Math.random() - 0.5) * 0.2,
        y: (Math.random() - 0.5) * 0.2,
        z: (Math.random() - 0.5) * 0.2
    });
}

particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

const particleMaterial = new THREE.PointsMaterial({
    color: 0x4ade80,
    size: 2,
    transparent: true,
    opacity: 0.8
});

const particleSystem = new THREE.Points(particles, particleMaterial);
scene.add(particleSystem);

// Lines setup
const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x4ade80,
    transparent: true,
    opacity: 0.15
});

// We will recreate geometry for lines every frame
let lineGeometry = new THREE.BufferGeometry();
let linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
scene.add(linesMesh);

// Convert mouse position to 3D space
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let mouse3D = new THREE.Vector3(0, 0, 0);

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.at(200, mouse3D);
});

function animateThree() {
    requestAnimationFrame(animateThree);
    
    const positions = particleSystem.geometry.attributes.position.array;
    const linePositions = [];
    
    // Update particle positions and check connections
    for (let i = 0; i < particleCount; i++) {
        let ix = i * 3;
        let iy = i * 3 + 1;
        let iz = i * 3 + 2;
        
        // Move
        positions[ix] += particleVelocities[i].x;
        positions[iy] += particleVelocities[i].y;
        positions[iz] += particleVelocities[i].z;
        
        // Mouse interaction (Repel)
        let dxMouse = positions[ix] - mouse3D.x;
        let dyMouse = positions[iy] - mouse3D.y;
        let distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        
        if (distMouse < 50) {
            let force = (50 - distMouse) * 0.02;
            positions[ix] += (dxMouse / distMouse) * force;
            positions[iy] += (dyMouse / distMouse) * force;
        }

        // Bounce off walls
        if (Math.abs(positions[ix]) > 200) particleVelocities[i].x *= -1;
        if (Math.abs(positions[iy]) > 200) particleVelocities[i].y *= -1;
        if (Math.abs(positions[iz]) > 200) particleVelocities[i].z *= -1;
        
        // Check connections
        for (let j = i + 1; j < particleCount; j++) {
            let jx = j * 3;
            let jy = j * 3 + 1;
            let jz = j * 3 + 2;
            
            let dx = positions[ix] - positions[jx];
            let dy = positions[iy] - positions[jy];
            let dz = positions[iz] - positions[jz];
            let dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            if (dist < 35) {
                linePositions.push(
                    positions[ix], positions[iy], positions[iz],
                    positions[jx], positions[jy], positions[jz]
                );
            }
        }
    }
    
    particleSystem.geometry.attributes.position.needsUpdate = true;
    
    // Update lines
    linesMesh.geometry.dispose();
    linesMesh.geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    
    // Slight rotation of the whole system
    particleSystem.rotation.y += 0.001;
    linesMesh.rotation.y += 0.001;

    renderer.render(scene, camera);
}
animateThree();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
