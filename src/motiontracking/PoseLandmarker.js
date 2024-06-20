import {
    PoseLandmarker,
    FilesetResolver,
} from "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0";

  
export class PoseLandmarkerComponent {
    constructor() {
      this.poseLandmarker = undefined;
    }
  
    async init() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
  
      this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "/src/motiontracking/model/pose_landmarker_lite.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });
    }
  
    async detectPoses(videoElement) {
      if (!this.poseLandmarker) {
          console.log("Wait! poseLandmarker not loaded yet.");
          throw new Error("PoseLandmarker is not initialized.");
      }
  
      let startTimeMs = performance.now();
      return await this.poseLandmarker.detectForVideo(videoElement, startTimeMs);
  }
}