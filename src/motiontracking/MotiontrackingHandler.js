import { Webcam } from './webcamrenderer.js';
import { PoseLandmarkerComponent } from './PoseLandmarker.js';

export class MotionTracking {
    constructor(videoElementId, onPoseData) {
        this.webcam = new Webcam(videoElementId);
        this.poseLandmarker = new PoseLandmarkerComponent();
        this.videoElement = document.getElementById(videoElementId);
        this.onPoseData = onPoseData;
    }

    async init() {
        // Start de webcam
        await this.webcam.startWebcam();
        // Initialiseer de pose-landmarker
        await this.poseLandmarker.init();
        // Start pose-detectie
        this.predictWebcam();
    }

    async predictWebcam() {
        if (!this.webcam.webcamRunning) return;

        const results = await this.poseLandmarker.detectPoses(this.videoElement);

        // Verwerk de pose-data
        if (results && results.landmarks) {
            results.landmarks.forEach(landmark => {
                const poseData = this.handlePoseData(landmark);
                if (poseData) this.onPoseData(poseData);
            });
        }

        requestAnimationFrame(this.predictWebcam.bind(this));
    }

    handlePoseData(landmarks) {
        const nose = landmarks[0]; // Neus
        const leftShoulder = landmarks[11]; // Linkerschouder
        const rightShoulder = landmarks[12]; // Rechterschouder

        if (!nose || !leftShoulder || !rightShoulder) return null;

        return { nose, leftShoulder, rightShoulder };
    }
}