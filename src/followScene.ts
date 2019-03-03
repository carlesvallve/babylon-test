import * as BABYLON from '@babylonjs/core/Legacy/legacy';


export const followScene = (canvas, engine) => {

  // This creates a basic Babylon Scene object (non-mesh)
  var scene = new BABYLON.Scene(engine);

  /********** FOLLOW CAMERA EXAMPLE **************************/

  // This creates and initially positions a follow camera 	
  var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 10, -10), scene);

  //The goal distance of camera from target
  camera.radius = 30;

  // The goal height of camera above local origin (centre) of target
  camera.heightOffset = 10;

  // The goal rotation of camera around local origin (centre) of target in x y plane
  camera.rotationOffset = 0;

  //Acceleration of camera in moving from current to goal position
  camera.cameraAcceleration = 0.005

  //The speed at which acceleration is halted 
  camera.maxCameraSpeed = 10

  //camera.target is set after the target's creation

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  /**************************************************************/

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  //Material
  var mat = new BABYLON.StandardMaterial("mat1", scene);
  mat.alpha = 1.0;
  mat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1.0);
  var texture = new BABYLON.Texture("http://jerome.bousquie.fr/BJS/images/spriteAtlas.png", scene);
  mat.diffuseTexture = texture;

  //Different face for each side of box to show camera rotation
  var hSpriteNb =  6;  // 6 sprites per row
  var vSpriteNb =  4;  // 4 sprite rows	

  var faceUV = new Array(6);

  for (var i = 0; i < 6; i++) {
    faceUV[i] = new BABYLON.Vector4(i/hSpriteNb, 0, (i+1)/hSpriteNb, 1 / vSpriteNb);
  }

  // Shape to follow
  var box = BABYLON.MeshBuilder.CreateBox("box", {size: 2, faceUV: faceUV }, scene);
  box.position = new BABYLON.Vector3(20, 0, 10);
  box.material = mat;

  //create solid particle system of stationery grey boxes to show movement of box and camera
  var boxesSPS = new BABYLON.SolidParticleSystem("boxes", scene, {updatable: false});

  //function to position of grey boxes
  var set_boxes = function(particle, i, s) {
      particle.position = new BABYLON.Vector3(-50 + Math.random()*100, -50 + Math.random()*100, -50 + Math.random()*100); 
  }

  //add 400 boxes
  boxesSPS.addShape(box, 400, {positionFunction:set_boxes});  
  var boxes = boxesSPS.buildMesh(); // mesh of boxes

  /*****************SET TARGET FOR CAMERA************************/ 
  camera.lockedTarget = box;
  /**************************************************************/


  //box movement variables
  var alpha = 0;
  var orbit_radius = 20


  //Move the box to see that the camera follows it 	
  scene.registerBeforeRender(function () {
    alpha +=0.01;
  box.position.x = orbit_radius*Math.cos(alpha);
  box.position.y = orbit_radius*Math.sin(alpha);
  box.position.z = 10*Math.sin(2*alpha);

  //change the viewing angle of the camera as it follows the box
  camera.rotationOffset = (18*alpha)%360;
  });

  return scene;
};