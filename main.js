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

const hoverTargets = document.querySelectorAll('.hover-target, a, .skill-tag');
hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
        cursorOutline.style.width = '60px';
        cursorOutline.style.height = '60px';
        cursorOutline.style.backgroundColor = 'rgba(74, 222, 128, 0.1)';
        cursorOutline.style.borderColor = 'rgba(74, 222, 128, 0.8)';
    });
    target.addEventListener('mouseleave', () => {
        cursorOutline.style.width = '40px';
        cursorOutline.style.height = '40px';
        cursorOutline.style.backgroundColor = 'transparent';
        cursorOutline.style.borderColor = 'var(--accent)';
    });
});

// --- 2. GSAP Scroll Animations (Text & Staggers) ---
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

// Staggered Title Letters (Hero)
const titleText = document.querySelector('.hero-title:not(.outline-text)');
if (titleText) {
    const text = titleText.innerText;
    titleText.innerHTML = '';
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.innerText = char;
        span.style.display = 'inline-block';
        titleText.appendChild(span);
    });
    gsap.fromTo(titleText.querySelectorAll('span'), 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power4.out", delay: 0.2 }
    );
}

const titleOutline = document.querySelector('.hero-title.outline-text');
if (titleOutline) {
    const text = titleOutline.innerText;
    titleOutline.innerHTML = '';
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.innerText = char;
        span.style.display = 'inline-block';
        titleOutline.appendChild(span);
    });
    gsap.fromTo(titleOutline.querySelectorAll('span'), 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power4.out", delay: 0.4 }
    );
}

// Basic Section Reveals
const revealUpElements = document.querySelectorAll('.reveal-up, .section-heading');
revealUpElements.forEach(el => {
    gsap.fromTo(el, 
        { y: 60, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        }
    );
});

// Stagger Skills
gsap.fromTo('.skill-tag',
    { y: 30, opacity: 0, scale: 0.9 },
    {
        y: 0, opacity: 1, scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
            trigger: '.skills-container',
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    }
);

// Stagger Experience List Items
document.querySelectorAll('.exp-item').forEach(item => {
    const listItems = item.querySelectorAll('li');
    if (listItems.length > 0) {
        gsap.fromTo(listItems,
            { x: -30, opacity: 0 },
            {
                x: 0, opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }
});

// Stagger Project Cards
gsap.fromTo('.project-card',
    { y: 50, opacity: 0 },
    {
        y: 0, opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: '.projects-grid',
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    }
);

// Magnetic Buttons
const magneticEls = document.querySelectorAll('.magnetic');
magneticEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(el, {
            x: x * 0.4,
            y: y * 0.4,
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

// --- 3. Immersive 3D Scene (Helix + Side Crystals + Deep Space) ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

// Deep space fog
scene.fog = new THREE.FogExp2(0x050505, 0.0015);

// Camera setup
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3000);
camera.position.z = 400;
camera.position.y = 100;
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize performance
container.appendChild(renderer.domElement);

// Reusable Glow Texture
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

const colorCyan = new THREE.Color(0x00f0ff);
const colorMagenta = new THREE.Color(0xff0055);
const colorPurple = new THREE.Color(0x8a2be2);

// --- 3A. Central Gaseous Helix ---
const gasCount = 12000;
const gasGeo = new THREE.BufferGeometry();
const gasPositions = new Float32Array(gasCount * 3);
const gasColors = new Float32Array(gasCount * 3);

for (let i = 0; i < gasCount; i++) {
    let arm = i % 3;
    let t = Math.random() * Math.PI * 40; 
    let radius = 50 + Math.random() * 40; 
    let angleOffset = (arm * Math.PI * 2) / 3;
    
    let x = radius * Math.cos(t + angleOffset);
    let y = (t - Math.PI * 20) * 15; 
    let z = radius * Math.sin(t + angleOffset);
    
    x += (Math.random() - 0.5) * 50;
    y += (Math.random() - 0.5) * 50;
    z += (Math.random() - 0.5) * 50;
    
    gasPositions[i * 3] = x;
    gasPositions[i * 3 + 1] = y;
    gasPositions[i * 3 + 2] = z;
    
    let mixColor = arm === 0 ? colorCyan : (arm === 1 ? colorMagenta : colorPurple);
    gasColors[i * 3] = mixColor.r;
    gasColors[i * 3 + 1] = mixColor.g;
    gasColors[i * 3 + 2] = mixColor.b;
}

gasGeo.setAttribute('position', new THREE.BufferAttribute(gasPositions, 3));
gasGeo.setAttribute('color', new THREE.BufferAttribute(gasColors, 3));

const gasMaterial = new THREE.PointsMaterial({
    size: 8,
    vertexColors: true,
    map: glowTexture,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

const gasHelix = new THREE.Points(gasGeo, gasMaterial);
scene.add(gasHelix);

// --- 3B. Neural Network Core ---
const netCount = 150;
const netGeo = new THREE.BufferGeometry();
const netPositions = new Float32Array(netCount * 3);
const netVelocities = [];

for (let i = 0; i < netCount; i++) {
    netPositions[i * 3] = (Math.random() - 0.5) * 200;
    netPositions[i * 3 + 1] = (Math.random() - 0.5) * 800;
    netPositions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    
    netVelocities.push({
        x: (Math.random() - 0.5) * 0.4,
        y: (Math.random() - 0.5) * 0.4,
        z: (Math.random() - 0.5) * 0.4
    });
}
netGeo.setAttribute('position', new THREE.BufferAttribute(netPositions, 3));

const netMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 4,
    map: glowTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const netPoints = new THREE.Points(netGeo, netMaterial);
scene.add(netPoints);

const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x4ade80, // Electric green connections
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending
});
let lineMesh = new THREE.LineSegments(new THREE.BufferGeometry(), lineMaterial);
scene.add(lineMesh);

// --- 3C. Background Outer Nebula (Deep Space effect) ---
const nebulaCount = 8000;
const nebulaGeo = new THREE.BufferGeometry();
const nebulaPos = new Float32Array(nebulaCount * 3);

for(let i = 0; i < nebulaCount; i++) {
    // Spread in a massive wide cylinder OUTSIDE the helix
    let angle = Math.random() * Math.PI * 2;
    let radius = 400 + Math.random() * 600; // Far away
    
    nebulaPos[i * 3] = Math.cos(angle) * radius;
    nebulaPos[i * 3 + 1] = (Math.random() - 0.5) * 2000;
    nebulaPos[i * 3 + 2] = Math.sin(angle) * radius;
}
nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));
const nebulaMat = new THREE.PointsMaterial({
    color: 0x222255, // Deep purple/blue
    size: 15,
    map: glowTexture,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const nebula = new THREE.Points(nebulaGeo, nebulaMat);
scene.add(nebula);

// --- 3D. Floating Data Crystals (On the Sides) ---
const crystals = [];
const crystalGeo = new THREE.IcosahedronGeometry(25, 0);
// Array of glowing materials
const crystalMats = [
    new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.3 }),
    new THREE.MeshBasicMaterial({ color: 0xff0055, wireframe: true, transparent: true, opacity: 0.3 }),
    new THREE.MeshBasicMaterial({ color: 0x4ade80, wireframe: true, transparent: true, opacity: 0.3 })
];

for(let i = 0; i < 40; i++) {
    let mat = crystalMats[Math.floor(Math.random() * crystalMats.length)];
    let mesh = new THREE.Mesh(crystalGeo, mat);
    
    // Position on far left or right
    let side = Math.random() > 0.5 ? 1 : -1;
    mesh.position.x = side * (250 + Math.random() * 200);
    mesh.position.y = (Math.random() - 0.5) * 1500;
    mesh.position.z = (Math.random() - 0.5) * 300;
    
    mesh.userData = {
        rx: (Math.random() - 0.5) * 0.02,
        ry: (Math.random() - 0.5) * 0.02,
        rz: (Math.random() - 0.5) * 0.02,
        floatSpeed: (Math.random() - 0.5) * 0.5
    };
    
    scene.add(mesh);
    crystals.push(mesh);
}


// --- Interactions & Loop ---
let targetMouseX = 0;
let targetMouseY = 0;
window.addEventListener('mousemove', (event) => {
    targetMouseX = (event.clientX - window.innerWidth / 2) * 0.001;
    targetMouseY = (event.clientY - window.innerHeight / 2) * 0.001;
});

let scrollY = window.scrollY;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

const clock = new THREE.Clock();

function animateThree() {
    requestAnimationFrame(animateThree);
    const time = clock.getElapsedTime();
    
    // Rotate elements
    gasHelix.rotation.y = time * 0.08;
    nebula.rotation.y = time * 0.02; // slow background rotation
    
    // Animate Crystals
    crystals.forEach(c => {
        c.rotation.x += c.userData.rx;
        c.rotation.y += c.userData.ry;
        c.rotation.z += c.userData.rz;
        c.position.y += c.userData.floatSpeed;
        
        // Loop back if they float too far
        if(c.position.y > 800) c.position.y = -800;
        if(c.position.y < -800) c.position.y = 800;
    });

    // Animate Neural Network nodes
    const nPos = netPoints.geometry.attributes.position.array;
    const linePositions = [];
    
    for (let i = 0; i < netCount; i++) {
        let ix = i * 3;
        let iy = i * 3 + 1;
        let iz = i * 3 + 2;
        
        nPos[ix] += netVelocities[i].x;
        nPos[iy] += netVelocities[i].y;
        nPos[iz] += netVelocities[i].z;
        
        if (Math.abs(nPos[ix]) > 150) netVelocities[i].x *= -1;
        if (Math.abs(nPos[iy]) > 400) netVelocities[i].y *= -1;
        if (Math.abs(nPos[iz]) > 150) netVelocities[i].z *= -1;
        
        for (let j = i + 1; j < netCount; j++) {
            let jx = j * 3;
            let jy = j * 3 + 1;
            let jz = j * 3 + 2;
            
            let dx = nPos[ix] - nPos[jx];
            let dy = nPos[iy] - nPos[jy];
            let dz = nPos[iz] - nPos[jz];
            let distSq = dx*dx + dy*dy + dz*dz;
            
            if (distSq < 6000) {
                linePositions.push(
                    nPos[ix], nPos[iy], nPos[iz],
                    nPos[jx], nPos[jy], nPos[jz]
                );
            }
        }
    }
    netPoints.geometry.attributes.position.needsUpdate = true;
    
    lineMesh.geometry.dispose();
    lineMesh.geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    
    // Parallax & Scroll camera movement
    camera.position.x += (targetMouseX * 150 - camera.position.x) * 0.05;
    
    let targetCamY = 150 - scrollY * 0.25; 
    camera.position.y += (targetCamY - camera.position.y) * 0.05;
    
    camera.lookAt(0, targetCamY - 150, 0);

    renderer.render(scene, camera);
}
animateThree();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
