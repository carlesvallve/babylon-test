import { Scene } from "@babylonjs/core/scene";
import { Vector3, Color3 } from "@babylonjs/core/Maths/math";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { SimpleMaterial } from "@babylonjs/materials/simple";
import  { SceneLoader } from '@babylonjs/core'

// Required side effects to populate the Create methods on the mesh class. Without this, the bundle would be smaller but the createXXX methods from mesh would not be accessible.
import "@babylonjs/core/Meshes/meshBuilder";

// utils
import { 
  setArcCamera,
  setAmbientLight,
  setDirectionalLight,
  setShadowGenerator,
  setLensFlareSystem,
  loadMesh,
} from "./utils/babylon-utils";

export const testScene = (canvas, engine) => {
  // scene
  var scene = new Scene(engine);

  // camera
  const camera = setArcCamera(canvas, scene);
  // camera.fov = 0.3;

  // materials
  const material = new SimpleMaterial("material", scene);
  material.diffuseColor = new Color3(0.5, 0.5, 1);

  // model
  // const baseUrl = 'assets/meshes/glb/';
  // Promise.all([
  //   loadMesh(scene, baseUrl, 'fish.glb').then(function (result) {
  //     result.meshes[0].position.x = 0.01;
  //   }),
  //   // SceneLoader.ImportMeshAsync(null, baseUrl, "fish.glb", scene).then(function (result) {
  //   //     result.meshes[0].position.x = 0.01;
  //   // }),
  //   // SceneLoader.ImportMeshAsync(null, baseUrl , "alien.glb", scene).then(function (result) {
  //   //     result.meshes[0].position.x = -0.01;
  //   //     result.meshes[0].position.y = -0.01;
  //   //     result.meshes[0].scaling.scaleInPlace(0.25);
  //   // })
  // ]).then(() => {
  //     console.log('all mehes loaded!');
  // });

  let models = [];
  // let baseUrl = 'assets/meshes/babylon/';
  // Promise.all([
  //   SceneLoader.ImportMeshAsync(
  //     null, baseUrl, "tree2.babylon", scene, onprogress = (e) => {
  //       console.log(e.loaded, '/', e.total);
  //     })
  //     .then((result) => {
  //       console.log(result)
  //       result.meshes.map((mesh) => {
  //         models.push(mesh);
  //         shadowGenerator.getShadowMap().renderList.push(mesh);
  //         // mesh.position = new Vector3(1, 1, 1);
  //         mesh.translate(new Vector3(0, 1, 0), 0.45);
  //       })
  //       // result.meshes[0].position = new Vector3(1, 1, 1);
  //       // result.meshes[0].scaling.scaleInPlace(1);
  //   }),
  //   // SceneLoader.ImportMeshAsync(null, baseUrl , "alien.glb", scene).then(function (result) {
  //   //     result.meshes[0].position.x = -0.01;
  //   //     result.meshes[0].position.y = -0.01;
  //   //     result.meshes[0].scaling.scaleInPlace(0.25);
  //   // })
  // ]).then((result) => {
  //     console.log('all mehes loaded!', result);
  // });

  // const baseUrl = 'assets/meshes/babylon/spaceships/';
  Promise.all([
    SceneLoader.ImportMeshAsync(null,
      'assets/meshes/babylon/spaceships/', 'spaceships.babylon',
      scene, onprogress = (e) => {
        console.log(e.loaded, '/', e.total);
      }).then((result) => {
        console.log(result)
        result.meshes.map((mesh) => {
          models.push(mesh);
          shadowGenerator.getShadowMap().renderList.push(mesh);
          // mesh.translate(new Vector3(0, 1, 0), 0.45);
        })
    }),
    // SceneLoader.ImportMeshAsync(null,
    //   'assets/meshes/babylon/spaceships/', 'space-invader.babylon',
    //   scene, onprogress = (e) => {
    //     console.log(e.loaded, '/', e.total);
    //   }).then((result) => {
    //     console.log(result)
    //     result.meshes.map((mesh) => {
    //       models.push(mesh);
    //       shadowGenerator.getShadowMap().renderList.push(mesh);
    //       mesh.translate(new Vector3(0, 5, 0), 0.45);
    //     })
    // }),
    // SceneLoader.ImportMeshAsync(null, baseUrl , "alien.glb", scene).then(function (result) {
    //     result.meshes[0].position.x = -0.01;
    //     result.meshes[0].position.y = -0.01;
    //     result.meshes[0].scaling.scaleInPlace(0.25);
    // })
  ]).then((result) => {
      console.log('all mehes loaded!', result);
  });

  // box
  // var box = Mesh.CreateBox("box", 1, scene, false);
  // box.position = new Vector3(0, 1.5, 0);
  // box.scaling = new Vector3(1, 3, 1);
  // box.material = material;

  // ground
  var ground = Mesh.CreateBox("ground", 1, scene, false);
  ground.position = new Vector3(0, -0.25, 0);
  ground.scaling = new Vector3(9, 0.5, 9);
  ground.material = material;
  ground.receiveShadows = true;

  // lights and shadows
  const ambient = setAmbientLight(scene);
  const light = setDirectionalLight(scene);
  const shadowGenerator = setShadowGenerator(light, []); 

  // lensflare
  const lensFlare = setLensFlareSystem(scene, light);
  
  // scene.registerBeforeRender(() => {});
  // scene.beforeRender = () => { console.log('beforeRender'); }
  // scene.afterRender = () => { console.log('afterRender'); }
  
  return scene;
};
