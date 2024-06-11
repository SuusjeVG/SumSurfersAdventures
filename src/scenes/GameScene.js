"use strict";

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { loadCharacter } from '../components/Character.js';
import { addTiles } from '../components/Tile.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap';

export class GameScene {
    // contructor runs everything when the class is instantiated 
    // (if the method is not in the constructor but it is in the class you can call it later)
    constructor() {
        this.controls;
        this.character;
        this.tiles = [];
        this.tilesSizeZ;
        this.isJumping = false; 
        this.isPaused = false;
        this.selectedController = null;

        this.clock = new THREE.Clock(); // Voeg de clo
        this.init();
    }

    async init() {
        this.setupScene()
        await this.loadTiles();
        await this.loadCharacter();

        this.resizeRenderer()
        this.animate();
    }

    setupScene() {
        // setting the scene
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // this.scene.fog = new THREE.Fog(0x000000, 1, 15);

        this.controls = new OrbitControls( this.camera, this.renderer.domElement );

        // lighting and background
        this.setupHDRI()
        this.addLights();

        this.cameraPosition(-1, -.2, 2)
    } 

    cameraPosition(x, y, z) {
        this.camera.position.set(x, y, z);
    }    

    setupHDRI() {
		const texture = new THREE.TextureLoader().load('/src/assets/textures/background/skybox.png' );
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

    async loadCharacter() {
        const { character, mixer, animations } = await loadCharacter(this.scene);
        this.character = character;
        this.mixer = mixer;
        this.animations = animations;
    }

    showCharacter() {
        if (this.character) {
            this.character.visible = true;
            this.playAnimation('idle');
        }
    }

    playAnimation(name) {
        const action = this.animations.get(name);
        if (action) {
            action.reset().fadeIn(0.1).play();
            // Stop andere animaties
            for (let [key, anim] of this.animations) {
                if (key !== name) anim.fadeOut(0.1);
            }
        }
    }

    update(deltaTime) {
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
    }

    setKeyboardControls() {
        let currentPosition = 0; // 0 = middle, -1 = left, 1 = right

        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                if (currentPosition === 1) {
                    // check if in the left lane, if true move back to the middle
                    gsap.to(this.character.position, { duration: 0.5, x: 0 });
                    currentPosition = 0;
                } else if (currentPosition === 0) {
                    // check if in the middle lane, if true move to the right lane
                    gsap.to(this.character.position, { duration: 0.5, x: -1.4 });
                    currentPosition = -1;
                }
            }

            if (event.key === 'ArrowRight') {
                if (currentPosition === -1) {
                    // check if in the left lane, if true move back to the middle
                    gsap.to(this.character.position, { duration: 0.5, x: 0 });
                    currentPosition = 0;
                } else if (currentPosition === 0) {
                    // check if in the middle lane, if true move to the right lane
                    gsap.to(this.character.position, { duration: 0.5, x: 1.4 });
                    currentPosition = 1;
                }
            }

            if (event.key === 'ArrowUp' && !this.isJumping) {
                this.jump();
            }

            if (event.key === 'ArrowDown') {
                this.playAnimation('slide');
                setTimeout(() => {
                    this.playAnimation('run');
                }, 1000);
            }
        });
    }
    

    setupMotionTrackingControls() {
        // Voeg hier de logic voor motion tracking toe
    }


    jump() {
        if (this.animations.get('jump')) {
            this.isJumping = true;
            this.playAnimation('jump');

            gsap.to(this.character.position, { 
                duration: 0.3, 
                y: this.character.position.y + 0.6,
                yoyo: true, 
                repeat: 1, 
                onComplete: () => {
                    this.playAnimation('run');
                    this.isJumping = false;
                }
            });
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
            // Update de positie van de tiles zodat ze naar de camera bewegen
            this.tiles.forEach(tile => {
                tile.position.z += 0.04; // Snelheid van de tiles
                if (tile.position.z > this.camera.position.z + (this.tilesSizeZ + 1)) {
                    tile.position.z -= this.tiles.length * this.tilesSizeZ; // Plaats de tile weer vooraan
                }
            });
        }

        const deltaTime = this.clock.getDelta();

        this.update(deltaTime);

        this.controls.update();
        this.renderer.render(this.scene, this.camera);

    }
}
