"use strict";
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GameScene } from "./GameScene.js";


export class StartScene {
    constructor(selectedControlType) {
        this.selectedControlType = selectedControlType;
        this.keyboardControl = null;
        this.motionTrackingControl = null;
        this.startButton = null;
        this.container = null;
        this.addKeyboardControl()
        this.addWebcamControl()
        // this.createUI();
    }

    addKeyboardControl() {
        const canvasKeyboard = document.getElementById('keyboardCanvas');

        // Maak een aparte Three.js scène en renderer
        this.keyboardScene = new THREE.Scene();
        this.keyboardCamera = new THREE.PerspectiveCamera(75, canvasKeyboard.clientWidth / canvasKeyboard.clientHeight, 0.1, 1000);

        // Gebruik het bestaande canvas-element voor de renderer
        this.keyboardRenderer = new THREE.WebGLRenderer({ canvas: canvasKeyboard, alpha: true });
        this.keyboardRenderer.setSize(canvasKeyboard.clientWidth, canvasKeyboard.clientHeight);
        
        // Voeg Ambient Light toe aan de scène voor gelijkmatige verlichting
        const ambientLight = new THREE.AmbientLight("#FFFFFF", 1.0);
        this.keyboardScene.add(ambientLight);

        // Voeg Directional Light toe voor extra verlichting en schaduwen
        const directionalLight = new THREE.DirectionalLight("#FFFFFF", 0.5);
        directionalLight.position.set(10, 10, 10).normalize();
        this.keyboardScene.add(directionalLight);

        // Voeg een eenvoudig object toe
        const loader = new GLTFLoader();
        loader.load('/src/assets/3d-objects/controlls/keyboard.glb', (gltf) => {
            const object = gltf.scene;
            object.rotation.x += Math.PI / 2;
            this.keyboardScene.add(object);
        });

        // Stel de camera-positie in
        this.keyboardCamera.position.z = 5;

        // Definieer de animatiefunctie
        const animate = () => {
            requestAnimationFrame(animate);

            this.keyboardRenderer.render(this.keyboardScene, this.keyboardCamera);
        };

        animate();
    }

    addWebcamControl() {
        const canvasMotion = document.getElementById('motiontrackingCanvas');

        // Maak een aparte Three.js scène en renderer
        this.motionTrackingScene = new THREE.Scene();
        this.motionTrackingCamera = new THREE.PerspectiveCamera(75, canvasMotion.clientWidth / canvasMotion.clientHeight, 0.1, 1000);

        // Gebruik het bestaande canvas-element voor de renderer
        this.motionTrackingRenderer = new THREE.WebGLRenderer({ canvas: canvasMotion, alpha: true });
        this.motionTrackingRenderer.setSize(canvasMotion.clientWidth, canvasMotion.clientHeight);
        
        // Voeg Ambient Light toe aan de scène voor gelijkmatige verlichting
        const ambientLight = new THREE.AmbientLight("#FFFFFF", 1.0);
        this.keyboardScene.add(ambientLight);

        // Voeg Directional Light toe voor extra verlichting en schaduwen
        const directionalLight = new THREE.DirectionalLight("#FFFFFF", 0.5);
        directionalLight.position.set(10, 10, 10).normalize();
        this.keyboardScene.add(directionalLight);

        // Voeg een eenvoudig object toe
        const loader = new GLTFLoader();
        loader.load('/src/assets/3d-objects/controlls/webcam.glb', (gltf) => {
            const object = gltf.scene;
            object.scale.set(0.3, 0.3, 0.3);
            this.motionTrackingScene.add(object);
        });

        // Stel de camera-positie in
        this.motionTrackingCamera.position.z = 5;

        // Definieer de animatiefunctie
        const animate = () => {
            requestAnimationFrame(animate);

            this.motionTrackingRenderer.render(this.motionTrackingScene, this.motionTrackingCamera);
        };

        animate();
    }

    // createUI() {
    //     // Create a container for the start scene
    //     this.container = document.createElement('div');
    //     document.body.appendChild(this.container);
    //     this.container.id = 'startscene';

    //     // Create a title for the start scene
    //     this.title = document.createElement('h1');
    //     this.title.textContent = 'Sum Surfers Adventures';
    //     this.container.appendChild(this.title);

    //     // Paragraaf voor besturing
    //     const instruction = document.createElement('p');
    //     instruction.textContent = 'Kies je besturing:';
    //     this.container.appendChild(instruction);

    //     // Controles container
    //     const controlsContainer = document.createElement('div');
    //     controlsContainer.id = 'controls';
    //     this.container.appendChild(controlsContainer);

    //     // Keyboard controls
    //     this.keyboardControl = document.createElement('div');
    //     this.keyboardControl.className = 'keyboard';
    //     controlsContainer.appendChild(this.keyboardControl);

    //     const keyboardImg = document.createElement('img');
    //     keyboardImg.src = '/src/assets/images/keyboard-controlls.webp';
    //     keyboardImg.alt = 'Keyboard controls';
    //     this.keyboardControl.appendChild(keyboardImg);

    //     // Motion tracking controls
    //     this.motionTrackingControl = document.createElement('div');
    //     this.motionTrackingControl.className = 'motiontracking';
    //     controlsContainer.appendChild(this.motionTrackingControl);

    //     const motionTrackingImg = document.createElement('img');
    //     motionTrackingImg.src = '/src/assets/images/posetracking-controlls.webp';
    //     motionTrackingImg.alt = 'Bodytracking controls';
    //     this.motionTrackingControl.appendChild(motionTrackingImg);

    //     // Create a button to start the game
    //     this.startButton = document.createElement('button');  
    //     this.startButton.id = 'startbutton';
    //     this.startButton.textContent = 'Start Game';    
    //     this.container.appendChild(this.startButton);
    // }

    onControlSelect(controlType) {
        
        this.selectedControlType = controlType;
    }
}