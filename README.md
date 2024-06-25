# SumSurferAdventures

**SumSurferAdventures** is an educational game developed for the **GrowthMoves** project, aimed at teaching children in a fun and interactive way. The game uses motion tracking to allow children to control the character with their body, engaging in educational activities through gameplay. SumSurferAdventures is an endless runner web game built with Three.js.

## Used Modules

The project utilizes the following modules:

- **three.js**: For 3D graphics and rendering.
- **cannon-es**: For physics simulations.
- **gsap.js**: For animations.
- **mediapipe**: For motion tracking and hand recognition.

## Project Structure

The project structure is as follows:

- **root**: The main directory of the project.
  - **public**: Contains the view files.
  - **src**: Contains all the core components of the game.
    - **assets**: Contains all necessary assets like images, sounds, models, etc.
    - **Scenes**: Contains the game logic and scenes.
    - **components**: Contains various components and modules used in the game.
    - **Motiontracking**: Motiontracking initialisation with mediapipe and a webworker. It also includes unit tests.

## Running the Game on Your PC

Follow these steps to run SumSurferAdventures locally on your PC:

1. **Clone the repository**:
   Open your terminal and run the following command to clone the repository:
   ```bash
   git clone https://github.com/SuusjeVG/SumSurfersAdventures.git
   ```
2. Install node_modules
   ```bash
   npm install
   ```
3. Open website

    you can open the game in your browser withouth using a builder. This is because of the importmap and the use of a CDN
   ```html
    <script type="importmap">
        {
            "imports": {
                "three": "/node_modules/three/build/three.module.js",
                "three/addons/": "/node_modules/three/examples/jsm/",
                "cannon-es": "/node_modules/cannon-es/dist/cannon-es.js",
                "gsap": "/node_modules/gsap/index.js"
            }
        }
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js"></script>
   ```
   You can use live server. It's also ready to be added to a live invoirment on the internet.

# Optimalisation motiontracking

To enhance the performance of the motion tracking module, several major changes were implemented. This resulted in more accurate tracking and faster performance.

Here are a few examples of what was done:

## PoseLandmarker.js

```javascript
async init() {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );

    this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
        modelAssetPath: "/src/motiontracking/model/pose_landmarker_lite.task", // pick the lite task for better performance
        delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
    });
}
```

* Use the lightweight model for better performance.

## MotiotrackingHanler.js

Slowing down detection, using a webworker, and adding requestAnimationFrame.

```javascript
async predictWebcam() {
    if (!this.webcam.webcamRunning) return;

    // Slow down the detection to 10fps
    await new Promise(resolve => setTimeout(resolve, 100)); // 1000ms / 10fps = 100ms

    const results = await this.poseLandmarker.detectPoses(this.videoElement);

    if (results && results.landmarks && results.landmarks[0] && results.landmarks[0].length >= 13) {
        const essentialLandmarks = {
            nose: results.landmarks[0][0], // Nose, first landmark
            leftShoulder: results.landmarks[0][11], // Leftshoulder, landmark 12
            rightShoulder: results.landmarks[0][12] // Rightshoulder, landmark 13
        };

        // console.log("Essential landmarks:", essentialLandmarks);

        // Send the essential landmarks to the worker
        this.worker.postMessage({ type: 'processPoses', data: essentialLandmarks });
    }

    /// Call this function again to keep predicting the webcam
    requestAnimationFrame(this.predictWebcam.bind(this));
    // setTimeout(this.predictWebcam.bind(this), 100); // optional alternative to requestAnimationFrame
}
```

* Slowing down the detection to 10fps and sending essential landmarks to a webworker to offload the main thread.

* Using requestAnimationFrame ensures the function is called in sync with the browser's rendering process, resulting in smoother animations and better performance.

## webworker.js

```javascript
self.onmessage = function(event) {
    const { type, data } = event.data;
    switch (type) {
        case 'processPoses':
            //  Process the poses
            const processedPoses = processPoses(data);
            postMessage({ type: 'posesProcessed', data: processedPoses });
            break;
    }
};

function processPoses(data) {
    const { nose, leftShoulder, rightShoulder } = data;

    // add logic and mathematics here
    const noseY = nose.y;
    const leftX = leftShoulder.x;
    const rightX = rightShoulder.x;
    const averageShouldersX = (leftX + rightX) / 2;

    return { noseY, averageShouldersX };
}

```

* Receives and processes large parts of the data and performs the calculations.

# Contribution

We welcome contributions to the project. Feel free to submit a pull request or open an issue if you encounter any problems or have suggestions for improvements.

# License

This project is licensed under the MIT License. See the LICENSE file for more information.