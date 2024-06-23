function testWebWorker() {
    let testResults = [];

    // Simulate Worker Message
    const mockPostMessage = jest.fn();
    global.self = {
        postMessage: mockPostMessage,
        onmessage: null,
    };
    require('./webworker.js');

    // Test: should process poses
    const mockData = { nose: { y: 0.5 }, leftShoulder: { x: 0.4 }, rightShoulder: { x: 0.6 } };
    self.onmessage({ data: { type: 'processPoses', data: mockData } });

    if (mockPostMessage.mock.calls.length > 0) {
        testResults.push({
            suite: 'WebWorker.test.js',
            testCase: '`should process poses`',
            description: 'Controleert of de webworker de poses correct verwerkt en een bericht terugstuurt.',
            result: 'Geslaagd'
        });
    } else {
        testResults.push({
            suite: 'WebWorker.test.js',
            testCase: '`should process poses`',
            description: 'Controleert of de webworker de poses correct verwerkt en een bericht terugstuurt.',
            result: 'Mislukt'
        });
    }

    console.table(testResults);
}

testWebWorker();