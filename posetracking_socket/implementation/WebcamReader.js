export class WebcamReader {

    constructor() {
        this.initStream();
    }

    // connecting to websockets and initializing elements
    initStream = () => {
        this.webSocket = window.mediaPipe;
        this.videoElement = document.getElementById("webcam-video");

        // start up webcam
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {

                this.videoElement.srcObject = stream;
                this.videoElement.play();

                // set canvas dimensions after the video metadata is loaded
                this.videoElement.addEventListener("loadedmetadata", () => {

                    console.log("Loaded video");

                    this.canvas = document.createElement("canvas");
                    this.context = this.canvas.getContext("2d");
                    if (!this.context) {
                        console.log("No context found while initializing...");
                    }
                    this.canvas.width = this.videoElement.videoWidth;
                    this.canvas.height = this.videoElement.videoHeight;

                });
            });

        // open websocket messages
        this.webSocket.onopen = () => {
            console.log("WebSocket connection established.");
        };
    }

    // Function to send frames via WebSocket
    sendFrames = () => {

        // check if context is available
        if (!this.context) {
            console.log("No context found...");
            return;
        }

        // take image from webcam and send it to Mediapipe websocket
        this.context.drawImage(this.videoElement, 0, 0, this.canvas.width, this.canvas.height);
        const imageData = this.canvas.toDataURL("image/jpeg", 0.1);
        this.webSocket.send(imageData);

    };

    // Init streaming
    startStreaming = () => {
        // start streaming at 6 frames per second - change if needed
        setInterval(this.sendFrames, 1000 / 6);

    }

}



