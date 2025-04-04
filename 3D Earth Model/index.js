import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";

// ____________________________________________________________________________________________

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

// fov, aspect , near, far
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const scene = new THREE.Scene();

// ____________________________________________________________________________________________

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * (Math.PI / 180);
scene.add(earthGroup);

const geo = new THREE.IcosahedronGeometry(1, 12);
const loader = new THREE.TextureLoader();
const mat = new THREE.MeshPhongMaterial({
  map: loader.load("./textures/00_earthmap1k.jpg"),
  specularMap: loader.load("./textures/02_earthspec1k.jpg"),
  bumpMap: loader.load("./textures/01_earthbump1k.jpg"),
  bumpScale: 0.04,
});
const earthMesh = new THREE.Mesh(geo, mat);
earthGroup.add(earthMesh);

const stars = getStarfield({ numStars: 3000 });
scene.add(stars);

const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/03_earthlights1k.jpg"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geo, lightsMat);
earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/04_earthcloudmap.jpg"),
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  alphaMap: loader.load("./textures/05_earthcloudmaptrans.jpg"),
});
const cloudsMesh = new THREE.Mesh(geo, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geo, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);

const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

// ____________________________________________________________________________________________

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

// ____________________________________________________________________________________________

function animate() {
  requestAnimationFrame(animate);

  earthMesh.rotation.y += 0.002;
  lightsMesh.rotation.y += 0.002;
  cloudsMesh.rotation.y += 0.0023;
  glowMesh.rotation.y += 0.002;
  renderer.render(scene, camera);
}

// ____________________________________________________________________________________________

animate();
