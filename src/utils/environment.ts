import { Vector3, Color3, Plane } from "@babylonjs/core/Maths/math";
import { Texture, MirrorTexture, StandardMaterial, Mesh, VolumetricLightScatteringPostProcess, GlowLayer, Scene } from "@babylonjs/core";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/";
import { LensFlareSystem, LensFlare } from "@babylonjs/core/LensFlares";
import { CubeTexture } from "@babylonjs/core/"
import { color3, Colors } from "./colors";


// =================================================
// Environment

export const setEnvironment = (
  scene,
  camera,
  options = {
    clearColor: color3(Colors.black),
    ambientColor: color3(Colors.darkgrey),
    fogOptions: { mode: Scene.FOGMODE_EXP, density: 0.01, color: color3(Colors.black) },
    glowOptions: { intensity: 2.5, color: color3(Colors.black) }
  }
) => {

  const { clearColor, ambientColor, fogOptions, glowOptions } = options;

  // scene
  scene.clearColor = clearColor;
  scene.ambientColor = ambientColor;

  // lights
  const alight = setAmbientLight(scene);
  const dlight = setDirectionalLight(scene,
    { intensity: 0.8, pos: new Vector3(-50, 50, -0), dir: new Vector3(-40, 30, -40) }
  );

  // shadows
  const shadowLight = setDirectionalLight(scene, 
    { intensity: 0.4, pos: new Vector3(0, 50, -0), dir: new Vector3(0, -1, 0) }
  );
  const shadowGenerator = setShadowGenerator(shadowLight);

  // skybox
  const skybox = setSkybox(scene);

  // lens flare
  const lensFlare = setLensFlareSystem(scene, dlight)

  // Fog
  let fog = null;
  if (fogOptions) {
    fog = setFog(scene, fogOptions);
  }

  // glow layer
  let glowLayer;
  if (glowOptions) {
    glowLayer = new GlowLayer("glow", scene, { mainTextureSamples: 1 });
    glowLayer.intensity = glowOptions.intensity; //0.6;
    glowLayer.neutralColor = glowOptions.color; // new Color4(0.5, 0.5, 0.5, 0.5);
  }
  
  return { alight, dlight, shadowLight, shadowGenerator, skybox, lensFlare, glowLayer, fog };
}

export const addToEnvironmentEffects = (scene, obj) => {
  obj.getChildMeshes(false).map((mesh) => {
    if (scene.env.glowLayer) { scene.env.glowLayer.addIncludedOnlyMesh(mesh); }
    if (scene.env.shadowGenerator) { scene.env.shadowGenerator.getShadowMap().renderList.push(mesh); }
    if (scene.ground.mirror) { scene.ground.mirror.texture.renderList.push(mesh); }
  })
}

// export const addToEnvironmentEffects = (scene, mesh) => {
//   if (scene.env.shadowGenerator) { scene.env.shadowGenerator.getShadowMap().renderList.push(mesh); }
//   if (scene.ground.mirror) { scene.ground.mirror.texture.renderList.push(mesh); }
// }

export const setFog = (scene, options = { mode: Scene.FOGMODE_NONE, density: 0.005, color: color3(Colors.black) }) => {
  const  { mode, density, color } = options;
  console.log(mode)
  scene.fogMode = mode; 
  scene.fogColor = color;
  scene.fogDensity = density;
  // Scene.FOGMODE_EXP;
  // Scene.FOGMODE_NONE;
  // Scene.FOGMODE_EXP;
  // Scene.FOGMODE_EXP2;
  // Scene.FOGMODE_LINEAR;
  // Only if LINEAR
  // scene.fogStart = 20.0;
  // scene.fogEnd = 60.0;
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

export const setGodRays = (
  engine, scene, camera, light, texture, options = {}) => {

  // Create the "God Rays" effect (volumetric light scattering)
	var godrays = new VolumetricLightScatteringPostProcess('godrays', 1.0, camera, null, 100, Texture.BILINEAR_SAMPLINGMODE, engine, false);

	// By default it uses a billboard to render the sun, just apply the desired texture
	// position and scale
	(<any>godrays.mesh.material).diffuseTexture = new Texture('textures/sun.png', scene, true, false, Texture.BILINEAR_SAMPLINGMODE);
	(<any>godrays.mesh.material).hasAlpha = true;
	godrays.mesh.position = new Vector3(-150, 150, 150);
	godrays.mesh.scaling = new Vector3(350, 350, 350);

	light.position = godrays.mesh.position;
}
  
  

export const setShadowGenerator = (light, meshArr = []) => {
  const shadowGenerator: ShadowGenerator = new ShadowGenerator(1024 /* size of shadow map */, light);
  
  // bias
  shadowGenerator.bias = 0.001;
  shadowGenerator.depthScale = 100; // 2500;

  // exponential
  shadowGenerator.useBlurExponentialShadowMap = true;
  
  // blurKernel
  // shadowGenerator.useKernelBlur = true;
  // shadowGenerator.blurKernel = 2; // 8; // 64;
  
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
  const skybox = scene.createDefaultSkybox(envTexture, true, 512);
  return skybox;
}


export const setLensFlareSystem = (scene, source) => {
  // To do so, you have to first create a LensFlareSystem:
  // The second parameter defines the source (the emitter) of the lens flares (it can be a camera, a light or a mesh).
  const lensFlareSystem = new LensFlareSystem("lensFlareSystem", source, scene);
  
  // Then, you can add flares to your system with the following code:
  const flare0 = new LensFlare(0.2, 0, new Color3(1, 1, 1), "assets/particles/lens5.png", lensFlareSystem);
  const flare1 = new LensFlare(0.5, 0.2, new Color3(0.5, 0.5, 1), "assets/particles/lens4.png", lensFlareSystem);
  const flare2 = new LensFlare(0.2, 1.0, new Color3(1, 1, 1), "assets/particles/lens4.png", lensFlareSystem);
  const flare3 = new LensFlare(0.4, 0.4, new Color3(1, 0.5, 1), "assets/particles/flare.png", lensFlareSystem);
  const flare4 = new LensFlare(0.1, 0.6, new Color3(1, 1, 1), "assets/particles/lens5.png", lensFlareSystem);
  const flare5 = new LensFlare(0.3, 0.8, new Color3(1, 1, 1), "assets/particles/lens4.png", lensFlareSystem);

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
  plane.isPickable = false;

  return { plane, material: mirrorMaterial, texture: mirrorTexture };
}

