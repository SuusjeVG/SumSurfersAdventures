"use strict";
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GameScene } from "./GameScene.js";

export class StartScene {
    constructor() {
        this.selectedControlType = null;
        this.init();
    }

    init() {
        this.UIKeyboardControlOption();
        this.UIMotionControlOption();

        // Event listeners voor de selectie van besturingsopties
        document.querySelector('[data-controller="keyboard"]').addEventListener('click', () => this.onControlSelect('keyboard'));
        document.querySelector('[data-controller="motiontracking"]').addEventListener('click', () => this.onControlSelect('motiontracking'));
        
        // Startknop vergrendelen totdat een besturingstype is geselecteerd
        this.updateStartButtonState();
    }

    UIKeyboardControlOption() {
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

    UIMotionControlOption() {
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

    onControlSelect(controlType) {
        this.selectedControlType = controlType;
        console.log('Selected control type:', this.selectedControlType);

        // Update UI to reflect the selected control
        document.querySelectorAll('.controller').forEach(controller => {
            controller.classList.remove('selected');
        });
        document.querySelector(`[data-controller="${controlType}"]`).classList.add('selected');

        this.updateStartButtonState();
    }

    updateStartButtonState() {
        const startButton = document.getElementById('startbutton');
        if (this.selectedControlType) {
            startButton.disabled = false;
            startButton.classList.add('enabled');
        } else {
            startButton.disabled = true;
            startButton.classList.remove('enabled');
        }
    }
}