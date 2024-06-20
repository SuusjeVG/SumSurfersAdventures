self.onmessage = function(event) {
    const { type, data } = event.data;
    switch (type) {
        case 'processPoses':
            // Verwerk de poses data
            const processedPoses = processPoses(data);
            postMessage({ type: 'posesProcessed', data: processedPoses });
            break;
    }
};

function processPoses(data) {
    const { nose, leftShoulder, rightShoulder } = data;

    // Voer berekeningen uit zoals in je processTrackingData
    const noseY = nose.y;
    const leftX = leftShoulder.x;
    const rightX = rightShoulder.x;
    const averageShouldersX = (leftX + rightX) / 2;

    return { noseY, averageShouldersX };
}
