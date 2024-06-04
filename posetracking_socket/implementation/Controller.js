// import { WebcamReader } from '/webcamReader';

export class Controller {

    constructor(webcamReader) {
        this.webcamReader = webcamReader;
        this.webSocket = window.webSocket;
        this.webcamReader.startStreaming();
    }

    MovePlayer(gameScene, player) {

        // Receive processed data
        this.webSocket.onmessage = (event) => {

            // Step 1: Decode the base64 string
            const dataString = atob(event.data);

            // get indexes
            // const indexHands = dataString.indexOf("'hand_landmarks'");
            const indexPose = dataString.indexOf("'pose_landmarks'");

            // split string
            // const handsString = dataString.slice(1, (indexPose - 2));
            const poseString = dataString.slice(indexPose, dataString.length - 1);

            // Remove unnecessary characters
            // const cleanedDataHands = handsString.replace(/'/g, '"');
            const cleanedDataPose = poseString.replace(/'/g, '"').replace(/\(/g, '[').replace(/\)/g, ']');

            // Add curly braces to make it a valid JSON object
            // const jsonDataHands = `{${cleanedDataHands}}`;
            const jsonDataPose = `{${cleanedDataPose}}`;

            // Parse the JSON string into an object
            // const handsArray = JSON.parse(jsonDataHands);
            const poseArray = JSON.parse(jsonDataPose);


            // Definieer de positie van het punt
            var xPos = poseArray.pose_landmarks[0][0];
            var yPos = poseArray.pose_landmarks[0][1];

            // Move player according to position
            if (xPos >= 0.66 && xPos <= 1.0) {
              if (gameScene.currentPosition === 1) {
                  gsap.to(player.position, { duration: 0.5, x: 0 });
                  gameScene.currentPosition = 0;
              } else if (gameScene.currentPosition === 0) {
                  gsap.to(player.position, { duration: 0.5, x: -1.4 });
                  gameScene.currentPosition = -1;
              }
          } else if (xPos >= 0.33 && xPos < 0.66) {
              // Middle lane, no movement
          } else if (xPos > 0 && xPos < 0.33) {
              if (gameScene.currentPosition === -1) {
                  gsap.to(player.position, { duration: 0.5, x: 0 });
                  gameScene.currentPosition = 0;
              } else if (gameScene.currentPosition === 0) {
                  gsap.to(player.position, { duration: 0.5, x: 1.4 });
                  gameScene.currentPosition = 1;
              }
          }

          if (yPos < 0.5 && !gameScene.isJumping) {
              gameScene.jump();
          }
        };

    }
}

// export default Controller;
