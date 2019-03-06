import { Vector3, Color3, Plane } from "@babylonjs/core/Maths/math";
import { ArcRotateCamera, Texture, MirrorTexture, StandardMaterial, Mesh } from "@babylonjs/core";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/";
import { LensFlareSystem, LensFlare } from "@babylonjs/core/LensFlares";
import { AssetsManager, CubeTexture } from "@babylonjs/core/"
import { color3, color4, randomColor3, randomColor4, Colors } from "../utils/colors";
import { getRandomKeyValue, getRandomInt } from "../utils/math";
// import { radians, degrees } from './math.ts';

// =================================================
// Assets

export const getFileName = (url) => {
  const arr = url.split('/')
  return arr[arr.length - 1].split('.')[0];
}

export const loadMesh = (scene, path, fileName, cb) => {
  var assetsManager = new AssetsManager(scene);
  var meshTask = assetsManager.addMeshTask(`${fileName} task`, '', path, fileName);

  meshTask.onSuccess = function (task) {
    cb(task, null);
  }

  meshTask.onError = function (task, message, exception) {
    cb(task, { message, exception });
  }

  assetsManager.load();
}

export const findMesh = (scene, name) => {
  return scene.meshes.find(mesh => mesh.name === name);
}

// =================================================
// Cameras

export const setArcCamera = (
  canvas, scene, ortographic = null, options = {
  alpha: 0, // radians(0), // 0.785398 * 2,
  beta: 0, // radians(0), // 0.785398, 
  radius: 10,
  target: new Vector3(0, 0, 0),
  pos: new Vector3(10, 10, -10),
}) => {
  const  { alpha, beta, radius, target, pos } = options;

  const camera = new ArcRotateCamera("Camera", 0, 0, radius, target, scene, )
  camera.setPosition(pos);
  camera.attachControl(canvas, true);

  return camera;
}

// =================================================
// Environment

export const setEnvironment = (
  scene,
  options = {
    clearColor: color3(Colors.black),
    ambientColor: color3(Colors.darkgrey),
  }
) => {

  const { clearColor, ambientColor } = options;

  // scene
  scene.clearColor = clearColor; // randomColor4(),
  scene.ambientColor = ambientColor; // randomColor3(),

  // lights
  const alight = setAmbientLight(scene);
  const dlight = setDirectionalLight(scene,
    { intensity: 5, pos: new Vector3(-50, 50, -0), dir: new Vector3(-40, 30, -40) }
  );

  // shadows
  const shadowLight = setDirectionalLight(scene, 
    { intensity: 0.5, pos: new Vector3(0, 50, -0), dir: new Vector3(0, -1, 0) }
  );

  const shadowGenerator = setShadowGenerator(shadowLight);

  // skybox
  const skybox = setSkybox(scene);

  // lens flare
  const lensFlare = setLensFlareSystem(scene, dlight)

  return { alight, dlight, shadowLight, shadowGenerator, skybox, lensFlare };
}

export const setAmbientLight = (
  scene, options = {
  intensity: 0.5,
  pos: new Vector3(0, 1, 0),
}) => {
  const { intensity, pos } = options;
  let light = new HemisphericLight('hemi', pos, scene);
  light.intensity = intensity;

  return light;
}

export const setDirectionalLight = (
  scene, options = {
  intensity: 1,
  pos: new Vector3(0, 50, -0),
  dir: new Vector3(1, -1, 1),
}) => {
  
  const { intensity, pos, dir } = options;
  const dlight = new DirectionalLight('dir01', dir, scene);
  dlight.position = pos;
  dlight.intensity = intensity;
  dlight.shadowMinZ = 1;
  dlight.shadowMaxZ = 2500;

  // dlight.setDirectionToTarget(Vector3.Zero());

  return dlight;
}
  

export const setShadowGenerator = (light, meshArr = []) => {
  const shadowGenerator: ShadowGenerator = new ShadowGenerator(1024 /* size of shadow map */, light);
  
  // bias
  shadowGenerator.bias = 0.001;
  shadowGenerator.depthScale = 100; // 2500;

  // exponential
  shadowGenerator.useBlurExponentialShadowMap = true;
  
  // blurKernel
  shadowGenerator.useKernelBlur = true;
  shadowGenerator.blurKernel = 8; // 64;
  
  // for self-shadowing (ie: blocks)
  shadowGenerator.forceBackFacesOnly = true;

  // shadowGenerator.getShadowMap().refreshRate = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;

  // add given mesh list to the shadow map
  meshArr.map((item) => {
    shadowGenerator.getShadowMap().renderList.push(item);
  })
  
  return shadowGenerator;
}

export const setSkybox = (scene, fileName = null) => {
  // skybox
  const path = '/assets/skyboxes/';
  if (!fileName) {
    // fileName = 'environment.env';
    // fileName = 'forest.env';
    fileName = 'Runyon_Canyon_A_2k_cube_specular.env';
    // fileName = 'SpecularHDR.env';
    // fileName = 'Studio_Softbox_2Umbrellas_cube_specular.env';
  }
  
  const envTexture = new CubeTexture(`${path}${fileName}`, scene); 
  const skybox = scene.createDefaultSkybox(envTexture, true, 1000);
  console.log('skybox', skybox)
  return skybox;
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

export const setMirror = (
  scene,
  options = {
    name: 'mirror',
    size: 50,
    mirrorSize: 512,
    position: new Vector3(0, 0, 0),
    direction: new Vector3(0, -1, 0),
    distance: 0,
    level: 0.4,
    color: null,
    texture: null,
    meshes: [],
  }
) => {
  const  { size, mirrorSize, position, direction, distance, level, color, texture, meshes } = options;

  // create mirror texture
  var mirrorTexture = new MirrorTexture(name, mirrorSize, scene, true); //Create a mirror texture
  mirrorTexture.mirrorPlane = new Plane(direction.x, direction.y, direction.z, distance);
  mirrorTexture.renderList = meshes; // result.loadedMeshes; // [droid.mesh, speedy, shark, star];
  mirrorTexture.level = level; // 0.4;//Select the level (0.0 > 1.0) of the reflection
  
  // mirror material
  var mirrorMaterial = new StandardMaterial(`${name}-material`, scene);       
  if (color) { mirrorMaterial.diffuseColor = color; }
  if (texture) { mirrorMaterial.diffuseTexture = texture; }
  mirrorMaterial.reflectionTexture = mirrorTexture;

  // mirror plane
  var plane = Mesh.CreatePlane("plane", size, scene);
  plane.position = position;
  plane.rotation = new Vector3(Math.PI / 2, 0, 0);
  plane.material = mirrorMaterial;

  return { plane, material: mirrorMaterial, texture: mirrorTexture };
}

export const setTexture = (scene, fileName = null, size = {x : 0, y: 0}) => {
  // if no fileName was given get a random one
  if (!fileName) {
    const types = {scifi: 5, stone: 6, white: 7, wood: 4 };
    const item = getRandomKeyValue(types);
    fileName = `${item.key}-${getRandomInt(1, item.value)}`
  }

  console.log(fileName);
  
  // create texture at random repeat size
  const texture = new Texture(`/assets/textures/${fileName}.jpg`, scene);
  const sc = getRandomInt(1, 9);
  texture.uScale = size.x ? size.x : sc;
  texture.vScale = size.y ? size.y : sc;
  texture.uOffset = 0;
  texture.vOffset = 0;

  return texture;
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


