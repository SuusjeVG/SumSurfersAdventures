
export function instructionCards() {
    // display instruction cards
    const instructionButton = document.getElementById('instruction-button');
    const instructionContainer = document.querySelector('.instruction-container');

    instructionButton.addEventListener('click', function() {
        if (instructionContainer.style.display === 'flex') {
            instructionContainer.style.display = 'none'; 
            instructionButton.innerText = '?'; 
        } else {
            instructionContainer.style.display = 'flex'; 
            instructionButton.innerText = 'X'; 
        }
    });

    // Keyboard animation
    const leftKey = document.querySelector('.key.left');
    const rightKey = document.querySelector('.key.right');
    const upKey = document.querySelector('.key.up');
    const downKey = document.querySelector('.key.down');
    const keys = [leftKey, rightKey, upKey, downKey]; 

    let currentKey = 0;

    function animateKeys() {
        if (currentKey < keys.length) {
            keys[currentKey].classList.add('active');
            setTimeout(() => {
                keys[currentKey].classList.remove('active');
                currentKey++;
                animateKeys();
            }, 500); 
        } else {
            currentKey = 0;
            setTimeout(animateKeys, 500); 
        }
    }

    animateKeys();
    
}
