import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import  { StandardMaterial, Texture, Color3, Material } from '@babylonjs/core';
import "@babylonjs/core/Meshes/meshBuilder";


import { 
  setArcCamera,
  setEnvironment,
  setMirror,
  loadMesh,
  findMesh,
  setRandomTexture,
} from "../utils/babylon-utils";
import Spaceship from "../components/spaceship/Spaceship";
import { getRandomKeyValue, getRandomInt } from "../utils/math";

export const loaderScene2 = (canvas, engine) => {
  // scene
  var scene = new Scene(engine);

  // environment
  const env = setEnvironment(scene)
  const  { shadowGenerator } = env;

  // camera
  const camera = setArcCamera(canvas, scene);
  // camera.fov = 0.3;


  const initSpaceships = () => {
    const initSpaceship = (scene: Scene, name: String, pos: Vector3) : Spaceship => {
      // note: get the actual mesh object, which in this case is inside a unity empty gameObject
      const mesh = findMesh(scene, name).getChildren()[0];
      const spaceship = new Spaceship(name, scene, true, { mesh });
      spaceship.position = pos;

      return spaceship;
    }

    const d = 4
    const y = 2;

    return {
      droid: initSpaceship(scene, 'DroidFighter', new Vector3(-d * 3, y, 0)),
      speedy: initSpaceship(scene, 'SpeedFighter', new Vector3(-d, 5, 0)),
      shark: initSpaceship(scene, 'SharkFighter', new Vector3(d, y, 0)),
      star: initSpaceship(scene, 'StarFighter', new Vector3(d * 3, y, 0)),
    }
  }


  const initGround = () => {
    const size = 128;
    // random texture for both ground and mirror
    const texture = setRandomTexture(scene);

    // mirror
    const mirror = setMirror(scene, {
      name: 'mirror',
      size: size,
      mirrorSize: 512,
      position: new Vector3(0, 0.001, 0),
      direction: new Vector3(0, -1, 0),
      distance: 0,
      level: 0.4,
      color: new Color3(0.8, 0.8, 0.8), 
      texture: texture,
      meshes: [env.skybox], // scene.meshes,
    })


    // ground cube
    var ground = Mesh.CreateBox("ground", 1, scene, false);
    ground.position = new Vector3(0, -0.5, 0);
    ground.scaling = new Vector3(size, 1, size);
    ground.material = new StandardMaterial('material', scene);
    (<StandardMaterial>ground.material).diffuseTexture = texture;
    ground.receiveShadows = true;

    // shadowGenerator.getShadowMap().renderList = scene.meshes; // .push(mesh)
    return { mesh: ground, material: ground.material, texture, mirror }
  }


  // spaceships
  loadMesh(scene, 'assets/meshes/babylon/spaceships/', 'spaceships.babylon' , (result, error) => {
    // console.log(result)

    const spaceships = initSpaceships();
    const ground = initGround();

    // add spaceship meshes to shadowmap and mirror
    result.loadedMeshes.map(mesh => {
      shadowGenerator.getShadowMap().renderList.push(mesh)
      ground.mirror.texture.renderList.push(mesh);
    });

  });

  return scene;
};