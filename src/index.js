"use strict";

import { StartScene } from './scenes/StartScene.js';
import { GameScene } from './scenes/GameScene.js';
import { Countdown } from './components/Countdown.js';
import { gsap } from 'gsap';

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startbutton');
    const startSceneContainer = document.getElementById('startscene');

    const startScene = new StartScene();
    const gamescene = new GameScene();
    const countdown = new Countdown('countdown');

    startButton.addEventListener('click', () => onStartButtonClick(startScene, gamescene, countdown, startSceneContainer));
});

async function onStartButtonClick(startScene, gamescene, countdown, startSceneContainer) {
    if (!startScene.selectedControlType) return;

    // game tiles pause for a moment
    gamescene.pauseGame();

    // if motiontracking is selected, start motiotracking.
    await initializeControls(gamescene.controlls, startScene.selectedControlType);

    // camera animation to player view
    startCameraAnimation(gamescene);

    // Hide startscene with animation wait until it's done
    await hideStartScene(startSceneContainer);

    // Show character with animation idle
    gamescene.showCharacter();
    
    await countdown.start();

    // Start the run animation and start the game
    gamescene.controlls.playAnimation('run');
    gamescene.resumeGame();

}

function startCameraAnimation(gamescene) {
    gsap.to(gamescene.camera.position, { duration: 1, x: 0, y: 1.5, z: 5 });
}

function hideStartScene(startSceneContainer) {
    return new Promise((resolve) => {
        gsap.to(startSceneContainer, { 
            duration: 1, 
            opacity: 0, 
            onComplete: () => {
                startSceneContainer.style.display = 'none';
                resolve();
            }
        });
    });
}

function initializeControls(controlls, controlType) {
    return new Promise ((resolve) => {
        if (controlType === 'keyboard') {
            controlls.setKeyboardControls();
            resolve();
        } else if (controlType === 'motiontracking') {
            controlls.setupMotionTrackingControls();
            resolve();
        }
    });
}