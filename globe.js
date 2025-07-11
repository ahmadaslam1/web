
import * as THREE from 'three';

const container = document.getElementById('container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(5, 64, 64);
const texture = new THREE.TextureLoader().load('earth_texture.jpg');
const material = new THREE.MeshBasicMaterial({ map: texture });
const globe = new THREE.Mesh(geometry, material);
scene.add(globe);

const markers = [
  { lat: 30, lon: 70, description: "Worked on medical simulators at Artech Biomed" },
  { lat: 51, lon: -0.1, description: "Freelance design projects in London" }
];

// Marker creation example
markers.forEach(marker => {
  const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
  const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);

  const phi = (90 - marker.lat) * (Math.PI / 180);
  const theta = (marker.lon + 180) * (Math.PI / 180);

  markerMesh.position.x = 5 * Math.sin(phi) * Math.cos(theta);
  markerMesh.position.y = 5 * Math.cos(phi);
  markerMesh.position.z = 5 * Math.sin(phi) * Math.sin(theta);

  markerMesh.userData = { description: marker.description };
  scene.add(markerMesh);

  markerMesh.callback = () => {
    const infoBox = document.getElementById('info-box');
    infoBox.innerHTML = `
      <h1>Ahmad Aslam</h1>
      <p>Visual Artist & Developer</p>
      <p id="info-box-description">${marker.description}</p>
      <a href="resume.pdf" target="_blank" class="btn">Download Resume</a>
    `;
  };
});

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.callback) {
      intersects[i].object.callback();
      break;
    }
  }
}

window.addEventListener('click', onMouseClick, false);

camera.position.z = 15;

function animate() {
  requestAnimationFrame(animate);
  globe.rotation.y += 0.0015;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
