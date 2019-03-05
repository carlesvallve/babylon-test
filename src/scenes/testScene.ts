import { Scene } from "@babylonjs/core/scene";
import { Vector3, Color3 } from "@babylonjs/core/Maths/math";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { SimpleMaterial } from "@babylonjs/materials/simple";

// Required side effects to populate the Create methods on the mesh class. Without this, the bundle would be smaller but the createXXX methods from mesh would not be accessible.
import "@babylonjs/core/Meshes/meshBuilder";

// utils
import { 
  setArcCamera,
  setAmbientLight,
  setDirectionalLight,
  setShadowGenerator,
  setLensFlareSystem,
} from "../utils/babylon-utils";

export const testScene = (canvas, engine) => {
  // scene
  var scene = new Scene(engine);

  // camera
  const camera = setArcCamera(canvas, scene);
  // camera.fov = 0.3;

  // materials
  const material = new SimpleMaterial("material", scene);
  material.diffuseColor = new Color3(0.5, 0.5, 1);

  // box
  var box = Mesh.CreateBox("box", 1, scene, false);
  box.position = new Vector3(0, 1.5, 0);
  box.scaling = new Vector3(1, 3, 1);
  box.material = material;

  // ground
  var ground = Mesh.CreateBox("ground", 1, scene, false);
  ground.position = new Vector3(0, -0.25, 0);
  ground.scaling = new Vector3(9, 0.5, 9);
  ground.material = material;
  ground.receiveShadows = true;

  // lights and shadows
  const ambient = setAmbientLight(scene);
  const light = setDirectionalLight(scene);
  const shadowGenerator = setShadowGenerator(light, [box]); 

  // lensflare
  const lensFlare = setLensFlareSystem(scene, light);
  
  // scene.registerBeforeRender(() => {});
  // scene.beforeRender = () => { console.log('beforeRender'); }
  // scene.afterRender = () => { console.log('afterRender'); }
  
  return scene;
};
