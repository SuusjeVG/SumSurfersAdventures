import { Webcam } from './webcamrenderer.js';

function testWebcam() {
    let testResults = [];

    // Setup
    document.body.innerHTML = '<video id="test-video"></video>';
    const webcam = new Webcam('test-video');

    // Test: should start the webcam
    webcam.startWebcam().then(() => {
        if (webcam.webcamRunning) {
            testResults.push({
                suite: 'Webcam.test.js',
                testCase: '`should start the webcam`',
                description: 'Controleert of de startWebcam functie van Webcam de webcam correct start.',
                result: 'Geslaagd'
            });
        } else {
            testResults.push({
                suite: 'Webcam.test.js',
                testCase: '`should start the webcam`',
                description: 'Controleert of de startWebcam functie van Webcam de webcam correct start.',
                result: 'Mislukt'
            });
        }

        // Test: should stop the webcam
        webcam.stopWebcam();
        if (!webcam.webcamRunning) {
            testResults.push({
                suite: 'Webcam.test.js',
                testCase: '`should stop the webcam`',
                description: 'Controleert of de stopWebcam functie van Webcam de webcam correct stopt.',
                result: 'Geslaagd'
            });
        } else {
            testResults.push({
                suite: 'Webcam.test.js',
                testCase: '`should stop the webcam`',
                description: 'Controleert of de stopWebcam functie van Webcam de webcam correct stopt.',
                result: 'Mislukt'
            });
        }

        console.table(testResults);
    });
}

testWebcam();