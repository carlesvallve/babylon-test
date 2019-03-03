import { Vector3, Color3 } from "@babylonjs/core/Maths/math";
import { Camera, ArcRotateCamera } from "@babylonjs/core";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/";
import { LensFlareSystem, LensFlare } from "@babylonjs/core/LensFlares";


export const setArcCamera = (canvas, scene, ortographic = null, options = {
  alpha: radians(0), // 0.785398 * 2,
  beta: radians(0), // 0.785398, 
  radius: 10,
  target: new Vector3(0, 0, 0),
  pos: new Vector3(50, 50, -50),
}) => {
  const  { alpha, beta, radius, target, pos } = options;

  const camera = new ArcRotateCamera("Camera", alpha, beta, radius, target, scene, )
  camera.setPosition(pos);
  camera.attachControl(canvas, true);

  if (ortographic) {
    camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
    camera.orthoTop = ortographic;
    camera.orthoBottom = -ortographic;
    camera.orthoLeft = -ortographic;
    camera.orthoRight = ortographic;
  }

  return camera;
}

export const setAmbientLight = (scene, options = {
  intensity: 0.5,
  pos: new Vector3(0, 1, 0),
}) => {
  const { intensity, pos } = options;
  let light = new HemisphericLight('hemi', pos, scene);
  light.intensity = intensity;

  return light;
}

export const setDirectionalLight = (scene, options = {
  intensity: 0.5,
  pos: new Vector3(-5, 5, -5), // new Vector3(-40, 30, -40),
  dir: new Vector3(1, -1, 1), // new Vector3(1, -0.75, 1),
}) => {
  const { intensity, pos, dir } = options;
  const shadowLight = new DirectionalLight('dir01', dir, scene);
  shadowLight.position = pos;
  shadowLight.intensity = intensity;
  shadowLight.shadowMinZ = 1;
  shadowLight.shadowMaxZ = 2500;

  // const radiansFromCameraForShadows = -3 * (Math.PI / 4);
  // scene.registerBeforeRender(() => {
  //   shadowLight.position.x = Math.cos(camera.alpha + radiansFromCameraForShadows) * 40;
  //   shadowLight.position.z = Math.sin(camera.alpha + radiansFromCameraForShadows) * 40;
  //   shadowLight.setDirectionToTarget(Vector3.Zero());
  // });

  return shadowLight;
}
  

export const setShadowGenerator = (light, meshArr) => {
  const shadowGenerator: ShadowGenerator = new ShadowGenerator(1024 /* size of shadow map */, light);
  shadowGenerator.bias = 0.001;
  shadowGenerator.depthScale = 2500;

  shadowGenerator.useBlurExponentialShadowMap = true;
  // for self-shadowing (ie: blocks)
  shadowGenerator.forceBackFacesOnly = true;
  shadowGenerator.depthScale = 100;

  meshArr.map((item) => {
    shadowGenerator.getShadowMap().renderList.push(item);
  })
  
  return shadowGenerator;
}


export const setLensFlareSystem = (scene, light) => {
  // To do so, you have to first create a LensFlareSystem:
  // The second parameter defines the source (the emitter) of the lens flares (it can be a camera, a light or a mesh).
  const lensFlareSystem = new LensFlareSystem("lensFlareSystem", light, scene);
  
  // Then, you can add flares to your system with the following code:
  const flare0 = new LensFlare(0.2, 0, new Color3(1, 1, 1), "Assets/images/particles/lens5.png", lensFlareSystem);
  const flare1 = new LensFlare(0.5, 0.2, new Color3(0.5, 0.5, 1), "Assets/images/particles/lens4.png", lensFlareSystem);
  const flare2 = new LensFlare(0.2, 1.0, new Color3(1, 1, 1), "Assets/images/particles/lens4.png", lensFlareSystem);
  const flare3 = new LensFlare(0.4, 0.4, new Color3(1, 0.5, 1), "Assets/images/particles/Flare.png", lensFlareSystem);
  const flare4 = new LensFlare(0.1, 0.6, new Color3(1, 1, 1), "Assets/images/particles/lens5.png", lensFlareSystem);
  const flare5 = new LensFlare(0.3, 0.8, new Color3(1, 1, 1), "Assets/images/particles/lens4.png", lensFlareSystem);

  return lensFlareSystem
}

// ===============================================================
// // Primitive examples
// import "@babylonjs/core/Meshes/meshBuilder";
// import { Mesh } from "@babylonjs/core/Meshes/mesh";

// // Create Material
// const material = new SimpleMaterial("material", scene);
// material.diffuseColor = new Color3(0.5, 0.5, 1);

// // Box Params: name, size, scene, updatable, sideOrientation
// var box = Mesh.CreateBox("box", 1, scene, false);
// box.position = new Vector3(0, 1, 0);
// box.scaling = new Vector3(1, 2, 1);
// box.material = material;

// // Sphere Params: name, subdivs, size, scene
// const sphere = Mesh.CreateSphere("sphere", 16, 2, scene);
// sphere.position.y = 1;
// sphere.material = material;
// sphere.receiveShadows = true;

// // var cyl = Mesh.CreateCylinder("cone", {diameterTop: 0, tessellation: 4}, scene);
// const cyl = Mesh.CreateCylinder("cyl", 2, 1, 1, 20, 20, scene);
// cyl.position = new Vector3(0, 1, 0);
// cyl.scaling = new Vector3(1, 1, 1);
// cyl.material = material;
// cyl.receiveShadows = true;

// // Ground Params: name, width, depth, subdivs, scene
// const ground = Mesh.CreateGround("ground", 9, 9, 2, scene);
// ground.material = material;
// ground.receiveShadows = true;
// ===============================================================

// Converts from degrees to radians.
export const radians = (degrees) => {
  return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees.
export const degrees = (radians) => {
  return radians * 180 / Math.PI;
};

