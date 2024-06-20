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

    // processTrackingData(poseData) {
    //     const {noseY, leftX, rightX, averageX } = poseData;

    //     // Tresholds for lane switching (1 / 3 of the screen width on each side)
    //     // results are with threshold of 0.05:
    //     const leftZone = 0.33 - this.threshold; // x < 0.28
    //     // centerzone = 0.28 <= x <= 0.72 
    //     const rightZone = 0.67 + this.threshold; // x > 0.72
    
    //     // Rate limiting for lane switching 
    //     const moveCooldown = 500; // 500ms cooldown between moves
    //     const currentTime = Date.now();
        
    //     // Check if enough time has passed since the last move with current time object
    //     if (!this.lastMoveTime || (currentTime - this.lastMoveTime > moveCooldown)) {
    //         if (averageX > rightZone && this.currentPosition !== -1) { // Movement direction is now reversed
    //             this.moveLeft();
    //             this.lastMoveTime = currentTime;
    //         } else if (averageX < leftZone && this.currentPosition !== 1) { // Movement direction is now reversed
    //             this.moveRight();
    //             this.lastMoveTime = currentTime;
    //         } else if (averageX >= leftZone && averageX <= rightZone && this.currentPosition !== 0) {
    //             this.moveCenter();
    //             this.lastMoveTime = currentTime;
    //         }
    //     }

    //      // Additional thresholds and cooldowns for jumping and sliding
    //      const jumpThreshold = 0.2; // Neus boven 20% van de hoogte
    //      const slideThreshold = 0.7; // Neus onder 70% van de hoogte
    //      const jumpCooldown = 1000; // 1 seconde cooldown voor sprong
    //      const slideCooldown = 1000; // 1 seconde cooldown voor slide
 
    //      // Check for jump
    //      if (noseY < jumpThreshold && (currentTime - this.lastJumpTime > jumpCooldown)) {
    //          this.jump();
    //          this.lastJumpTime = currentTime;
    //      }
 
    //      // Check for slide
    //      if (noseY > slideThreshold && (currentTime - this.lastSlideTime > slideCooldown)) {
    //          this.slide();
    //          this.lastSlideTime = currentTime;
    //      }
    // }

    processTrackingData(poseData) {
        // look at the webworker.js for the data structure
        const { noseY, averageShouldersX } = poseData;
    
        // Stel hier de tijd tussen twee bewegingsdetecties in (in milliseconden)
        const moveCooldown = 500; // 500 ms, dus halve seconde tussen bewegingen
        const currentTime = Date.now();
    
        // Check if enough time has passed since the last move
        if (!this.lastMoveTime || (currentTime - this.lastMoveTime > moveCooldown)) {
            this.evaluateLaneChange(averageShouldersX);
            this.lastMoveTime = currentTime;
        }
    
        this.evaluateJumpAndSlide(noseY, currentTime);
    }
    
    evaluateLaneChange(averageShouldersX) {
        // Tresholds for lane switching (1 / 3 of the screen width on each side)
        // results are with threshold of 0.05:
        const leftZone = 0.33 - this.threshold; // x < 0.28
        // centerzone = 0.28 <= x <= 0.72 
        const rightZone = 0.67 + this.threshold; // x > 0.72
    
        if (averageShouldersX > rightZone && this.currentPosition !== -1) {
            this.moveLeft();
        } else if (averageShouldersX < leftZone && this.currentPosition !== 1) {
            this.moveRight();
        } else if (averageShouldersX >= leftZone && averageShouldersX <= rightZone && this.currentPosition !== 0) {
            this.moveCenter();
        }
    }
    
    evaluateJumpAndSlide(noseY, currentTime) {
        const jumpThreshold = 0.2; // Neus boven 20% van de hoogte
        const slideThreshold = 0.7; // Neus onder 70% van de hoogte
        const jumpCooldown = 1000; // 1 seconde cooldown voor sprong
        const slideCooldown = 1000; // 1 seconde cooldown voor slide
    
        if (noseY < jumpThreshold && (currentTime - this.lastJumpTime > jumpCooldown)) {
            this.jump();
            this.lastJumpTime = currentTime;
        }
    
        if (noseY > slideThreshold && (currentTime - this.lastSlideTime > slideCooldown)) {
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
        if (!this.isJumping && !this.isSliding && this.animations.get('jump')) {
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

    // Functie voor het verkrijgen van animatieduur
    getAnimationDuration(name) {
        const action = this.animations.get(name);
        return action ? action.getClip().duration : 0;
    }
    
    slide() {
        if (!this.isSliding && !this.isJumping && this.animations.get('slide')) {
            this.isSliding = true;
            this.playAnimation('slide');
            const slideDuration = this.getAnimationDuration('slide');
            setTimeout(() => {
                this.playAnimation('run');
                this.isSliding = false;
            }, slideDuration * 1000);
            // this.playAnimation('run');
            this.isSliding = false;
            console.log(slideDuration * 1000);
            // setTimeout(() => { }, slideDuration * 1000);

            // original camera position x: 0, y: 1.5, z: 5
            // original character position character.position.set(0, 0.34, 3.8);

            // gsap.to(this.camera.position, { 
            //     y: 0.75,
            //     z: 4,
            //     duration: slideDuration - 0.5, 
            //     onComplete: () => {
            //         this.camera.position.y = 1.5;
            //         this.camera.position.z = 5;
            //         this.character.position.y = 0.34;
            //         this.playAnimation('run');
            //         this.isSliding = false;
            //             // ,
            //             // z: 5,
            //             // duration: slideDuration, 
            //             // onComplete: () => {

            //             // }
            //         // });
            //     }
            // });
            // gsap.to(this.character.position, { 
            //     z: 5,
            //     duration: slideDuration - 0.5, 
            //     onComplete: () => {
            //         gsap.to(this.character.position, {
            //             z: 3.8,
            //             duration: 1,
    
            //         });
            //     }
            // });

            // console.log(this.character.position.z);
            
            // // Voorwaartse beweging voor het karakter
            // const originalZ = this.character.position.z;
            // gsap.to(this.character.position, {
            //     duration: 1.57,
            //     z: originalZ + 2,  // Verplaats het karakter tijdelijk voorwaarts
            //     onComplete: () => {
            //         // Reset de positie van het karakter na de slide
            //         gsap.to(this.character.position, {
            //             duration: 3.14,
            //             z: originalZ
            //         });
            //     }
            // });
    
            // // Camera verlagen en dan terugzetten
            // const originalCameraY = this.camera.position.y;
            // const originalCameraZ = this.camera.position.z;
            // gsap.to(this.camera.position, {
            //     duration: 0.8,
            //     y: originalCameraY - 0.4,  // Verlaag de camera tijdelijk
            //     z: originalCameraZ + 1,  // Beweeg de camera iets voorwaarts
            //     onComplete: () => {
            //         // Zet de camera terug naar de oorspronkelijke positie
            //         gsap.to(this.camera.position, {
            //             duration: 0.8,
            //             y: originalCameraY,
            //             z: originalCameraZ
            //         });
            //     }
            // });
    
            // setTimeout(() => {
            //     this.playAnimation('run');
            //     this.isSliding = false;
            // }, 1600);  // Wacht totdat de slide animatie voltooid is
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


