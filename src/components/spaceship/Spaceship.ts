import { TransformNode, Vector3, Color3 } from "@babylonjs/core";
import { randomColor3, randomColor4 } from "../../utils/colors";

export default class Spaceship extends TransformNode {
  gameObject;
  mesh;
  material;

  constructor(name, scene, isPure, props) {
    super(name, scene, isPure)
    this.initMesh(props.mesh);
  }

  initMesh(mesh) {
    // this.mesh = mesh;
    // this.mesh.setParent(this);
    // this.mesh.position = Vector3.Zero();

    this.mesh = mesh; // gameObject.getChildren()[0];
    this.mesh.setParent(this);
    this.mesh.position = Vector3.Zero();
    this.material = this.mesh.material;
    this.material.diffuseColor = randomColor3(); 
    this.material.specularColor = randomColor3(); // new Color3(0.6, 0.6, 0.6);
  }

  initMaterial() {
    const cube = this.mesh.getChildren()[0];
    this.material = cube.material;
    // this.material.emissiveColor = this._scene.ambientColor; // randomColor();
    // this.material.diffuseColor = randomColor3(); 
  }

  init() {

  }
}