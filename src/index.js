import { StartScene } from './scenes/StartScene.js';
import { GameScene } from './scenes/GameScene.js';
import { Countdown } from './components/Countdown.js';
import { gsap } from 'gsap';

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startbutton');
    const startSceneContainer = document.getElementById('startscene');
    const countdownContainer = document.getElementById('countdown');

    const startScene = new StartScene();
    const gamescene = new GameScene();
    const countdown = new Countdown('countdown');

    startButton.addEventListener('click', () => onStartButtonClick(startScene, gamescene, countdown, startSceneContainer));
});

async function onStartButtonClick(startScene, gamescene, countdown, startSceneContainer) {
    if (!startScene.selectedControlType) return;

    gamescene.pauseGame();

    startCameraAnimation(gamescene);

    await hideStartScene(startSceneContainer);

    gamescene.showCharacter();

    await countdown.start();

    initializeControls(gamescene, startScene.selectedControlType);

    gamescene.playAnimation('run');
    
    gamescene.resumeGame();
}

function startCameraAnimation(gamescene) {
    gsap.to(gamescene.camera.position, { duration: 1, x: 0, y: 0.3, z: 2 });
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

function initializeControls(gamescene, controlType) {
    if (controlType === 'keyboard') {
        gamescene.setKeyboardControls();
    } else if (controlType === 'motiontracking') {
        gamescene.setupMotionTrackingControls();
    }
}








