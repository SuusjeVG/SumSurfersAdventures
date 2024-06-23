
// export function instructionCards() {
//     // display instruction cards
//     const instructionButton = document.getElementById('instruction-button');
//     const instructionContainer = document.querySelector('.instruction-container');

//     instructionButton.addEventListener('click', function() {
//         if (instructionContainer.style.display === 'grid') {
//             instructionContainer.style.display = 'none'; 
//             instructionButton.innerText = '?'; 
//         } else {
//             instructionContainer.style.display = 'grid'; 
//             instructionButton.innerText = 'X'; 
//         }
//     });

//     // Keyboard animation
//     const leftKey = document.querySelector('.key.left');
//     const rightKey = document.querySelector('.key.right');
//     const upKey = document.querySelector('.key.up');
//     const downKey = document.querySelector('.key.down');
//     const keys = [leftKey, rightKey, upKey, downKey]; 

//     let currentKey = 0;

//     function animateKeys() {
//         if (currentKey < keys.length) {
//             keys[currentKey].classList.add('active');
//             setTimeout(() => {
//                 keys[currentKey].classList.remove('active');
//                 currentKey++;
//                 animateKeys();
//             }, 500); 
//         } else {
//             currentKey = 0;
//             setTimeout(animateKeys, 500); 
//         }
//     }

//     animateKeys();
    
//     // Motion tracking animation
//     // const character = document.querySelector('.image-container .character');
//     // let currentAnimation = 0;


//     // function animateCharacter() {
//     //     // Verwijder eerdere animatieklassen
//     //     character.classList.remove('animate-left', 'animate-right', 'animate-up', 'animate-down');
        
//     //     // Voeg nieuwe animatieklasse toe
//     //     if (currentAnimation === 0) {
//     //         character.classList.add('animate-left');
//     //     } else if (currentAnimation === 1) {
//     //         character.classList.add('animate-right');
//     //     } else if (currentAnimation === 2) {
//     //         character.classList.add('animate-up');
//     //     } else if (currentAnimation === 3) {
//     //         character.classList.add('animate-down');
//     //     }

//     //     // Update de animatie index
//     //     currentAnimation = (currentAnimation + 1) % 4; // Cyclisch door animaties

//     //     // Herhaal de animatie elke 2 seconden
//     //     setTimeout(animateCharacter, 2000);
//     // }

//     // // Start de animatie
//     // animateCharacter();
// }
