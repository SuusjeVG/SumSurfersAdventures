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
    
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          this.videoElement.srcObject = stream;
          this.videoElement.play(); 
          this.webcamRunning = true;
      } catch (error) {
          console.error("Error accessing the webcam:", error);
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