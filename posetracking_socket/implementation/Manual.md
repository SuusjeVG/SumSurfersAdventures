# Implementatie handleiding AsyncHandDetector

## Overzicht
<b>AsyncHandDetector</b> is een proof of concept applicatie die laat zien hoe asynchrone programmering gebruikt kan worden voor efficiënte real-time handdetectie in videostreams. 
Door gebruik te maken van cvzone, mediapipe's HandTrackingModule, en OpenCV, detecteert en volgt deze tool handbewegingen in videobeelden. 
Met kenmerken zoals asynchrone videobewerking, ruisreductie en real-time handtracking, biedt AsyncHandDetector een krachtig platform voor interactieve installaties, 
augmented reality en educatieve toepassingen.
<br>
<br>
Uitgebreide documentatie van de applicatie zelf is hier terug te vinden: [README AsyncHandDetector](../README.md)


## Gebruik van WebSocket
AsyncHandDetector ondersteunt WebSocket voor real-time communicatie van handtracking gegevens. Hier is een voorbeeld van hoe je een WebSocket client kunt opzetten 
om deze gegevens te gebruiken als controller in een Phaser game. Er zijn 2 componenten nodig om te kunnen communiceren met de websocket.

### Webcamreader.ts
Verantwoordelijk voor het openen van de connectie en het versturen van berichten naar de websocket.

### Controller.ts
Verantwoordelijk voor het uitlezen van de berichten van de websocket.


## Toepassing in project

### Stap 1:
Voeg de componenten <b>WebcamReader</b> en <b>Controller</b> toe aan je project.
Voeg een HTMLVideoElement genaamd 'webcam-video' toe aan de pagina waar de motiontracking toegepast gaat worden.

### Stap 2:
Voeg de volgende code toe aan je <b>Index.ts</b> file:

```typescript
// check if there is a webcam present
const hasGetUserMedia = () =>

    !!navigator.mediaDevices?.getUserMedia;

// if a webcam is found    
if (hasGetUserMedia()) {

// (window as any) = set as global variable so the components can be accessed troughout the program

// open connection with websocket
(window as any).webSocket = new WebSocket("ws://4.158.52.151:8766");

// init webcamreader
(window as any).webcamReader = new WebcamReader();

    // if no webcam is found   
} else {
    console.warn(
        "getUserMedia() is not supported by your browser"
    );
}

```

### Stap 3:
Initializeer de controller in het bestand waar je de motiontracking wilt toepassen.

```typescript

// initialize controller and pass along webcamreader
this.motionController = new Controller((window as any).webcamReader));

// in the game loop you can now move the player with the Controller
update() {

    this.motionController.MovePlayer(this, this.player); 

}

```

## Toepassing in een ander project:

Dit voorbeeld is gemaakt op basis van een phaser game. Het belangrijkste van de Controller klasse is het uitlezen van de inkomende berichten.
<br>Dit gebeurd in het onmessage event in de <b>Controller</b>:

```typescript

// Receive processed data
this.mediaPipe.onmessage = (event: MessageEvent) => {

     // Decode the base64 string
     const dataString = atob(event.data);
     
     // get indexes
     const indexHands = dataString.indexOf("'hand_landmarks'");
     const indexPose = dataString.indexOf("'pose_landmarks'");

     // split string
     const handsString = dataString.slice(1, (indexPose - 2));
     const poseString = dataString.slice(indexPose, dataString.length - 1);      

     // Remove unnecessary characters
     const cleanedDataHands = handsString.replace(/'/g, '"');
     const cleanedDataPose = poseString.replace(/'/g, '"').replace(/\(/g, '[').replace(/\)/g, ']');

     // Add curly braces to make it a valid JSON object
     const jsonDataHands = `{${cleanedDataHands}}`;
     const jsonDataPose = `{${cleanedDataPose}}`;

     // Parse the JSON string into an object
     const poseArray = JSON.parse(jsonDataPose);
     const handsArray = JSON.parse(jsonDataHands);

     // Choose which datapoints you want to use

     // Definine X and Y coordinates
     var xPos = poseArray .pose_landmarks[0][0]
     var yPos = poseArray .pose_landmarks[0][1]
  
}

```

### Hand of Pose tracking:

Je kan kiezen of je de coordinaten van de hand- of pose tracking wilt gebruiken en welke landmarks je wilt gebruiken.
<br><br>
<i>Een overzicht van de beschikbare landmarks is hier te vinden:</i>
<br>
PoseTracking: [PoseTracking Landmarks](https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker#pose_landmarker_model)<br>
HandTracking: [HandTracking Landmarks](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker#models)
<br><br>

<b>Voorbeeld: </b>Coordinaten van puntje van de wijsvinger. (HandLandmark: nr. 8)

```typescript

   // reading out message..

   // Parse the JSON string into an object
     const poseArray = JSON.parse(jsonDataPose);
     const handsArray = JSON.parse(jsonDataHands);

     // Choose index finger tip landmark nr. 8

     // Definine X and Y coordinates
     var xPos = handsArray .hand_landmarks[8][0]
     var yPos = handsArray .hand_landmarks[8][1]
  
}

```

<b>Voorbeeld: </b>Coordinaten van de neus. (PoseLandmark: nr. 0)

```typescript

   // reading out message..

   // Parse the JSON string into an object
     const poseArray = JSON.parse(jsonDataPose);
     const handsArray = JSON.parse(jsonDataHands);

     // Choose nose landmark nr. 0

     // Definine X and Y coordinates
     var xPos = poseArray .pose_landmarks[0][0]
     var yPos = poseArray .pose_landmarks[0][1]
  
}

```



