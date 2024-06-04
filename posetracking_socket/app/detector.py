import cv2
from cvzone.HandTrackingModule import HandDetector
import mediapipe as mp
import asyncio
import logging

class HandPoseDetector:
    """
    Hand and Pose Detector using cvzone and Mediapipe.
    Implements noise reduction using a bilateral filter.
    """
    def __init__(self, hand_detector: HandDetector, pose_detector: mp.solutions.pose.Pose, width: int = 1280, height: int = 720) -> None:
        self.cap = cv2.VideoCapture(0)
        self.cap.set(3, width)
        self.cap.set(4, height)
        self.hand_detector = hand_detector
        self.pose = pose_detector
        self.loop = asyncio.get_event_loop()


        logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
        self.logger = logging.getLogger('HandPoseDetector')

    async def detect_hand_pose(self, img):
        """
        Asynchronous method to detect hand and pose landmarks.
        """

        img = cv2.bilateralFilter(img, d=9, sigmaColor=75, sigmaSpace=75)
        
  
        hands = await self.loop.run_in_executor(None, self.hand_detector.findHands, img, False)
        hand_landmarks = []
        if hands:
            hand = hands[0]
            hand_landmarks = hand["lmList"]  
        
   
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = await self.loop.run_in_executor(None, self.pose.process, img_rgb)
        pose_landmarks = []
        if results.pose_landmarks:
            pose_landmarks = [(lm.x, lm.y, lm.z) for lm in results.pose_landmarks.landmark]
        
        return hand_landmarks, pose_landmarks

    async def read_frame(self):
        """
        Asynchronous method to read a frame from the video capture.
        """
        success, img = await self.loop.run_in_executor(None, self.cap.read)
        if success:
            return img
        return None
