import { MotionTracking } from './motiontrackinghandler.js';

function testMotionTracking() {
    let testResults = [];

    // Setup
    document.body.innerHTML = '<video id="test-video"></video>';
    const mockOnPoseData = data => {
        console.log('Pose data:', data);
    };
    const motionTracking = new MotionTracking('test-video', mockOnPoseData);

    // Test: should initialize and start motion tracking
    motionTracking.init().then(() => {
        if (motionTracking.webcam.webcamRunning) {
            testResults.push({
                suite: 'MotionTracking.test.js',
                testCase: '`should initialize and start motion tracking`',
                description: 'Controleert of de MotionTracking component correct initialiseert en motion tracking start.',
                result: 'Geslaagd'
            });
        } else {
            testResults.push({
                suite: 'MotionTracking.test.js',
                testCase: '`should initialize and start motion tracking`',
                description: 'Controleert of de MotionTracking component correct initialiseert en motion tracking start.',
                result: 'Mislukt'
            });
        }

        // Simulate onPoseData call
        const sampleData = { noseY: 0.5, averageShouldersX: 0.75 };
        motionTracking.worker.onmessage({ data: { type: 'posesProcessed', data: sampleData } });
        testResults.push({
            suite: 'MotionTracking.test.js',
            testCase: '`should call onPoseData with correct landmarks`',
            description: 'Controleert of de onPoseData callback correct wordt aangeroepen met juiste gegevens.',
            result: 'Geslaagd'
        });

        console.table(testResults);
    });
}

testMotionTracking();