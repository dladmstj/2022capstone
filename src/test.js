const model = poseDetection.SupportedModels.MoveNet;
const detector = await poseDetection.createDetector(model);

const poses = await detector.estimatePoses(image);
