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
        this.tiles = [];
        this.tileCounter = 0;
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

    addTiles(scene) {
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

        tileUrls.forEach(url => {
            loader.load(url, (gltf) => {
                gltf.scene.position.set(0, -1.1, position_tileZ);

                // checking the size of the tile
                const tile = gltf.scene;
                const boundingBox = new THREE.Box3().setFromObject(tile);
                const tileSize = boundingBox.getSize(new THREE.Vector3());

                console.log(`Loaded tile from ${url}`);
                console.log(`Tile size: X: ${tileSize.x}, Y: ${tileSize.y}, Z: ${tileSize.z}`);
    
                scene.add(gltf.scene);
                this.tiles.push(gltf.scene); // keep a reference to the tile
                position_tileZ -= 20;
            }, undefined, (error) => {
                console.error('An error happened while loading the GLB file', error);
            });
        });       
    }

    // async addTiles(scene) {
    //     const loader = new GLTFLoader();
    //     let position_tileZ = 0;
    
    //     const tileUrls = [
    //         '/src/assets/3d-objects/tiles/tile-1.glb',
    //         '/src/assets/3d-objects/tiles/tile-3.glb',
    //         '/src/assets/3d-objects/tiles/tile-1.glb',
    //         '/src/assets/3d-objects/tiles/tile-2.glb',
    //         '/src/assets/3d-objects/tiles/tile-1.glb',
    //         '/src/assets/3d-objects/tiles/tile-4.glb',
    //     ];
    
    //     for (const url of tileUrls) {
    //         try {
    //             const gltf = await new Promise((resolve, reject) => {
    //                 loader.load(url, resolve, undefined, reject);
    //             }); 

    //             const tile = gltf.scene;
    //             const boundingBox = new THREE.Box3().setFromObject(tile);
    //             const tileSize = boundingBox.getSize(new THREE.Vector3());
    
    //             console.log(`Loaded tile from ${url}`);
    //             console.log(`Tile size: ${tileSize.x}, ${tileSize.y}, ${tileSize.z}`);
                
                
    //             gltf.scene.position.set(0, -1.1, position_tileZ);
    //             scene.add(gltf.scene);
    //             this.tiles.push(gltf.scene); // Bewaar een referentie naar de tile
    //             position_tileZ -= 20;
    //         } catch (error) {
    //             console.error('An error happened while loading the GLB file', error);
    //         }
    //     }
    // }

    // loadModel() {
    //     const loader = new GLTFLoader();
    //     loader.load('../assets/3d-objects/character/character-run.fbx', (gltf) => {
    //         this.model = gltf.scene;
    //         this.model.scale.set(0.01, 0.01, 0.01);
    //         this.scene.add(this.model);

    //         this.mixer = new THREE.AnimationMixer(this.model);
    //         this.action = this.mixer.clipAction(gltf.animations[0]);
    //         this.action.play();
    //     });
    // }

    // loadCharacter() {
    //     const loader = new FBXLoader();
    //     const texture = new THREE.TextureLoader().load('/src/assets/textures/character/skaterMaleA.png' );
    //     const material = new THREE.MeshBasicMaterial({ map: texture });

    //     loader.load('/src/assets/3d-objects/character/character.fbx', (object) => {
    //         object.position.set(0, 0, 0);
    //         object.scale.set(0.003, 0.003, 0.003);


    //         // add textures to the object
    //         object.traverse(function (child) {
    //             if ((child).isMesh) {
    //                 (child).material = material
    //                 if ((child).material) {
    //                     ((child).material).transparent = false
    //                 }
    //             }
    //         })
        
    //         this.scene.add(object);
    //         this.cube = object;

    //          // Load run animation
    //         const modelRun = new FBXLoader();
    //         modelRun.load('/src/assets/3d-objects/character/run.fbx', (modelRun) => {
    //             const mixer = new THREE.AnimationMixer(object);
    //             const runAction = mixer.clipAction(modelRun.animations[0]);
    //             runAction.play();
    //         });

    //         // Load jump animation
    //         loader.load('/src/assets/3d-objects/character/jump.fbx', (jumpObject) => {
    //             const jumpAction = mixer.clipAction(jumpObject.animations[0]);
    //             this.jumpAction = jumpAction;
    //         });
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
        // this.tiles.forEach(tile => {
        //     // snelheid van de tiles
        //     tile.position.z += 0.04; 

        //     // Controleer of de tile achter de camera is en verplaats deze dan naar voren
        //     if (tile.position.z > this.camera.position.z + 20) {
        //         const lastTile = this.tiles.reduce((prev, curr) => {
        //             return (prev.position.z < curr.position.z) ? prev : curr;
        //         });
                
        //         tile.position.z = lastTile.position.z - 19;
        //     }
        // });

    
        // Update de positie van de tiles zodat ze naar de camera bewegen
        this.tiles.forEach(tile => {
            tile.position.z += 0.04; // Pas de snelheid van de beweging aan indien nodig
            if (tile.position.z > this.camera.position.z + 21) {
                tile.position.z -= this.tiles.length * 20; // Verplaats de tile naar achteren als deze te ver is gekomen
            }
        });


        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
