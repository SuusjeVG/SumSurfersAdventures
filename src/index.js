import { GameScene } from './scenes/GameScene.js';

const gamescene = new GameScene();

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

