import { Scene } from "@babylonjs/core/scene";
import { Vector3, Size } from "@babylonjs/core/Maths/math";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import  { Texture, StandardMaterial, Color3, ArcRotateCamera, Tools, PointerEventTypes } from '@babylonjs/core';
import "@babylonjs/core/Meshes/meshBuilder";

// spaceships
import Spaceship from "../components/spaceship/Spaceship";

// utils
import { 
  setArcCamera,
  setEnvironment,
  setMirror,
  loadMesh,
  findMesh,
  setTexture,
  getFileName,
  animateCameraTo,
} from "../utils/babylon-utils";
import { getRandomItemsFromArr, getRandomVector3 } from "../utils/math";



export default class LoaderScene extends Scene {
  env;
  camera;
  ground;
  spaceships;
  selected;

  // initContent;

  constructor(canvas, engine, options) {
    super(engine, options);

    this.env = this.setEnvironment();
    this.camera = this.setCamera(canvas);
    this.ground = this.initGround();

    this.loadContent();
  }


  setEnvironment() {
    return setEnvironment(this)
  }

  setCamera(canvas) {
    const camera = setArcCamera(canvas, this);
    // camera.lowerAlphaLimit = 180;
    // camera.lowerBetaLimit = 180;

    // var cam_startZoom = 3, cam_minZoom = 1.5, cam_maxZoom = 25;
    // var cam_startRoll = -148, cam_lowerRollLimit = null, cam_upperRollLimit = null;
    // var cam_startPitch = 76, cam_lowerPitchLimit = 0.1, cam_upperPitchLimit = 180;			
    // var orbitalCamera = new ArcRotateCamera("CameraOrbit", (Math.PI * cam_startRoll / 180), (Math.PI * cam_startPitch / 180), cam_startZoom, new Vector3(0,0.3,0), this);
    // orbitalCamera.lowerRadiusLimit = cam_minZoom; orbitalCamera.upperRadiusLimit = cam_maxZoom; orbitalCamera.wheelPrecision = 150;
    // orbitalCamera.lowerBetaLimit = (Math.PI * cam_lowerPitchLimit / 180); orbitalCamera.upperBetaLimit = (Math.PI * cam_upperPitchLimit / 180);
    // orbitalCamera.lowerAlphaLimit = (Math.PI * cam_lowerRollLimit / 180); orbitalCamera.upperAlphaLimit = (Math.PI * cam_upperRollLimit / 180);
    // orbitalCamera.minZ = 0.6; orbitalCamera.maxZ = 10; orbitalCamera.fov = Tools.ToRadians(50);				

    return camera;
  }

  loadContent() {
    const path = 'assets/meshes/babylon/spaceships/';
    const fileName = 'spaceships.babylon';

    loadMesh(this, path, fileName, (result, error) => {
      if (error) {
        console.error('Something went wrong when loading content...');
        console.error(error.message);
        console.error(error.exception);
        return;
      }

      this.initContent(result);
      this.initPicker()
    });
  }

  initContent(result) {
    // initialize spaceships
    this.spaceships = this.initSpaceships();
    
    // add loaded meshes to shadowmap and mirror
    result.loadedMeshes.map(mesh => {
      if (this.env.shadowGenerator) {
        this.env.shadowGenerator.getShadowMap().renderList.push(mesh);
      }
      if (this.ground.mirror) {
        this.ground.mirror.texture.renderList.push(mesh);
      }
    });
  }

  initGround() {
    const size = 128;
    // random texture for both ground and mirror
    const texture = setTexture(this, 'scifi-1');
    console.log(texture);

    const bumpTexture = setTexture(this, `${getFileName(texture.url)}-normal`, { x: texture.vScale, y: texture.uScale })
    
    // mirror
    // const mirror = null;
    const mirror = setMirror(this, {
      name: 'mirror',
      size: size,
      mirrorSize: 512,
      position: new Vector3(0, 0.001, 0),
      direction: new Vector3(0, -1, 0),
      distance: 0,
      level: 0.3,
      color: new Color3(0.8, 0.8, 0.8),
      texture: texture,
      meshes: [this.env.skybox], // this.meshes
    });

    // ground cube
    var ground = Mesh.CreateBox("ground", 1, this, false);
    ground.position = new Vector3(0, -0.5, 0);
    ground.scaling = new Vector3(size, 1, size);
    ground.material = new StandardMaterial('material', this);
    (<StandardMaterial>ground.material).specularColor = new Color3(0.6, 0.6, 0.6);
    (<StandardMaterial>ground.material).diffuseTexture = texture;
    if (bumpTexture) { (<StandardMaterial>ground.material).bumpTexture = bumpTexture; }
    ground.receiveShadows = true;
    ground.isPickable = false;

    // const hmaps = ['brittania', 'heightmap1', 'heightmap2', 'heightMapTriPlanar', 'iceland', 'tamriel', 'uk'];
    // const fileName = getRandomItemsFromArr(hmaps, 1)[0];
    // console.log(fileName)
    // var map = Mesh.CreateGroundFromHeightMap("map", `assets/heightmaps/${fileName}.jpg`, size, size, size / 2, 0, 22, this, false,);
    // var mapMaterial = new StandardMaterial("mapMaterial", this);
    // // mapMaterial.diffuseTexture = new Texture("assets/textures/ground.jpg", this);
    // mapMaterial.diffuseTexture = texture; // setTexture(this);
    // mapMaterial.specularColor = new Color3( 1, 1, 1);
    // map.position.y = -2.05;
    // map.material = mapMaterial;

    return { mesh: ground, material: ground.material, texture, mirror };
  }

  initSpaceships() {
    const initSpaceship = (scene: Scene, name: String, pos: Vector3) : Spaceship => {
      // note: get the actual mesh object, which in this case is inside a unity empty gameObject
      const mesh = findMesh(scene, name).getChildren()[0];
      const spaceship = new Spaceship(name, scene, true, { mesh });
      spaceship.position = pos;

      return spaceship;
    }

    const d = 4;
    const y = 2;

    return {
      droid: initSpaceship(this, 'DroidFighter', new Vector3(-d * 3, y, 0)),
      speedy: initSpaceship(this, 'SpeedFighter', new Vector3(-d, 5, 0)),
      shark: initSpaceship(this, 'SharkFighter', new Vector3(d, y, 0)),
      star: initSpaceship(this, 'StarFighter', new Vector3(d * 3, y, 0)),
    }
  }

  selectSpaceship(selected) {
    const d = 32;
    const tpos = selected.getAbsolutePosition();
    animateCameraTo(
      this.camera,
      tpos,
      getRandomVector3(new Vector3(tpos.x-d, tpos.y+1, tpos.z-d), new Vector3(tpos.x+d, tpos.y+d, tpos.z+d)), 
      60, 60 * 2
    );
  }

  initPicker() {
    // let selected = null;

    this.onPointerObservable.add((e) => {
      if (e.pickInfo.hit && e.pickInfo.pickedMesh && e.event.button === 0) {
        console.log(e.pickInfo)
        this.selectSpaceship(e.pickInfo.pickedMesh);
      }
    }, PointerEventTypes.POINTERUP);
    
  }

  

}
