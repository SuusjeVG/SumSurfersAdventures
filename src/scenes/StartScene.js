"use strict";
import { instructionCards } from "../components/instructionsCard.js";

export class StartScene {
    constructor() {
        this.selectedControlType = null;
        instructionCards();
        
        this.init();
    }

    init() {
        // Event listeners voor de selectie van besturingsopties
        document.querySelector('[data-controller="keyboard"]').addEventListener('click', () => this.onControlSelect('keyboard'));
        document.querySelector('[data-controller="motiontracking"]').addEventListener('click', () => this.onControlSelect('motiontracking'));
        
        // Startknop vergrendelen totdat een besturingstype is geselecteerd
        this.updateStartButtonState();
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