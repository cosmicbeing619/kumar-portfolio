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
camera.position.z = 450;
camera.position.y = 100;
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
container.appendChild(renderer.domElement);

// --- LIGHTING (Required for realistic liquid material) ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(0, 500, 500);
scene.add(dirLight);

const pointLight1 = new THREE.PointLight(0xffaa00, 2, 1000);
pointLight1.position.set(200, 200, 200);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xff0000, 2, 1000);
pointLight2.position.set(-200, -200, 200);
scene.add(pointLight2);


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

// --- 3A. Central Molten Liquid Column (Continuous Mesh, Not Particles) ---
const liquidGeo = new THREE.CylinderGeometry(120, 120, 3000, 64, 128);
const liquidPos = liquidGeo.attributes.position;
const vCount = liquidPos.count;

// Store original coordinates
const oX = new Float32Array(vCount);
const oY = new Float32Array(vCount);
const oZ = new Float32Array(vCount);
const liquidColors = new Float32Array(vCount * 3);

for(let i=0; i<vCount; i++) {
    oX[i] = liquidPos.array[i*3];
    oY[i] = liquidPos.array[i*3+1];
    oZ[i] = liquidPos.array[i*3+2];
}

liquidGeo.setAttribute('color', new THREE.BufferAttribute(liquidColors, 3));

// Physical, shiny liquid material
const liquidMat = new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    roughness: 0.1,  // Very shiny/wet
    metalness: 0.3,  
    clearcoat: 1.0,  // Wet gloss effect
    clearcoatRoughness: 0.1,
    side: THREE.DoubleSide
});

const liquidPillar = new THREE.Mesh(liquidGeo, liquidMat);
scene.add(liquidPillar);

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


// --- Event Listeners & Interaction ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let mouse3D = new THREE.Vector3(0, 0, 0);

// Liquid Ripple array for clicks
let liquidRipples = [];

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

    // 1. Check Crystals
    const intersects = raycaster.intersectObjects(crystals);
    if (intersects.length > 0) {
        let hitCrystal = intersects[0].object;
        hitCrystal.userData.isHit = true;
        hitCrystal.userData.targetScale = 3.0; 
        hitCrystal.material.color.setHex(0xffffff); 
        hitCrystal.userData.rx = (Math.random() - 0.5) * 0.5;
        hitCrystal.userData.ry = (Math.random() - 0.5) * 0.5;
    } 
    
    // 2. Check Liquid Mesh for Fluid interaction (dent/ripple)
    const liquidHit = raycaster.intersectObject(liquidPillar);
    if(liquidHit.length > 0) {
        liquidRipples.push({
            x: liquidHit[0].point.x,
            y: liquidHit[0].point.y,
            z: liquidHit[0].point.z,
            force: 180 // Deep dent force
        });
    } else {
        // If they click empty space, just push the liquid centrally relative to camera depth
        raycaster.ray.at(400, mouse3D);
        liquidRipples.push({
            x: mouse3D.x,
            y: mouse3D.y,
            z: mouse3D.z,
            force: 250 // Massive displacement
        });
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
    
    liquidPillar.rotation.y = time * 0.05; 
    nebula.rotation.y = time * 0.01; 
    
    // Update active ripples
    for(let r=0; r<liquidRipples.length; r++) {
        liquidRipples[r].force *= 0.94; // Decay force
    }
    liquidRipples = liquidRipples.filter(r => r.force > 1); // Clean up dead ripples
    
    // 1. Fluid Wavy Mesh Simulation
    for (let i = 0; i < vCount; i++) {
        let ox = oX[i];
        let oy = oY[i];
        let oz = oZ[i];
        
        let angle = Math.atan2(oz, ox);
        
        // Complex falling sine waves for fluid look
        let wave1 = Math.sin(angle * 3 + oy * 0.015 + time * 3) * 12;
        let wave2 = Math.sin(angle * 5 - oy * 0.008 + time * 2) * 8;
        let wave3 = Math.cos(oy * 0.005 - time * 4) * 15;
        
        let totalWave = wave1 + wave2 + wave3;
        
        // Apply click dents
        let dent = 0;
        for(let r=0; r<liquidRipples.length; r++) {
            let dx = ox - liquidRipples[r].x;
            let dy = oy - liquidRipples[r].y;
            let dz = oz - liquidRipples[r].z;
            let distSq = dx*dx + dy*dy + dz*dz;
            
            // If within radius of click, push vertices inward
            if (distSq < 90000) { // 300 radius squared
                let dist = Math.sqrt(distSq);
                dent -= (300 - dist) * (liquidRipples[r].force / 300);
            }
        }
        
        // Apply scale to radius
        let origRadius = Math.sqrt(ox*ox + oz*oz);
        if(origRadius === 0) origRadius = 1;
        let newRadius = origRadius + totalWave + dent;
        let scale = newRadius / origRadius;
        
        liquidPos.array[i*3] = ox * scale;
        liquidPos.array[i*3+2] = oz * scale;
        
        // Fluid Coloring (Peaks are Yellow, Valleys are Red/Dark)
        let heightMix = (totalWave + 35) / 70; // Map wave height to 0-1
        liquidColors[i*3] = 1.0; 
        liquidColors[i*3+1] = heightMix; // Green channel dictates yellow vs red
        liquidColors[i*3+2] = 0.0; 
    }
    
    liquidPos.needsUpdate = true;
    liquidGeo.attributes.color.needsUpdate = true;
    
    // MUST recalculate normals so the light reflects correctly off the wavy surface!
    liquidGeo.computeVertexNormals();

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
