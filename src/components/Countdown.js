import { gsap } from "gsap";

export class Countdown {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    start() {
        return new Promise((resolve) => {
            const duration = 1; // 1 seconde per nummer
            let count = 3;

            const updateCountdown = () => {
                if (count === 0) {
                    this.container.innerText = 'Go!';
                    gsap.to(this.container, {
                        duration: 1,
                        opacity: 1,
                        onComplete: () => {
                            gsap.to(this.container, {
                                duration: 0.5,
                                opacity: 0,
                                onComplete: () => {
                                    this.container.style.display = 'none';
                                    resolve(); 
                                }
                            });
                        }
                    });
                } else {
                    this.container.innerText = count;
                    gsap.to(this.container, {
                        duration: 0.5,
                        opacity: 1,
                        onComplete: () => {
                            gsap.to(this.container, {
                                duration: 0.5,
                                opacity: 0,
                                onComplete: () => {
                                    count -= 1;
                                    updateCountdown();
                                }
                            });
                        }
                    });
                }
            };

            this.container.style.display = 'block';
            updateCountdown();
        });
    }
}