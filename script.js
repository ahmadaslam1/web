// script.js

// Scene setup
const scene = new THREE.Scene();
const loader = new THREE.TextureLoader();
scene.background = loader.load("starry_night.jpg");
const camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
//renderer.setClearColor(0x000000, 0);
document.getElementById('canvas-container').appendChild(renderer.domElement);

camera.position.set(100, 100, 60);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Load textures
const dayTexture = new THREE.TextureLoader().load('earth_texture.jpg'); // Replace with your day texture path
const nightTexture = new THREE.TextureLoader().load('earth_texture_night.jpg'); // Replace with your night texture path

const globeGeometry = new THREE.SphereGeometry(15, 64, 64);
let globeMaterial = new THREE.MeshStandardMaterial({
    map: nightTexture, // Start with night texture
    metalness: 0.2, // Set a slight metallic sheen
    roughness: 0.6, // Adjust roughness for better texture
});
const globe = new THREE.Mesh(globeGeometry, globeMaterial);
scene.add(globe);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Softer ambient light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1); // Adjust intensity
pointLight.position.set(50, 50, 60);
scene.add(pointLight);

// Locations and experience data
const locations = [
    // McGill University
    {
        name: 'McGill University, Montreal, QC, Canada',
        lat: 45.5017,
        lon: -75.5673,
        experience: `Bachelor of Engineering in Electrical Engineering (Power and Control Systems)<br>April 2024<br><br>`,
    },
    // McGill University Intramural Sports Office
    {
        name: 'Montreal, QC, Canada<br><br>Leadership Skills, Organization, Teamwork, Collaboration',
        lat: 47.5017, // 1 unit away from the university
        lon: -73.5673,
        experience: `McGill University Intramural Sports Office<br>General Official<br>Sep 2022 - Apr 2024<br><br>`,
    },
    // PitchPatch Project
    {
        name: 'Montreal, QC, Canada<br><br>Teamwork, Collaboration, Hardware Design, 3D Modelling, CAD',
        lat: 45.5017,
        lon: -72.5673, // 1 unit away from the university
        experience: `PitchPatch Modular Piano Project<br>2023 - Present<br><br>`,
    },
    // McGill Rocket Team Avionics Division
    {
        name: 'Montreal, QC, Canada<br><br>PCB Design, Hardware Testing, Optimization',
        lat: 43.5017, // 1 unit away from the university
        lon: -73.5673,
        experience: `McGill Rocket Team Avionics Division<br>Jan 2024 - Apr 2024<br><br>`,
    },
    // McGill Computer Science Graduate Society
    {
        name: 'Montreal, QC, Canada<br><br>Graphic Design, Branding, Managing Deadlines',
        lat: 45.5017,
        lon: -69.5673, // 2 units away from the university
        experience: `McGill Computer Science Graduate Society<br>VP Designs<br>Sep 2023 - Apr 2024<br><br>`,
    },
    // McGill University Health Center
    {
        name: 'Montreal, QC, Canada<br><br>PCB Design, 3D Design, RF Coils',
        lat: 43, // 1 unit away from the university
        lon: -76,
        experience: `McGill University Health Center, Neuroscience Research Lab<br>Jul 2024 - Nov 2024<br><br>`,
    },
    // Teamo Inc.
    {
        name: 'Lewes, DE, USA (Remote)<br><br>Client Relations, Front-End development, Data Analysis',
        lat: 36.7749,
        lon: -77.1394,
        experience: `Teamo Inc.<br>Technical Sales Internship<br>May 2023 - Aug 2023<br><br>`,
    },
    // Water and Power Development Authority of Pakistan
    {
        name: 'Lahore, Pakistan<br><br>Power Engineering, Data Analysis, and Presentation, Field Research',
        lat: 30.5497,
        lon: 73.3436,
        experience: `Water and Power Development Authority of Pakistan<br>Summer Internship<br>May 2022 - Aug 2022<br><br>`,
    },
    // Sense Branding Solutions
    {
        name: 'Lahore, Pakistan<br><br>Client Relations, Branding Identity, Marketing',
        lat: 32.5497, // 1 unit away from the previous position
        lon: 73.3436,
        experience: `Sense Branding Solutions<br>Founder<br>May 2020 - September 2022<br><br>`,
    },
    // Sahoolat App Project
    {
        name: 'Lahore, Pakistan<br><br>Vendor Relations, App Development',
        lat: 30.5497,
        lon: 76.3436, // 1 unit away from the previous position
        experience: `Sahoolat App Project<br>2023<br><br>`,
    },
    // Kyzen
    {
        name: 'Toronto, Canada<br><br>Client Success, Branding Identity, Promotions',
        lat: 43.5017, // 1 unit away from the previous position
        lon: -80,
        experience: `Kyzenn<br>Amazon Brand Manager<br>Dec 2024 - Present<br><br>`,
    },
];


// Convert latitude and longitude to 3D coordinates
function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
}

// Add markers to globe
const markerMaterial = new THREE.MeshBasicMaterial({ color: 0x800000 });
const markerGeometry = new THREE.SphereGeometry(0.2, 24, 24);

locations.forEach((location) => {
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    const position = latLonToVector3(location.lat, location.lon, 15);
    marker.position.copy(position);

    // Make markers children of the globe
    globe.add(marker);

    // Add user interaction
    marker.userData = {experience: location.experience, name: location.name };

    // Click event - directly attached to marker's userData
    marker.onClick = function () {
        const infoBox = document.getElementById('info-box');
        document.getElementById('location-info').innerHTML = `<strong>${location.experience}</strong>${location.name}`;
        infoBox.classList.add('visible');
        
        // Set a timer to remove the visible class after 5 seconds
        //setTimeout(() => {
        //    infoBox.classList.remove('visible');
        //}, 10000);
    };
});

// Raycaster for detecting mouse movements
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Variable to check if the first click has happened
let firstClickHappened = false;

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(globe.children);

    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
    } else {
        document.body.style.cursor = 'default';
    }
});

// Handling clicks
window.addEventListener('click', (event) => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(globe.children); // Intersect only with globe's children

    const infoBox = document.getElementById('info-box');

    if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        if (selectedObject.onClick) {
            selectedObject.onClick();
        }
    } else {
        infoBox.classList.remove('visible');
    }

    // Stop spinning on the first click
    if (!firstClickHappened) {
        firstClickHappened = true;
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the globe until the first click
    if (!firstClickHappened) {
        globe.rotation.y += 0.002; // Adjust rotation speed here
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Set the toggle to checked for dark mode by default
document.getElementById('mode-toggle').checked = true;

// Toggle between day and night textures
document.getElementById('mode-toggle').addEventListener('change', function() {
    if (this.checked) {
        globe.material.map = nightTexture; // Switch to night texture
    } else {
        globe.material.map = dayTexture; // Switch to day texture
    }
    globe.material.needsUpdate = true; // Ensure material updates
});

// About Me button functionality
const aboutMeButton = document.getElementById('about-me-button');
const aboutMeBox = document.getElementById('about-me-box');

aboutMeButton.addEventListener('click', function () {
    aboutMeBox.classList.add('visible');
    
    // Close the About Me box after 10 seconds
    //setTimeout(() => {
     //   aboutMeBox.classList.remove('visible');
    //}, 10000);
});

// Skills button functionality
const skillsButton = document.getElementById('skills-button');
const skillsBox = document.getElementById('skills-box');

skillsButton.addEventListener('click', function () {
    skillsBox.classList.add('visible');
    
    // Close the Skills box after 10 seconds
    //setTimeout(() => {
    //    skillsBox.classList.remove('visible');
    //}, 10000);
});

// Contact Information button functionality
const contactButton = document.getElementById('contact-button');
const contactBox = document.getElementById('contact-box');

contactButton.addEventListener('click', function () {
    contactBox.classList.add('visible');
    
    // Close the Contact box after 10 seconds
    //setTimeout(() => {
     //   contactBox.classList.remove('visible');
    //}, 10000);
});

// Close the boxes when clicking outside
window.addEventListener('click', (event) => {
    if (!aboutMeBox.contains(event.target) && event.target !== aboutMeButton) {
        aboutMeBox.classList.remove('visible');
    }
    if (!skillsBox.contains(event.target) && event.target !== skillsButton) {
        skillsBox.classList.remove('visible');
    }
    if (!contactBox.contains(event.target) && event.target !== contactButton) {
        contactBox.classList.remove('visible');
    }
});
