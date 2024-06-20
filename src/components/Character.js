import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export async function loadCharacter(scene) {
    const loader = new GLTFLoader();

    const glb = await new Promise((resolve, reject) => {
        loader.load('../src/assets/3d-objects/character/character.glb', resolve, undefined, reject);
    });

    const character = glb.scene;
    character.scale.setScalar(0.5);
    character.traverse(c => {
        c.castShadow = true;
    });
    character.position.set(0, 0.34, 3.8);
    character.rotation.y = Math.PI;
    character.visible = false;

    const mixer = new THREE.AnimationMixer(character);
    const animations = new Map();

    // Load animations
    await loadAnimations(loader, mixer, animations, [
        { name: 'idle', url: '../src/assets/3d-objects/character/idle.glb' },
        { name: 'run', url: '../src/assets/3d-objects/character/run.glb' },
        { name: 'slide', url: '../src/assets/3d-objects/character/slide.glb' },
        { name: 'jump', url: '../src/assets/3d-objects/character/jump.glb' },
    ]);

    scene.add(character);

    return { character, mixer, animations };
}

async function loadAnimations(loader, mixer, animations, animationList) {
    for (const anim of animationList) {
        const glb = await new Promise((resolve, reject) => {
            loader.load(anim.url, resolve, undefined, reject);
        });
        const action = mixer.clipAction(glb.animations[0]);
        animations.set(anim.name, action);
    }
}

