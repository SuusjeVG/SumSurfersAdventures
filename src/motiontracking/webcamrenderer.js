export class Webcam {
    constructor(videoElementId) {
      this.videoElement = document.getElementById(videoElementId);
      this.webcamRunning = false;
    }
  
    async startWebcam() {
      if (!navigator.mediaDevices?.getUserMedia) {
        console.warn("getUserMedia() is not supported by your browser");
        return;
      }
  
      if (!this.webcamRunning) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.videoElement.srcObject = stream;
        this.webcamRunning = true;
      }
    }
  
    stopWebcam() {
      if (this.webcamRunning) {
        this.videoElement.srcObject.getTracks().forEach(track => track.stop());
        this.videoElement.srcObject = null;
        this.webcamRunning = false;
      }
    }
}