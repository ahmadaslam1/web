
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('globeViz').appendChild(renderer.domElement);

const sphereGeometry = new THREE.SphereGeometry(5, 50, 50);
const texture = new THREE.TextureLoader().load('earthmap1k.jpg');
const sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });
const globe = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(globe);

const markers = [
  { lat: 30, lon: 70, description: "Worked on medical simulators at Artech Biomed" },
  { lat: 51, lon: -0.1, description: "Freelance design projects in London" }
];

markers.forEach(marker => {
  const markerGeometry = new THREE.SphereGeometry(0.1, 8, 8);
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
    document.getElementById('description').innerText = marker.description;
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
