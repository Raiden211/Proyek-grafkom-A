import * as THREE from 'three';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Position the camera
camera.position.z = 5;

// Character movement
const moveDistance = 0.1;
const jumpDistance = 0.5; // Distance to jump
const gravity = 0.02; // Gravity acceleration
let isJumping = false; // Flag to track if the character is jumping

const loader = new GLTFLoader();
loader.load('korean_apartment/scene.gltf', function(gltf) {
    const model = gltf.scene;
    scene.add(model);

    // Position the model
    model.position.set(0, 0, -5);

    // Render the scene
    renderer.render(scene, camera);

    // Convert to JSON
    const json = model.toJSON();
    console.log(json);

    // Display JSON on screen
    const jsonElement = document.createElement('pre');
    jsonElement.textContent = JSON.stringify(json, null, 2);
    document.getElementById('jsonContainer').appendChild(jsonElement);
});

// Jump function
function jump() {
    let jumpHeight = camera.position.y + jumpDistance;
    const jumpInterval = setInterval(() => {
        camera.position.y += 0.1; // Increment Y position for the jump
        if (camera.position.y >= jumpHeight) { // Check if reached the jump height
            clearInterval(jumpInterval); // Stop the jump interval
            fall(); // Start falling back down
        }
    }, 20);
}

// Fall function
function fall() {
    const fallInterval = setInterval(() => {
        camera.position.y -= gravity; // Apply gravity
        if (camera.position.y <= 0) { // Check if reached the ground
            camera.position.y = 0; // Set position to ground level
            clearInterval(fallInterval); // Stop the fall interval
            isJumping = false; // Reset jumping flag
        }
    }, 20);
}

// Event listener for keypress
document.addEventListener('keydown', (event) => {
    const key = event.key.toUpperCase();
    if (['W', 'A', 'S', 'D', ' '].includes(key)) {
        moveCharacter(key);
    }
});

// Function to move character
function moveCharacter(key) {
    switch (key) {
        case 'W':
            camera.position.z -= moveDistance;
            break;
        case 'A':
            camera.position.x -= moveDistance;
            break;
        case 'S':
            camera.position.z += moveDistance;
            break;
        case 'D':
            camera.position.x += moveDistance;
            break;
        case ' ': // Space key
            if (!isJumping) { // Only allow jumping if not already jumping
                isJumping = true;
                jump();
            }
            break;
    }
}

// Render the scene
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render(); // Start rendering

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
