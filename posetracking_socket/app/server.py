import asyncio
import websockets
import base64
import numpy as np
import cv2
import logging
from detector import HandPoseDetector

class WebSocketServer:
    """
    Asynchronous WebSocket Server for Hand and Pose Detection.
    Receives base64 encoded images, processes them, and returns detected landmarks.
    """
    def __init__(self, detector: HandPoseDetector, host: str = "0.0.0.0", port: int = 8766):
        self.host = host
        self.port = port
        self.detector = detector

        # Set up logging
        logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
        self.logger = logging.getLogger('WebSocketServer')

    async def handle_client(self, websocket, path):
        """
        Handles incoming WebSocket connections and processes images for hand and pose detection.
        """
        self.logger.info(f"Client connected: {path}")
        async for message in websocket:
            try:
                # Decode base64 encoded image
                image_data = message.split(",")[1]
                image_bytes = base64.b64decode(image_data)
                nparr = np.frombuffer(image_bytes, np.uint8)
                image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                
                # Detect hand and pose landmarks
                hand_landmarks, pose_landmarks = await self.detector.detect_hand_pose(image)
                response = {
                    'hand_landmarks': hand_landmarks,
                    'pose_landmarks': pose_landmarks
                }
                # Send response
                await websocket.send(base64.b64encode(str(response).encode()).decode())
            except Exception as e:
                self.logger.error(f"Error processing image: {e}")
                await websocket.send(base64.b64encode("Error processing image".encode()).decode())

    def run(self):
        """
        Starts the asynchronous WebSocket server.
        """
        self.logger.info(f"Starting server at ws://{self.host}:{self.port}")
        start_server = websockets.serve(self.handle_client, self.host, self.port)
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()

if __name__ == "__main__":
    from config import hand_detector, pose_detector
    detector = HandPoseDetector(hand_detector, pose_detector)
    server = WebSocketServer(detector)
    server.run()
