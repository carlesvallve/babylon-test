import { Texture } from "@babylonjs/core";
import { AssetsManager } from "@babylonjs/core/"
import { getRandomKeyValue, getRandomInt } from "./math";


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

export const setTexture = (scene, fileName = null, size = { x : 0, y: 0 }) => {
  // if no fileName was given get a random one
  if (!fileName) {
    const types = {scifi: 5, stone: 6, white: 7, wood: 4 };
    const item = getRandomKeyValue(types);
    fileName = `${item.key}-${getRandomInt(1, item.value)}`
  }

  console.log(fileName, size);
  
  // create texture at random repeat size
  const texture = new Texture(`/assets/textures/${fileName}`, scene);
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



