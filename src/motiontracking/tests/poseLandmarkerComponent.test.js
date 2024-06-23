import { PoseLandmarkerComponent } from './poselandmark.js';

async function testPoseLandmarker() {
    let testResults = [];

    const poseLandmarker = new PoseLandmarkerComponent();
    
    // Test: should initialize pose landmarker
    try {
        await poseLandmarker.init();
        if (poseLandmarker.poseLandmarker) {
            testResults.push({
                suite: 'PoseLandmarker.test.js',
                testCase: '`should initialize pose landmarker`',
                description: 'Controleert of de init functie de PoseLandmarker correct initialiseert.',
                result: 'Geslaagd'
            });
        } else {
            throw new Error('PoseLandmarker not initialized.');
        }
    } catch (error) {
        testResults.push({
            suite: 'PoseLandmarker.test.js',
            testCase: '`should initialize pose landmarker`',
            description: 'Controleert of de init functie de PoseLandmarker correct initialiseert.',
            result: `Mislukt: ${error.message}`
        });
    }

    // Test: should detect poses
    try {
        const videoElement = document.createElement('video');
        const poses = await poseLandmarker.detectPoses(videoElement);
        if (poses) {
            testResults.push({
                suite: 'PoseLandmarker.test.js',
                testCase: '`should detect poses`',
                description: 'Controleert of de detectPoses functie van PoseLandmarkerComponent poses detecteert in een video-element.',
                result: 'Geslaagd'
            });
        } else {
            throw new Error('No poses detected.');
        }
    } catch (error) {
        testResults.push({
            suite: 'PoseLandmarker.test.js',
            testCase: '`should detect poses`',
            description: 'Controleert of de detectPoses functie van PoseLandmarkerComponent poses detecteert in een video-element.',
            result: `Mislukt: ${error.message}`
        });
    }

    return testResults;
}

testPoseLandmarker().then(results => console.table(results));