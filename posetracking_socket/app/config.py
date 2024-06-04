from cvzone.HandTrackingModule import HandDetector
import mediapipe as mp

hand_detector = HandDetector(detectionCon=0.8, maxHands=2)
pose_detector = mp.solutions.pose.Pose(static_image_mode=True, min_detection_confidence=0.5)
