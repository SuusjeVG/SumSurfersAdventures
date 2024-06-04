import { GameScene } from './scenes/GameScene.js';
import { WebcamReader } from '../posetracking_socket/implementation/WebcamReader.js'; 

// Controleer of getUserMedia wordt ondersteund
// const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

// if (hasGetUserMedia()) {
//     window.webSocket = new WebSocket("ws://4.158.52.151:8766");

//     window.webSocket.onopen = () => {
//         console.log("WebSocket connection established.");

//         // WebSocket is ingesteld, maak nu de WebcamReader aan
//         window.webcamReader = new WebcamReader();

//         // Initialiseer de GameScene nu de WebSocket correct is ingesteld
//         const gamescene = new GameScene();

//         function animate() {
//             requestAnimationFrame(animate);
//             gamescene.animate();
//         }

//         animate();
//     };

//     window.webSocket.onerror = (error) => {
//         console.error("WebSocket Error: ", error);
//     };

//     window.webSocket.onclose = () => {
//         console.log("WebSocket connection closed.");
//     };
// } else {
//     console.warn("getUserMedia() is not supported by your browser");
// }


// const init = () => {
//     const startScene = document.getElementById('startscene');
//     const startButton = document.getElementById('startbutton');
//     const keyboardControl = document.querySelector('.keyboard');
//     const motionTrackingControl = document.querySelector('.motiontracking');

//     const gameContainer = document.createElement('div');
//     gameContainer.id = 'game-container';
//     document.body.appendChild(gameContainer);

//     let controlType = 'keyboard';

//     keyboardControl.addEventListener('click', () => {
//         controlType = 'keyboard';
//         keyboardControl.classList.add('selected');
//         motionTrackingControl.classList.remove('selected');
//     });

//     motionTrackingControl.addEventListener('click', () => {
//         controlType = 'motion';
//         motionTrackingControl.classList.add('selected');
//         keyboardControl.classList.remove('selected');
//     });

//     startButton.addEventListener('click', () => {
//         startScene.style.display = 'none';
//         startGame(controlType);
//     });

//     const startGame = (controlType) => {
//         const gameScene = new GameScene(gameContainer, controlType);

//         const animate = () => {
//             requestAnimationFrame(animate);
//             gameScene.update();
//         };

//         animate();
//     };
// };

// document.addEventListener('DOMContentLoaded', init);

const gamescene = new GameScene();

