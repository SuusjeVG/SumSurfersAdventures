"use strict";

import * as THREE from 'three';
import { loadCharacter } from '../components/Character.js';
import { addTiles } from '../components/Tile.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Controlls } from '../components/Controlls.js';

export class GameScene {
    constructor() {
        this.orbitControls = null;
        this.character = null;
        this.controlls = null;
        this.camera = null;

        this.isPaused = false;

        this.clock = new THREE.Clock();
        this.init();
    }

    async init() {
        this.setupScene();
        await this.loadTiles();
        await this.loadCharacter();

        this.controlls = new Controlls(this.character, this.animations, this.camera);
        this.resizeRenderer();
        this.animate();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.setupHDRI();
        this.addLights();
        this.cameraPosition(-1, 0.8, 2);
    }

    cameraPosition(x, y, z) {
        this.camera.position.set(x, y, z);
    }

    setupHDRI() {
        const texture = new THREE.TextureLoader().load('/src/assets/textures/background/skybox.png');
        const geometry = new THREE.SphereGeometry(200, 32, 32);
        geometry.scale(-1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const sphere = new THREE.Mesh(geometry, material);
        this.scene.add(sphere);
    }

    addLights() {
        const ambientLight = new THREE.AmbientLight("#E6F9EC", 0.2);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 4.2);
        directionalLight.castShadow = true;
        directionalLight.shadow.bias = -0.0001;
        directionalLight.shadow.mapSize.width = 4096;
        directionalLight.shadow.mapSize.height = 4096;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        directionalLight.rotation.z = Math.PI / 4;
        directionalLight.position.set(20, 20, 0);
        this.scene.add(directionalLight);
    }

    async loadTiles() {
        const tileUrls = [
            '/src/assets/3d-objects/tiles/tile-1.glb',
            '/src/assets/3d-objects/tiles/tile-3.glb',
            '/src/assets/3d-objects/tiles/tile-1.glb',
            '/src/assets/3d-objects/tiles/tile-2.glb',
            '/src/assets/3d-objects/tiles/tile-1.glb',
            '/src/assets/3d-objects/tiles/tile-4.glb',
        ];
        const { tiles, tilesSizeZ } = await addTiles(this.scene, tileUrls);
        this.tiles = tiles;
        this.tilesSizeZ = tilesSizeZ;
    }

    updateTiles() {
        this.tiles.forEach(tile => {
            tile.position.z += 0.04;
            if (tile.position.z > this.camera.position.z + (this.tilesSizeZ + 1)) {
                tile.position.z -= this.tiles.length * this.tilesSizeZ;
            }
        });
    }

    async loadCharacter() {
        const { character, mixer, animations } = await loadCharacter(this.scene);
        this.character = character;
        this.mixer = mixer;
        this.animations = animations;
    }

    showCharacter() {
        if (this.character) {
            this.character.visible = true;
            this.controlls.playAnimation('idle');
        }
    }

    update(deltaTime) {
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
    }

    resizeRenderer() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    pauseGame() {
        this.isPaused = true;
    }

    resumeGame() {
        this.isPaused = false;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (!this.isPaused) {
            this.updateTiles();
        }

        const deltaTime = this.clock.getDelta();

        this.update(deltaTime);

        this.orbitControls.update();
        this.renderer.render(this.scene, this.camera);
    }

}