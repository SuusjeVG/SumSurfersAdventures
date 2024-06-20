import { Webcam } from './webcamrenderer.js';
import { PoseLandmarkerComponent } from './PoseLandmarker.js';

export class MotionTracking {
    constructor(videoElementId, onPoseData) {
        this.webcam = new Webcam(videoElementId);
        this.poseLandmarker = new PoseLandmarkerComponent();
        this.videoElement = document.getElementById(videoElementId);
        this.onPoseData = onPoseData;

        this.worker = new Worker('/src/motiontracking/webWorker.js');

        this.worker.onmessage = (event) => {
            const { type, data } = event.data;
            if (type === 'posesProcessed') {
                this.onPoseData(data);
            }
        };
    }

    async init() {
        // Start de webcam en laat PoseLandmarker init asynchroon uitvoeren
        await this.webcam.startWebcam();

        // Laad PoseLandmarker als de browser idle is of direct als fallback
        if ('requestIdleCallback' in window) {
            requestIdleCallback(async () => {
                await this.initPoseLandmarker();
            });
        } else {
            await this.initPoseLandmarker();
        }
    }

    async initPoseLandmarker() {
        await this.poseLandmarker.init();
        this.predictWebcam();
    }

    async predictWebcam() {
        if (!this.webcam.webcamRunning) return;

        // Vertraag de functie-aanroep om de belasting te verminderen
        await new Promise(resolve => setTimeout(resolve, 100)); // Vertraag elke detectie met 100 ms

        const results = await this.poseLandmarker.detectPoses(this.videoElement);

        if (results && results.landmarks && results.landmarks[0] && results.landmarks[0].length >= 13) {
            const essentialLandmarks = {
                nose: results.landmarks[0][0], // Neus, eerste landmark
                leftShoulder: results.landmarks[0][11], // Linkerschouder, twaalfde landmark
                rightShoulder: results.landmarks[0][12] // Rechterschouder, dertiende landmark
            };

            // console.log("Essential landmarks:", essentialLandmarks);

            // Stuur de verzamelde essentiële landmarks naar de WebWorker
            this.worker.postMessage({ type: 'processPoses', data: essentialLandmarks });
        }

        requestAnimationFrame(this.predictWebcam.bind(this));
        // setTimeout(this.predictWebcam.bind(this), 100); 
    }
}