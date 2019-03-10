import { TransformNode, Vector3, StandardMaterial, Axis, Space, MeshBuilder } from "@babylonjs/core";
import { addToEnvironmentEffects } from "../../utils/environment";
import { radians } from "../../utils/math";


export default class Laser extends TransformNode {
  scene;
  spaceship;
  color;
  delta;
  vel;
  range;

  constructor(name, spaceship, props) {
    super(name, spaceship.scene);

    this.scene = spaceship.scene;
    this.spaceship = spaceship;

    this.color = props.color;
    this.delta = props.delta;
    
    this.rotation.y = props.rot;

    this.position = spaceship.position;
    this.translate(Axis.X, props.pos.x, Space.LOCAL);
    this.translate(Axis.Y, props.pos.y, Space.LOCAL);
    this.translate(Axis.Z, props.pos.z, Space.LOCAL);
    
    this.initVars();

    this.initMesh();
    addToEnvironmentEffects(this.scene, this);

    this.scene.registerBeforeRender(
      this.update.bind(this)
    );
  }

  initVars() {
    this.vel = 10;
    this.range = 50;
  }

  initMesh() {
    const mesh = MeshBuilder.CreateCylinder(
      "laser-mesh", { diameter: 0.25, tessellation: 10, height: 1 }, this.scene
    );

    mesh.setParent(this);
    mesh.isVisible = true;
    mesh.receiveShadows = false;
    mesh.isPickable = false;

    mesh.position = new Vector3(0, 1, 0);
    mesh.rotation = new Vector3(radians(90), 0, 0);

    mesh.material = new StandardMaterial('laser-material', this.scene);
    // (<StandardMaterial>mesh.material).diffuseColor = this.color; 
    (<StandardMaterial>mesh.material).emissiveColor = this.color;   
  }

  update() {
    this.translate(Axis.Z, this.vel * this.delta, Space.LOCAL);

    const distance = Vector3.Distance(this.position, this.spaceship.position);
    if (distance > this.range) {
      this.scene.unregisterBeforeRender(this.update);
      this.dispose();
    }

  }


}