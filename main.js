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
    gsap.fromTo(el, 
        { y: 50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%", // Trigger when element is 85% down the viewport
                toggleActions: "play none none reverse"
            }
        }
    );
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

// --- 3. Immersive "Warp Speed" Three.js Background ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 1;
camera.rotation.x = Math.PI / 2; // Looking straight down the tunnel

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Stars setup
const starCount = 6000;
const starGeo = new THREE.BufferGeometry();
const starPositions = new Float32Array(starCount * 3);
const starVelocities = new Float32Array(starCount);

for (let i = 0; i < starCount; i++) {
    // Spread stars in a wide cylinder shape
    starPositions[i * 3] = Math.random() * 600 - 300;     // x
    starPositions[i * 3 + 1] = Math.random() * 600 - 300; // y
    starPositions[i * 3 + 2] = Math.random() * 600 - 300; // z
    
    // Initial velocity
    starVelocities[i] = 0;
}

starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
starGeo.setAttribute('velocity', new THREE.BufferAttribute(starVelocities, 1));

// Custom texture for glowing stars
let canvas = document.createElement('canvas');
canvas.width = 16;
canvas.height = 16;
let context = canvas.getContext('2d');
let gradient = context.createRadialGradient(8, 8, 0, 8, 8, 8);
gradient.addColorStop(0, 'rgba(255,255,255,1)');
gradient.addColorStop(0.2, 'rgba(74,222,128,1)'); // electric green core
gradient.addColorStop(0.4, 'rgba(74,222,128,0.3)');
gradient.addColorStop(1, 'rgba(0,0,0,0)');
context.fillStyle = gradient;
context.fillRect(0, 0, 16, 16);
let texture = new THREE.Texture(canvas);
texture.needsUpdate = true;

const starMaterial = new THREE.PointsMaterial({
    color: 0x4ade80,
    size: 1.5,
    map: texture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

const stars = new THREE.Points(starGeo, starMaterial);
scene.add(stars);

// Mouse parallax effect
let targetMouseX = 0;
let targetMouseY = 0;
window.addEventListener('mousemove', (event) => {
    targetMouseX = (event.clientX - window.innerWidth / 2) * 0.0005;
    targetMouseY = (event.clientY - window.innerHeight / 2) * 0.0005;
});

function animateThree() {
    requestAnimationFrame(animateThree);
    
    const positions = starGeo.attributes.position.array;
    const velocities = starGeo.attributes.velocity.array;
    
    for (let i = 0; i < starCount; i++) {
        // Accelerate stars towards camera (falling effect)
        velocities[i] += 0.02;
        let yIndex = i * 3 + 1;
        
        positions[yIndex] -= velocities[i];
        
        // If star goes past camera, reset it far away
        if (positions[yIndex] < -200) {
            positions[yIndex] = 200;
            velocities[i] = 0;
        }
    }
    
    starGeo.attributes.position.needsUpdate = true;
    
    // Smooth camera rotation based on mouse
    camera.rotation.y += (targetMouseX - camera.rotation.y) * 0.05;
    camera.rotation.x += (-targetMouseY + Math.PI / 2 - camera.rotation.x) * 0.05;
    
    // Rotate the whole starfield slowly
    stars.rotation.y += 0.002;

    renderer.render(scene, camera);
}
animateThree();

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
