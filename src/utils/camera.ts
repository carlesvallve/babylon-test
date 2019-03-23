import { ArcRotateCamera, Vector3, CubicEase, EasingFunction, Animation, Tools } from "@babylonjs/core";

// =================================================
// Cameras

export const setArcCamera = (
  canvas, scene, options = {
  alpha: Math.PI - Math.PI / 4, // 0
  beta: Math.PI / 3, // 0
  radius: 150, // 10
  target: new Vector3(0, 0, 0),
  pos: new Vector3(20, 20, -20),
}) => {
  const  { alpha, beta, radius, target, pos } = options;

  const camera = new ArcRotateCamera("Camera", alpha, beta, radius, target, scene, );
  camera.allowUpsideDown = false;
  camera.lowerRadiusLimit = 10;
  camera.upperRadiusLimit = 50;

  // scene.collisionsEnabled = true;
  // camera.collisionRadius = new Vector3(0.5, 0.5, 0.5);
  // camera.checkCollisions = true;

  camera.setPosition(pos);
  camera.attachControl(canvas, true);

  camera.keysLeft.push(81);  // Q
  camera.keysRight.push(69); // E

  camera.update();

  return camera;
}


export const animateCameraTo = (
  camera: ArcRotateCamera,
  target: Vector3,
  position: Vector3,
  framePerSecond: number,
  totalFrame: number
): void => {
  // animates camera to given camera position looking at given target position
  var ease = new CubicEase();
  ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
  Animation.CreateAndStartAnimation('at4', camera, 'position', framePerSecond, totalFrame, camera.position, position, 0, ease);
  Animation.CreateAndStartAnimation('at5', camera, 'target', framePerSecond, totalFrame, camera.target, target, 0, ease);
};

