import * as BABYLON from '@babylonjs/core/Legacy/legacy';

// const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
// const engine = new BABYLON.Engine(canvas);

export const shadowScene = (canvas, engine) => {

  var scene = new BABYLON.Scene(engine);
      var camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 10, -20), scene);
      camera.setTarget(BABYLON.Vector3.Zero())
      camera.attachControl(canvas, true);
  
      // Ground
      var ground01 = BABYLON.Mesh.CreateGround("Spotlight Hard Shadows", 24, 60, 1, scene, false);
      
      var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
      groundMaterial.diffuseTexture = new BABYLON.Texture("/textures/ground.jpg", scene);
      groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
      groundMaterial.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
  
      ground01.material = groundMaterial;
      ground01.receiveShadows = true;
    
    // Boxes
      var box00 = BABYLON.Mesh.CreateBox("*box00", 10, scene, false);
      box00.position = new BABYLON.Vector3(0, 5, 0);
      box00.scaling = new BABYLON.Vector3(0.1, 1, 0.1);
  
      var boxMaterial = new BABYLON.StandardMaterial("mat", scene);
      boxMaterial.diffuseColor = new BABYLON.Color3(1.0, 0, 0);
      boxMaterial.specularColor = new BABYLON.Color3(0.5, 0, 0);
      box00.material = boxMaterial;
  
      // Shadows
      var light00 = new BABYLON.SpotLight("*spot00", new BABYLON.Vector3(0, 20, 20), new BABYLON.Vector3(0, -1, -1), 1.2, 24, scene);
    light00.shadowMinZ = 15;
      light00.shadowMaxZ = 40; 
  
      var shadowGenerator00 = new BABYLON.ShadowGenerator(512, light00);
      shadowGenerator00.getShadowMap().renderList.push(box00);
      shadowGenerator00.useContactHardeningShadow = true;
      shadowGenerator00.contactHardeningLightSizeUVRatio = 0.0075;
        
      return scene;
  
  };