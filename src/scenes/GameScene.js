"use strict";

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
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
        this.init();
    }

    init() {
        // setting the scene
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls( this.camera, this.renderer.domElement );

        // lighting and background
        this.setupHDRI()
        this.addLights();

        // invoirment
        this.addTiles(this.scene);

        // character
        // this.loadModel();
        this.loadCharacter();
        this.characterControlls()
  
        this.camera.position.set(0, .3, 2);


        this.resizeRenderer()
        this.animate();
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

    async addTiles(scene) {
        const loader = new GLTFLoader();
        let position_tileZ = 0;
    
        const tileUrls = [
            '/src/assets/3d-objects/tiles/tile-1.glb',
            '/src/assets/3d-objects/tiles/tile-3.glb',
            '/src/assets/3d-objects/tiles/tile-1.glb',
            '/src/assets/3d-objects/tiles/tile-2.glb',
            '/src/assets/3d-objects/tiles/tile-1.glb',
            '/src/assets/3d-objects/tiles/tile-4.glb',
        ];
    
        // Create an array of promises for loading each tile 
        // so I can load in every tile in at the same time
        const loadTilePromises = tileUrls.map(url => {
            return new Promise((resolve, reject) => {
                loader.load(url, (gltf) => {
                    resolve(gltf);
                }, undefined, (error) => {
                    reject(error);
                });
            });
        });
    
        try {
            // Wait for all tiles to be loaded
            const loadedTiles = await Promise.all(loadTilePromises);
    
            // Add each tile to the scene in order
            loadedTiles.forEach((gltf, index) => {
                const tile = gltf.scene;

                // Checking the size of the tile
                const boundingBox = new THREE.Box3().setFromObject(tile);
                const tileSize = boundingBox.getSize(new THREE.Vector3());
                this.tilesSizeZ = tileSize.z;
                
                // console.log(`Loaded tile from ${tileUrls[index]}`);
                // console.log(`Tile size: X: ${tileSize.x}, Y: ${tileSize.y}, Z: ${tileSize.z}`);
                
                tile.position.set(0, -1.1, position_tileZ);
                scene.add(tile);
                this.tiles.push(tile); // Keep a reference to the tile
                position_tileZ -= this.tilesSizeZ;
            });
        } catch (error) {
            console.error('An error happened while loading the GLB files', error);
        }
    }
   
    

    // loadModel() {
    //     const loader = new FBXLoader();
    //     loader.setPath('../assets/3d-objects/character/');
    //     loader.load('character.fbx', (fbx) => {
    //         this.character = fbx;
    //         this.character.scale.setScalar(0.1);
    //         this.character.traverse(c => {
    //             c.castShadow = true;
    //         });

    //         const anim = new FBXLoader();
    //         anim.setPath('../assets/3d-objects/character/');
    //         anim.load('run.fbx', (anim) => {
    //             const mixer = new THREE.AnimationMixer(this.character);
    //             this.character.animations = anim;
    //             const idle = mixer.clipAction(anim.animations[0]);
    //             idle.play();
    //         });

    //         this.scene.add(this.character);
    //     });
    // }

    loadCharacter() {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.cube = new THREE.Mesh(geometry, material);
        this.cube.position.set(0, -0.6, 0);
        this.cube.scale.set(0.4, 0.4, 0.4);
        
        this.scene.add(this.cube);
    }

    characterControlls() {
        let currentPosition = 0; // 0 = middle, -1 = left, 1 = right

        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                if (currentPosition === 1) {
                    // check if in the left lane, if true move back to the middle
                    gsap.to(this.cube.position, { duration: 0.5, x: 0 });
                    currentPosition = 0;
                } else if (currentPosition === 0) {
                    // check if in the middle lane, if true move to the right lane
                    gsap.to(this.cube.position, { duration: 0.5, x: -1.4 });
                    currentPosition = -1;
                }
            }

            if (event.key === 'ArrowRight') {
                if (currentPosition === -1) {
                    // check if in the left lane, if true move back to the middle
                    gsap.to(this.cube.position, { duration: 0.5, x: 0 });
                    currentPosition = 0;
                } else if (currentPosition === 0) {
                    // check if in the middle lane, if true move to the right lane
                    gsap.to(this.cube.position, { duration: 0.5, x: 1.4 });
                    currentPosition = 1;
                }
            }

            if (event.key === 'ArrowUp' && !this.isJumping) {
                this.jump();
            }
        });
    }


    jump() {
        this.isJumping = true;
        gsap.to(this.cube.position, { duration: 0.3, y: 0.3, yoyo: true, repeat: 1, onComplete: () => {
            this.isJumping = false;
        }});
    }

    resizeRenderer() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;  
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }); 
    }

    animate() {
        requestAnimationFrame(() => this.animate());
    
        // Update de positie van de tiles zodat ze naar de camera bewegen
        this.tiles.forEach(tile => {
            tile.position.z += 0.04; // Speed of the tiles
            if (tile.position.z > this.camera.position.z + (this.tilesSizeZ  + 1)) {
                tile.position.z -= this.tiles.length * this.tilesSizeZ; // Place the tile in front of the last tile
            }
        });


        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
