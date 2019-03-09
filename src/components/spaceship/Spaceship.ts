import { TransformNode, Vector3, Color3, Mesh } from "@babylonjs/core";
import { randomColor3, randomColor4 } from "../../utils/colors";
import { spaceshipParticles } from "../../utils/particles";
import { addToEnvironmentEffects } from "../../utils/babylon-utils";

export default class Spaceship extends TransformNode {
  scene;
  mesh;
  material;
  thrusters;

  constructor(name, scene, isPure, props) {
    super(name, scene, isPure);
    this.scene = scene;

    this.initMesh(props.mesh);
    this.initMaterial();
    this.initParticles();
    addToEnvironmentEffects(this.scene, this);
  }

  initMesh(mesh) {
    this.mesh = mesh; // gameObject.getChildren()[0];
    this.mesh.setParent(this);
    this.mesh.position = Vector3.Zero();   
  }

  initMaterial() {
    this.material = this.mesh.material;
    const c = randomColor3();
    this.material.diffuseColor = c; //randomColor3(); 
    this.material.specularColor = new Color3(0.8, 0.8, 0.8); //randomColor3();
    // this.material.emissiveColor = c; // randomColor3() 
  }

  initParticles() {
    this.thrusters = [];
    spaceshipData[this.name].thrusters.map((thruster, index) => {
      const emitter = Mesh.CreateBox(`thruster${index}`, 0.1, this.scene);
      emitter.setParent(this);
      emitter.isVisible = false;
      const particleSystem = spaceshipParticles(this.scene, emitter, thruster);
      this.thrusters.push({ emitter, particleSystem });
    })
  }

  init() {

  }
}


export const spaceshipData = {
  DroidFighter: {
    thrusters: [
      { min: new Vector3(-0.4, -0.1, -2.7), max: new Vector3(0.4, 0.1, -2.7), }
    ]
  },
  SpeedFighter: {
    thrusters: [
      { min: new Vector3(-1.25 -0.075, 0.275, -1.4), max: new Vector3(-1.25 + 0.075, 0.325, -1.4), },
      { min: new Vector3(1.25 -0.075, 0.275, -1.4), max: new Vector3(1.25 + 0.075, 0.325, -1.4), }
    ]
  },
  SharkFighter: {
    thrusters: [
      { min: new Vector3(-0.2, -0.2, -2.1), max: new Vector3(0.2, 0.2, -2.1), }
    ]
  },
  StarFighter: {
    thrusters: [
      { min: new Vector3(-0.7 -0.15, 0.125, -1.7), max: new Vector3(-0.7 + 0.15, 0.375, -1.7), },
      { min: new Vector3(0.7 -0.15, 0.125, -1.7), max: new Vector3(0.7 + 0.15, 0.375, -1.7), }
    ]
  }
};
