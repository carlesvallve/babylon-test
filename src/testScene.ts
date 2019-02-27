import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3, Color3 } from "@babylonjs/core/Maths/math";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { ArcRotateCamera } from "@babylonjs/core";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
// import { ShadowGeneratorSceneComponent } from "@babylonjs/core/Lights/Shadows/ShadowGeneratorSceneComponent";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/";

import { Mesh } from "@babylonjs/core/Meshes/mesh";
// import { GridMaterial } from "@babylonjs/materials/grid";
import { SimpleMaterial } from "@babylonjs/materials/simple";

// Required side effects to populate the Create methods on the mesh class. Without this, the bundle would be smaller but the createXXX methods from mesh would not be accessible.
import "@babylonjs/core/Meshes/meshBuilder";
// const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
// const engine = new Engine(canvas);

export const testScene = (canvas, engine) => {

    // Create our first scene.
    var scene = new Scene(engine);
    // scene.debugLayer.show();

    // Creates, angles, distances and targets the camera
    const camera = new ArcRotateCamera("Camera", 0, 0, 10, new Vector3(0, 0, 0), scene)
    camera.setPosition(new Vector3(0, 0, -10));
    camera.attachControl(canvas, true);

    // This creates and positions a free camera (non-mesh)
    // var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
    // camera.setTarget(Vector3.Zero());
    // camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var hlight = new HemisphericLight("light1", new Vector3(0, 1, ), scene);

    // Default intensity is 1. Let's dim the light a small amount
    hlight.intensity = 0.3;

    var dlight = new DirectionalLight('dlight', new Vector3(-350, -250, -150), scene)
    dlight.intensity = 0.6;
    dlight

    var material = new SimpleMaterial("material", scene);
    material.diffuseColor = new Color3(0.5, 0.5, 1);

    // Create a grid material
    // var material = new GridMaterial("grid", scene);
    // material.mainColor = new Color3(0.5, 0.5, 0.5);

    // var box00 = Mesh.CreateBox("*box00", 1, scene, false);
    // box00.position = new Vector3(0, 1, 0);
    // box00.scaling = new Vector3(1, 2, 1);
    // box00.material = material;

    // var box00 = Mesh.CreateCylinder("cone", {diameterTop: 0, tessellation: 4}, scene);
    var box00 = Mesh.CreateCylinder("*box00", 2, 1, 1, 20, 20, scene);

    box00.position = new Vector3(0, 1, 0);
    box00.scaling = new Vector3(1, 1, 1);
    box00.material = material;

    // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    // var sphere = Mesh.CreateSphere("sphere1", 16, 2, scene);
    // sphere.position.y = 0.5;
    // sphere.material = material;

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = Mesh.CreateGround("ground1", 9, 9, 2, scene);

    // Affect a material
    ground.material = material;

    // Shadows
    var shadowGenerator = new ShadowGenerator(320, dlight); // 
    shadowGenerator.getShadowMap().renderList.push(box00);
    // addShadowCaster(mesh, includeDescendants): Helper function to add a mesh and its descendants to the list of shadow casters
    // removeShadowCaster(mesh, includeDescendants): Helper function to remove a mesh and its descendants from the list of shadow casters

    // shadowGenerator.useContactHardeningShadow = true;
    // shadowGenerator.contactHardeningLightSizeUVRatio = 0.0075;
        
    // shadowGenerator.getShadowMap().renderList.push(skull);
    // shadowGenerator.useBlurCloseExponentialShadowMap = true;
    // shadowGenerator.forceBackFacesOnly = true;
    // shadowGenerator.blurKernel = 32;
    // shadowGenerator.useKernelBlur = true;

    ground.receiveShadows = true; 
    box00.receiveShadows = true;        
    
    return scene;
  };