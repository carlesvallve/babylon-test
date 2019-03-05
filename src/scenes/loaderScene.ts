import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import  { StandardMaterial } from '@babylonjs/core'

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
  findMesh,
  setSkybox,
} from "../utils/babylon-utils";
import Spaceship from "../components/spaceship/Spaceship";
import { randomColor3, randomColor4 } from "../utils/colors";

export const loaderScene = (canvas, engine) => {
  // scene
  var scene = new Scene(engine);
  scene.clearColor = randomColor4(); // new Color4(1, 0, 0, 0.5)
  scene.ambientColor = randomColor3() // new Color3(1, 0, 0)

  // skybox
  const skybox = setSkybox(scene);
  
  // camera
  const camera = setArcCamera(canvas, scene);
  // camera.fov = 0.3;

  // materials
  const material = new StandardMaterial('material', scene)
  material.emissiveColor = randomColor3();
  material.diffuseColor = randomColor3(); // new Color3(0.05, 0.05, 0.05);

  // spaceships
  loadMesh(scene, 'assets/meshes/babylon/spaceships/', 'spaceships.babylon' , (result, error) => {
    // console.log(result)
    result.loadedMeshes.map(mesh => shadowGenerator.getShadowMap().renderList.push(mesh));

    const initSpaceship = (scene: Scene, name: String, pos: Vector3) : void => {
      const mesh = findMesh(scene, name); // getMeshByName(scene, "StarFighter");
      const spaceship = new Spaceship(name, scene, true, { mesh });
      spaceship.position = pos; //new Vector3(0, 10, 10);
      shadowGenerator.getShadowMap().renderList.push(mesh);
    }

    const d = 4
    const droid = initSpaceship(scene, 'DroidFighter', new Vector3(-d * 3, 2, 0));
    const speedy= initSpaceship(scene, 'SpeedFighter', new Vector3(-d, 2, 0));
    const shark = initSpaceship(scene, 'SharkFighter', new Vector3(d, 2, 0));
    const star = initSpaceship(scene, 'StarFighter', new Vector3(d * 3, 2, 0));
  });

  // ground
  var ground = Mesh.CreateBox("ground", 1, scene, false);
  ground.position = new Vector3(0, -0.25, 0);
  ground.scaling = new Vector3(50, 0.5, 50);
  ground.material = material;
  ground.receiveShadows = true;

  // lights and shadows
  // const ambient = setAmbientLight(scene);
  const shadowLight = setDirectionalLight(scene, 
    { intensity: 0.5, pos: new Vector3(0, 50, -0), dir: new Vector3(0, -1, 0) }
  );
  const light = setDirectionalLight(scene,
    { intensity: 5, pos: new Vector3(-50, 50, -0), dir: new Vector3(-40, 30, -40) }
  );
  
  const shadowGenerator = setShadowGenerator(shadowLight, []); 
  
  return scene;
};