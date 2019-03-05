import { TransformNode, Vector3, Color3 } from "@babylonjs/core";
import { randomColor3, randomColor4 } from "../../utils/colors";

export default class Spaceship extends TransformNode {
  mesh;
  constructor(name, scene, isPure, props) {
    super(name, scene, isPure)
    this.initMesh(props.mesh);
  }

  initMesh(mesh) {
    this.mesh = mesh;
    this.mesh.setParent(this);
    this.mesh.position = Vector3.Zero();

    const cube = this.mesh.getChildren()[0];

    const m = cube.material;
    m.emissiveColor = this._scene.ambientColor; // randomColor();
    m.diffuseColor = randomColor3(); 
  }

  init() {

  }
}