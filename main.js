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
        cursorOutline.style.backgroundColor = 'rgba(255, 136, 0, 0.1)';
        cursorOutline.style.borderColor = 'rgba(255, 136, 0, 0.8)';
    });
    target.addEventListener('mouseleave', () => {
        cursorOutline.style.width = '40px';
        cursorOutline.style.height = '40px';
        cursorOutline.style.backgroundColor = 'transparent';
        cursorOutline.style.borderColor = 'var(--accent)';
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

const titles = document.querySelectorAll('.hero-title');
titles.forEach((title, index) => {
    const text = title.innerText;
    title.innerHTML = '';
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.innerText = char;
        span.style.display = 'inline-block';
        title.appendChild(span);
    });
    
    gsap.fromTo(title.querySelectorAll('span'), 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power4.out", delay: 0.2 + (index * 0.4) }
    );
});

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

const magneticEls = document.querySelectorAll('.magnetic');
magneticEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: "power2.out" });
    });
    
    el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    });
});

const skillTags = document.querySelectorAll('.skill-tag');
skillTags.forEach(tag => {
    tag.addEventListener('mousemove', (e) => {
        const rect = tag.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -15; 
        const rotateY = ((x - centerX) / centerX) * 15;
        tag.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.1, 1.1, 1.1)`;
    });
    
    tag.addEventListener('mouseleave', () => {
        tag.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
    });
});

// --- 3. Immersive 3D Scene ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

scene.fog = new THREE.FogExp2(0x050505, 0.0012);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 4000);
camera.position.z = 400;
camera.position.y = 100;
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
container.appendChild(renderer.domElement);

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

const colorRed = new THREE.Color(0xff1100);
const colorOrange = new THREE.Color(0xff6600);
const colorYellow = new THREE.Color(0xffcc00);

// --- 3A. Falling Fluid Gas Column ---
const gasCount = 15000;
const gasGeo = new THREE.BufferGeometry();
const gasPositions = new Float32Array(gasCount * 3);
const gasColors = new Float32Array(gasCount * 3);
const gasVelocities = [];

for (let i = 0; i < gasCount; i++) {
    let radius = Math.random() * 250; 
    let theta = Math.random() * Math.PI * 2;
    
    let x = radius * Math.cos(theta);
    let y = (Math.random() - 0.5) * 2500; 
    let z = radius * Math.sin(theta);
    
    gasPositions[i * 3] = x;
    gasPositions[i * 3 + 1] = y;
    gasPositions[i * 3 + 2] = z;
    
    gasVelocities.push({ x: 0, y: 0, z: 0 });
    
    let rnd = Math.random();
    let mixColor;
    if (rnd < 0.4) mixColor = colorRed;
    else if (rnd < 0.8) mixColor = colorOrange;
    else mixColor = colorYellow;
    
    gasColors[i * 3] = mixColor.r;
    gasColors[i * 3 + 1] = mixColor.g;
    gasColors[i * 3 + 2] = mixColor.b;
}

gasGeo.setAttribute('position', new THREE.BufferAttribute(gasPositions, 3));
gasGeo.setAttribute('color', new THREE.BufferAttribute(gasColors, 3));

const gasMaterial = new THREE.PointsMaterial({
    size: 18, 
    vertexColors: true,
    map: glowTexture,
    transparent: true,
    opacity: 0.2, 
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

const gasFluid = new THREE.Points(gasGeo, gasMaterial);
scene.add(gasFluid);

// --- 3B. Background Outer Nebula (Warm Space effect) ---
const nebulaCount = 8000;
const nebulaGeo = new THREE.BufferGeometry();
const nebulaPos = new Float32Array(nebulaCount * 3);
const nebulaColors = new Float32Array(nebulaCount * 3);

for(let i = 0; i < nebulaCount; i++) {
    let angle = Math.random() * Math.PI * 2;
    let radius = 600 + Math.random() * 800; 
    
    nebulaPos[i * 3] = Math.cos(angle) * radius;
    nebulaPos[i * 3 + 1] = (Math.random() - 0.5) * 2500;
    nebulaPos[i * 3 + 2] = Math.sin(angle) * radius;
    
    let mixColor = Math.random() > 0.5 ? colorRed : colorOrange;
    nebulaColors[i * 3] = mixColor.r * 0.3; 
    nebulaColors[i * 3 + 1] = mixColor.g * 0.3;
    nebulaColors[i * 3 + 2] = mixColor.b * 0.3;
}
nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));
nebulaGeo.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));
const nebulaMat = new THREE.PointsMaterial({
    vertexColors: true,
    size: 30,
    map: glowTexture,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const nebula = new THREE.Points(nebulaGeo, nebulaMat);
scene.add(nebula);

// --- 3C. Interactable Floating Data Crystals (Warm Themed) ---
const crystals = [];
for(let i = 0; i < 120; i++) {
    let geoType = Math.random();
    let geo;
    if(geoType > 0.6) geo = new THREE.IcosahedronGeometry(15 + Math.random()*20, 0);
    else if(geoType > 0.3) geo = new THREE.TetrahedronGeometry(15 + Math.random()*20, 0);
    else geo = new THREE.OctahedronGeometry(15 + Math.random()*20, 0);
    
    let colorArray = [0xff0000, 0xff6600, 0xffcc00];
    let matColor = colorArray[Math.floor(Math.random() * colorArray.length)];
    let mat = new THREE.MeshBasicMaterial({ color: matColor, wireframe: true, transparent: true, opacity: 0.4 });
    
    let mesh = new THREE.Mesh(geo, mat);
    
    let side = Math.random() > 0.5 ? 1 : -1;
    mesh.position.x = side * (150 + Math.random() * 400);
    mesh.position.y = (Math.random() - 0.5) * 2000;
    mesh.position.z = (Math.random() - 0.5) * 600;
    
    mesh.userData = {
        rx: (Math.random() - 0.5) * 0.04,
        ry: (Math.random() - 0.5) * 0.04,
        rz: (Math.random() - 0.5) * 0.04,
        floatSpeed: (Math.random() - 0.5) * 1.5,
        targetScale: 1,
        isHit: false,
        originalColor: matColor
    };
    
    scene.add(mesh);
    crystals.push(mesh);
}

// --- 3D. 3D EXPLOSION ON CLICK (White Hot) ---
const explosionCount = 3000;
const expGeo = new THREE.BufferGeometry();
const expPos = new Float32Array(explosionCount * 3);
const expVel = [];

for(let i=0; i<explosionCount; i++) {
    expPos[i*3] = 99999; 
    expPos[i*3+1] = 99999;
    expPos[i*3+2] = 99999;
    expVel.push(new THREE.Vector3(0,0,0));
}
expGeo.setAttribute('position', new THREE.BufferAttribute(expPos, 3));
const expMat = new THREE.PointsMaterial({
    color: 0xffffff, 
    size: 10,
    map: glowTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const explosionSystem = new THREE.Points(expGeo, expMat);
scene.add(explosionSystem);

// --- Event Listeners & Interaction ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let mouse3D = new THREE.Vector3(0, 0, 0);
let clickScatterForce = 0;

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('mousedown', (e) => {
    const ripple = document.createElement('div');
    ripple.classList.add('cursor-click-effect');
    ripple.style.borderColor = '#ff8800'; 
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    setTimeout(() => { ripple.remove(); }, 600);

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(crystals);
    if (intersects.length > 0) {
        let hitCrystal = intersects[0].object;
        hitCrystal.userData.isHit = true;
        hitCrystal.userData.targetScale = 3.0; 
        hitCrystal.material.color.setHex(0xffffff); 
        hitCrystal.userData.rx = (Math.random() - 0.5) * 0.5;
        hitCrystal.userData.ry = (Math.random() - 0.5) * 0.5;
        
        mouse3D.copy(hitCrystal.position);
        clickScatterForce = 500; 
    } else {
        raycaster.ray.at(400, mouse3D); 
        clickScatterForce = 600; 
        
        for(let i=0; i<explosionCount; i++) {
            expPos[i*3] = mouse3D.x;
            expPos[i*3+1] = mouse3D.y;
            expPos[i*3+2] = mouse3D.z;
            
            let u = Math.random();
            let v = Math.random();
            let theta = u * 2.0 * Math.PI;
            let phi = Math.acos(2.0 * v - 1.0);
            let r = Math.cbrt(Math.random()) * 35; 
            
            expVel[i].set(
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.sin(phi) * Math.sin(theta),
                r * Math.cos(phi)
            );
        }
        explosionSystem.geometry.attributes.position.needsUpdate = true;
    }
});

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
    
    gasFluid.rotation.y = time * 0.01; 
    nebula.rotation.y = time * 0.01; 
    
    // 1. Fluid Wavy Falling Gas Physics
    const gPos = gasFluid.geometry.attributes.position.array;
    for (let i = 0; i < gasCount; i++) {
        let ix = i * 3;
        let iy = i * 3 + 1;
        let iz = i * 3 + 2;
        
        gasVelocities[i].y -= 0.08;
        
        let waveX = Math.sin(gPos[iy] * 0.005 + time * 1.5) * 0.3;
        let waveZ = Math.cos(gPos[iy] * 0.004 + time * 1.2) * 0.3;
        gasVelocities[i].x += waveX;
        gasVelocities[i].z += waveZ;
        
        if (clickScatterForce > 1) {
            let dx = gPos[ix] - mouse3D.x;
            let dy = gPos[iy] - mouse3D.y;
            let dz = gPos[iz] - mouse3D.z;
            let dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
            if(dist > 0 && dist < 1500) { 
                gasVelocities[i].x += (dx / dist) * clickScatterForce * 0.15 * Math.random();
                gasVelocities[i].y += (dy / dist) * clickScatterForce * 0.15 * Math.random();
                gasVelocities[i].z += (dz / dist) * clickScatterForce * 0.15 * Math.random();
            }
        }
        
        gPos[ix] += gasVelocities[i].x;
        gPos[iy] += gasVelocities[i].y;
        gPos[iz] += gasVelocities[i].z;
        
        gPos[ix] *= 0.995;
        gPos[iz] *= 0.995;
        
        gasVelocities[i].x *= 0.92;
        gasVelocities[i].y *= 0.98; 
        gasVelocities[i].z *= 0.92;
        
        if (gPos[iy] < -1200) {
            gPos[iy] = 1200 + Math.random() * 200; 
            gasVelocities[i].y = 0; 
            let radius = Math.random() * 250; 
            let theta = Math.random() * Math.PI * 2;
            gPos[ix] = radius * Math.cos(theta);
            gPos[iz] = radius * Math.sin(theta);
        }
    }
    gasFluid.geometry.attributes.position.needsUpdate = true;

    // 2. Animate Crystals
    crystals.forEach(c => {
        c.rotation.x += c.userData.rx;
        c.rotation.y += c.userData.ry;
        c.rotation.z += c.userData.rz;
        c.position.y += c.userData.floatSpeed;
        
        if(c.position.y > 1000) c.position.y = -1000;
        if(c.position.y < -1000) c.position.y = 1000;

        if (c.userData.isHit) {
            c.scale.lerp(new THREE.Vector3(c.userData.targetScale, c.userData.targetScale, c.userData.targetScale), 0.1);
            if(c.scale.x > 2.8) c.userData.targetScale = 0.0; 
            if(c.scale.x < 0.1) {
                c.userData.isHit = false;
                c.userData.targetScale = 1.0;
                c.scale.set(1,1,1);
                c.position.y = 1000; 
                c.material.color.setHex(c.userData.originalColor);
                c.userData.rx = (Math.random() - 0.5) * 0.04;
                c.userData.ry = (Math.random() - 0.5) * 0.04;
            }
        }
    });

    // 3. Animate Supernova Explosion
    const ePos = explosionSystem.geometry.attributes.position.array;
    for(let i=0; i<explosionCount; i++) {
        ePos[i*3] += expVel[i].x;
        ePos[i*3+1] += expVel[i].y;
        ePos[i*3+2] += expVel[i].z;
        expVel[i].multiplyScalar(0.96); 
    }
    explosionSystem.geometry.attributes.position.needsUpdate = true;
    
    if (clickScatterForce > 0) clickScatterForce *= 0.92; 

    // Parallax
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
