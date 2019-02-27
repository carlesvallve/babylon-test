import * as BABYLON from '@babylonjs/core/Legacy/legacy';

// You have to create a function called createScene. This function must return a BABYLON.Scene object
// You can reference the following variables: scene, canvas
// You must at least define a camera
// More info here: https://doc.babylonjs.com/generals/The_Playground_Tutorial

export const sunScene = (canvas, engine) => {
	var scene = new BABYLON.Scene(engine);
	var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 10, new BABYLON.Vector3(0,0,-40), scene);
	camera.setPosition(new BABYLON.Vector3(0, 80,-180))
	camera.attachControl(canvas);
	camera.minZ = 20;
	
	let sun_angle = 0;
	var sun = BABYLON.Mesh.CreateSphere("sphere", 40.0, 10.0, scene, false,  BABYLON.Mesh.DOUBLESIDE);
  // sun.position = new BABYLON.Vector3(-20,0,-5);
  sun.position = new BABYLON.Vector3(-20 * 0.1,0,-5 * 0.1);
	sun.isVisible = true;
    
	var light0 = new BABYLON.PointLight("Omni0", sun.position, scene);
	light0.diffuse = new BABYLON.Color3(1, 1, 1);
	light0.specular = new BABYLON.Color3(1, 1, 1);
	light0.intensity = 1.0;
	light0.parent = sun;
	
	var plane = BABYLON.Mesh.CreateGround("ground1", 100, 100, 2, scene);
	plane.position.y = -5;
	
	var pbrPlane = new BABYLON.PBRMaterial("pbr", scene);
	plane.material = pbrPlane;
	pbrPlane.usePhysicalLightFalloff = false;
	
	pbrPlane.albedoColor = BABYLON.Color3.White();	
	pbrPlane.reflectionColor = BABYLON.Color3.Black();	
	pbrPlane.reflectivityColor = BABYLON.Color3.Black();
	
	var wall_1 = BABYLON.Mesh.CreateBox("box",1.0,scene,false,BABYLON.Mesh.DEFAULTSIDE);
	wall_1.rotation.y = Math.PI/2;
	wall_1.scaling = new BABYLON.Vector3(30,8,1);
	
	var wall_2 = BABYLON.Mesh.CreateBox("box",1.0,scene,false,BABYLON.Mesh.DEFAULTSIDE);
	wall_2.position.x = 10;
	wall_2.position.z = 15;
	wall_2.scaling = new BABYLON.Vector3(30,8,1);
	
	var box = BABYLON.Mesh.CreateBox("b",4,scene);
	box.position.x = 5;
	const material = new BABYLON.StandardMaterial("f",scene);
	material.diffuseColor = new BABYLON.Color3(0.5,0.1,0.0);
	box.material = material;
	
	var animationScat_1 = new BABYLON.Animation("myAnimation", "rotation.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
	var keys = []; 
	for (var i = 0;i<100;i++){
		keys.push({frame:i,
		value:i/32
		});
	}
	animationScat_1.setKeys(keys);
	box.animations.push(animationScat_1);
	scene.beginAnimation(box, 0, 100, true);
	
	var shadowGenerator = new BABYLON.ShadowGenerator(1024, light0);
	shadowGenerator.getShadowMap().renderList.push(box);
	
	// if I add to the render list the walls, it doesn't work better
	//shadowGenerator.getShadowMap().renderList.push(wall_1);
	//shadowGenerator.getShadowMap().renderList.push(wall_2);
	
	plane.receiveShadows = true;
	box.receiveShadows = true;
	wall_1.receiveShadows = true;
	wall_2.receiveShadows = true;
	// engine.runRenderLoop(function(){
	// 	scene.render();
  //   });
	
	scene.afterRender = function(){
	sun_angle+=0.002;
	sun.position.x = 150/3*Math.cos(sun_angle);
	sun.position.y = 150/3*Math.sin(sun_angle);
	}

	return scene;
};