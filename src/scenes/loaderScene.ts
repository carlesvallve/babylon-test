import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import  { StandardMaterial, Color3 } from '@babylonjs/core';
import  { PointerEventTypes, VirtualJoystick, ActionManager, ExecuteCodeAction } from '@babylonjs/core';
// import "@babylonjs/core/Meshes/meshBuilder";

// camera
import { setArcCamera, animateCameraTo, } from '../utils/camera';

// environment
import { setEnvironment, setMirror, } from "../utils/environment";

// meshes
import { loadMesh, findMesh, setTexture, getFileName, } from "../utils/meshes";

// spaceships
import Spaceship from "../components/spaceship/Spaceship";


export default class LoaderScene extends Scene {
  env;
  camera;
  ground;
  spaceships;
  selected;
  vj;

  constructor(canvas, engine, options) {
    super(engine, options);
    
    this.camera = this.setCamera(canvas);
    this.env = this.setEnvironment();
    this.ground = this.initGround();

    this.loadContent();

    // this.setJoystick();
    this.setKeyboard();

  }

  setKeyboard() {
    var map = {}; //object for multiple key presses
    this.actionManager = new ActionManager(this);
  
    this.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
        map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
  
    }));
  
    this.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
        map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));

    this.registerAfterRender(() => {
      const ship = this.selected;
      if (!ship) { return; }

      // todo: make this better, maybe passing map to the spaceship
      let keyStatus = '';
      if ((map["w"] || map["W"])) { keyStatus = 'up'; };
      if ((map["s"] || map["S"])) { keyStatus = 'down'; };
      if ((map["a"] || map["A"])) { keyStatus = 'left'; };
      if ((map["d"] || map["D"])) { keyStatus = 'right'; };

      // update ship control
      ship.control(keyStatus);

      // update ship camera
      this.cameraFollow(ship, false);
    });
  }

  cameraFollow(ship, animated) {
    const camera = this.camera;
    let p: Vector3;

    if (animated) {
      const d = 0.5;
      p = new Vector3(
        camera.position.x + (ship.position.x - camera.position.x) * d,
        camera.position.y + (ship.position.y - camera.position.y) * d,
        camera.position.z + (ship.position.z - camera.position.z) * d,
      )
    } else {
      p = ship.position;
    }

    camera.setTarget(p);
    camera.update();
  }

  setJoystick() {
    // this.joyL = new VirtualJoystick(true);
    const vj = new VirtualJoystick(false);

    /**
    * Change the color of the virtual joystick
    * @param newColor a string that must be a CSS color value (like "red") or the hexa value (like "#FF0000")
    */
   vj.setJoystickColor ('#ff0000');
   /**
    * Defines a callback to call when the joystick is touched
    * @param action defines the callback
    */
   vj.setActionOnTouch(() => {
     console.log('setActionOnTouch');
   });

   console.log(vj)
  }


  setEnvironment() {
    return setEnvironment(this, this.camera)
  }


  setCamera(canvas) {
    const camera = setArcCamera(canvas, this);
    return camera;
  }

  initGround() {
    const size = 128;
    // random texture for both ground and mirror
    const texture = setTexture(this, 'stone-1');

    const bumpTexture = setTexture(this, `${getFileName(texture.url)}-normal`, { x: texture.vScale, y: texture.uScale })
    
    // mirror
    let mirror = null;
    mirror = setMirror(this, {
      name: 'mirror',
      size: size,
      mirrorSize: 512,
      position: new Vector3(0, 0.01, 0),
      direction: new Vector3(0, -1, 0),
      distance: 0,
      level: 0.5,
      color: new Color3(0.5, 0.5, 0.5),
      texture: texture,
      meshes: [this.env.skybox], // this.meshes
    });

    // ground cube
    var ground = Mesh.CreateBox("ground", 1, this, false);
    ground.position = new Vector3(0, -0.5, 0);
    ground.scaling = new Vector3(size, 1, size);
    ground.material = new StandardMaterial('material', this);
    // (<StandardMaterial>ground.material).diffuseColor = new Color3(0.3, 0.3, 0.3);
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

      this.initSpaceships();
      this.initPicker()
    });
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
    this.selected = selected;
  }

  initPicker() {
    this.onPointerObservable.add((e) => {
      if (e.pickInfo.hit && e.pickInfo.pickedMesh && e.event.button === 0) {
        this.selectSpaceship(e.pickInfo.pickedMesh.parent);
      }
    }, PointerEventTypes.POINTERUP); 
  }
  
}
