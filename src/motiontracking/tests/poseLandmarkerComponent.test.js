import { PoseLandmarkerComponent } from '../PoseLandmarker.js';

// Mock the PoseLandmarker and FilesetResolver
jest.mock('https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0', () => ({
  PoseLandmarker: {
    createFromOptions: jest.fn().mockResolvedValue({
      detectForVideo: jest.fn().mockResolvedValue({
        poses: [{ landmarks: [{ x: 0, y: 0 }] }],
      }),
    }),
  },
  FilesetResolver: {
    forVisionTasks: jest.fn().mockResolvedValue({}),
  },
}));

describe('PoseLandmarkerComponent', () => {
  let poseLandmarkerComponent;

  beforeEach(() => {
    poseLandmarkerComponent = new PoseLandmarkerComponent();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('init should initialize poseLandmarker with correct options', async () => {
    await poseLandmarkerComponent.init();

    expect(poseLandmarkerComponent.poseLandmarker).toBeDefined();
    expect(PoseLandmarker.createFromOptions).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        baseOptions: expect.objectContaining({
          modelAssetPath: expect.stringContaining('pose_landmarker_lite.task'),
          delegate: 'GPU',
        }),
        runningMode: 'VIDEO',
        numPoses: 1,
      })
    );
  });

  test('detectPoses should call detectForVideo and return poses', async () => {
    await poseLandmarkerComponent.init();

    const videoElement = document.createElement('video');
    const result = await poseLandmarkerComponent.detectPoses(videoElement);

    expect(poseLandmarkerComponent.poseLandmarker.detectForVideo).toHaveBeenCalledWith(videoElement, expect.any(Number));
    expect(result.poses.length).toBeGreaterThan(0);
    expect(result.poses[0].landmarks[0]).toEqual({ x: 0, y: 0 });
  });

  test('detectPoses should throw error if poseLandmarker is not initialized', async () => {
    const videoElement = document.createElement('video');

    await expect(poseLandmarkerComponent.detectPoses(videoElement)).rejects.toThrow('PoseLandmarker is not initialized.');
  });

  test('detectPoses should handle null videoElement gracefully', async () => {
    await poseLandmarkerComponent.init();

    await expect(poseLandmarkerComponent.detectPoses(null)).rejects.toThrow();
  });

  test('init should handle errors from FilesetResolver', async () => {
    jest.mock('https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0', () => ({
      PoseLandmarker: {
        createFromOptions: jest.fn().mockResolvedValue({}),
      },
      FilesetResolver: {
        forVisionTasks: jest.fn().mockRejectedValue(new Error('Network error')),
      },
    }));

    poseLandmarkerComponent = new PoseLandmarkerComponent();

    await expect(poseLandmarkerComponent.init()).rejects.toThrow('Network error');
  });
});