import gsap from 'gsap';
import { MotionTracking  } from '../motiontracking/MotiontrackingHandler.js';

export class Controlls {
    constructor(character,  animations, camera) {
        this.character = character;
        this.animations = animations;
        this.camera = camera;

        this.isJumping = false;
        this.currentPosition = 0; // 0 = middle, -1 = left, 1 = right
        this.lastMoveTime = 0; // Voor rate limiting
        this.lastJumpTime = 0; // Voor rate limiting van sprong
        this.lastSlideTime = 0;
        this.threshold = 0.05; // Drempel voor het veranderen van baan
    }

    setKeyboardControls() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                this.moveLeft();
            }

            if (event.key === 'ArrowRight') {
                this.moveRight();
            }

            if (event.key === 'ArrowUp') {
                this.jump();
            }

            if (event.key === 'ArrowDown') {
                this.slide();
            }
        });
    }

    async setupMotionTrackingControls() {
        this.MotionTracking = new MotionTracking('webcam', this.processTrackingData.bind(this));
        await this.MotionTracking.init();
    }

    processTrackingData(poseData) {
        const {nose, leftShoulder, rightShoulder } = poseData;
    
        // Left and right shoulder x positions
        const leftX = leftShoulder.x;
        const rightX = rightShoulder.x;
    
        // Average x position (between left and right shoulder)
        const averageX = (leftX + rightX) / 2;
    
        // Tresholds for lane switching (1 / 3 of the screen width on each side)
        // results are with threshold of 0.05:
        const leftZone = 0.33 - this.threshold; // x < 0.28
        // centerzone = 0.28 <= x <= 0.72 
        const rightZone = 0.67 + this.threshold; // x > 0.72
    
        // Rate limiting for lane switching 
        const moveCooldown = 500; // 500ms cooldown between moves
        const currentTime = Date.now();
        
        // Check if enough time has passed since the last move with current time object
        if (!this.lastMoveTime || (currentTime - this.lastMoveTime > moveCooldown)) {
            if (averageX > rightZone && this.currentPosition !== -1) { // Movement direction is now reversed
                this.moveLeft();
                this.lastMoveTime = currentTime;
            } else if (averageX < leftZone && this.currentPosition !== 1) { // Movement direction is now reversed
                this.moveRight();
                this.lastMoveTime = currentTime;
            } else if (averageX >= leftZone && averageX <= rightZone && this.currentPosition !== 0) {
                this.moveCenter();
                this.lastMoveTime = currentTime;
            }
        }

         // Additional thresholds and cooldowns for jumping and sliding
         const jumpThreshold = 0.2; // Neus boven 20% van de hoogte
         const slideThreshold = 0.6; // Neus onder 60% van de hoogte
         const jumpCooldown = 1000; // 1 seconde cooldown voor sprong
         const slideCooldown = 1000; // 1 seconde cooldown voor slide
 
         // Check for jump
         if (nose.y < jumpThreshold && (currentTime - this.lastJumpTime > jumpCooldown)) {
             this.jump();
             this.lastJumpTime = currentTime;
         }
 
         // Check for slide
         if (nose.y > slideThreshold && (currentTime - this.lastSlideTime > slideCooldown)) {
             this.slide();
             this.lastSlideTime = currentTime;
         }
    }

    moveLeft() {
        if (this.currentPosition > -1) {
            this.currentPosition--;
            let laneXPosition = this.currentPosition * 1.4;
            gsap.to(this.character.position, { duration: 0.5, x: laneXPosition });
        }
    }

    moveRight() {
        if (this.currentPosition < 1) {
            this.currentPosition++;
            let laneXPosition = this.currentPosition * 1.4;
            gsap.to(this.character.position, { duration: 0.5, x: laneXPosition });
        }
    }

    moveCenter() {
        if (this.currentPosition !== 0) {
            this.currentPosition = 0;
            let laneXPosition = this.currentPosition * 1.4;
            gsap.to(this.character.position, { duration: 0.5, x: laneXPosition });
        }
    }

    jump() {
        if (!this.isJumping && this.animations.get('jump')) {
            this.isJumping = true;
            this.playAnimation('jump');

            gsap.to(this.character.position, { 
                duration: 0.3, 
                y: this.character.position.y + 0.6,
                yoyo: true, 
                repeat: 1, 
                onComplete: () => {
                    this.playAnimation('run');
                    this.isJumping = false;
                }
            });
        }
    }

    slide() {
        if (!this.isSliding && this.animations.get('slide')) {
            this.isSliding = true;
            this.playAnimation('slide');
            const originalZ = this.character.position.z;  // Sla de oorspronkelijke X positie van het karakter op
            console.log('slide', originalZ);
            // Beweeg het karakter naar de camera toe
            gsap.to(this.character.position, {
                duration: 0.8,  // Duur van de beweging naar voren
                z: 1.2,
                onComplete: () => {
                    gsap.to(this.character.position, {
                        duration: 0.8,  // Duur van de beweging naar voren
                        z: 0.5,
                    });
                }
            });
            gsap.to(this.camera.position, {
                duration: 0.8,  // Duur van de beweging naar voren
                y: -.1,
                z: 1,

                onComplete: () => {
                    gsap.to(this.camera.position, {
                        duration: 0.8,  // Duur van de beweging naar voren
                        y: 0.3,
                        z: 2,
                    });
                }
            });
    
            setTimeout(() => {
                // // Beweeg de camera terug naar de oorspronkelijke positie
                // gsap.to(this.camera.position, {
                //     duration: 0.5,
                //     z: originalZ
                // });
    
                this.playAnimation('run');
                this.isSliding = false;
            }, 1000);  // Stel de tijd in volgens de duur van de slide animatie
        }
    }

    playAnimation(name) {
        const action = this.animations.get(name);
        if (action) {
            action.reset().fadeIn(0.1).play();
            for (let [key, anim] of this.animations) {
                if (key !== name) anim.fadeOut(0.1);
            }
        }
    }
}


