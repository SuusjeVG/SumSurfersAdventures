"use strict";

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default class Character {
    constructor(scene) {
        this.scene = scene;
        this.model = null;
        this.mixer = null;
        this.action = null;
        this.loadModel();
    }

    loadModel() {
        const loader = new GLTFLoader();
        loader.load('./assets/3d-objects/character/character-run', (gltf) => {
            this.model = gltf.scene;
            this.model.scale.set(0.01, 0.01, 0.01);
            this.scene.add(this.model);

            this.mixer = new THREE.AnimationMixer(this.model);
            this.action = this.mixer.clipAction(gltf.animations[0]);
            this.action.play();
        });
    }

    update(deltaTime) {
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
    }
}