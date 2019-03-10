import { TransformNode, Vector3, Color3, Mesh, PowerEase, Axis, Space } from "@babylonjs/core";
import { randomColor3, randomColor4 } from "../../utils/colors";
import { spaceshipParticles } from "../../utils/particles";
import { addToEnvironmentEffects } from "../../utils/environment";
import { radians } from "../../utils/math";

export default class Spaceship extends TransformNode {
  scene;
  mesh;
  material;
  thrusters;

  // basic
  vel = { x: 0, y: 0, rot: 0 };
  acc = { x: 0, y: 0, rot: 0 };
  rot = 0;
  
  traction;
  friction;
  powerRot;

  power;
  powerPlus;
  powerMinus
  powerMax;
  


  constructor(name, scene, isPure, props) {
    super(name, scene, isPure);
    this.scene = scene;

    this.initMesh(props.mesh);
    this.initMaterial();
    this.initParticles();
    addToEnvironmentEffects(this.scene, this);

    this.vel = { x: 0, y: 0, rot: 0 };
    this.acc = { x: 0, y: 0, rot: 0 };
    this.rot = 0;
    
    this.friction = 0.998;
    this.traction = 2;
    this.powerRot = 35;

    this.power = 0;
    this.powerPlus = 0.1;
    this.powerMinus = 0.1;
    this.powerMax = 1;

    this.scene.registerBeforeRender(() => {
      // delta allows us to speedup or slowdown our movements
      this.move(0.1); 
    });
  }

  // ==================================================

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
      emitter.isVisible = true;
      const particleSystem = spaceshipParticles(this.scene, emitter, thruster);
      this.thrusters.push({ emitter, particleSystem });
    })
  }

  // ==================================================

  control(keyStatus) {
    // rotate
    if (keyStatus === 'left') {
      this.vel.rot = -this.powerRot; // -6;
    } else if (keyStatus === 'right') {
      this.vel.rot = this.powerRot; // 6;
    } else {
      this.vel.rot = 0;
    }

    // accelerate / break
    let friction = this.friction;
    if (keyStatus === 'up') {
      // increase power
      this.power += this.powerPlus;
      if (this.power >= this.powerMax) { this.power = this.powerMax; }
    } else if (keyStatus === 'down') {
      // decrease power
      this.power -= this.powerMinus;
      if (this.power <= 0) { this.power = 0; }
      // increase friction
      friction *= (1 - this.powerMinus * 0.5);
    } 

    // apply acceleration
    var rad = ((this.rot-90) * Math.PI)/180;
    this.acc.x = this.power * Math.cos(rad);
    this.acc.y = this.power * Math.sin(rad);

    // apply friction
    this.vel.x *= friction;
    this.vel.y *= friction;
  }

  move(delta) {
    // apply rotation
    this.rot += this.vel.rot * delta;
    if (this.rot > 360) {
      this.rot -= 360;
    } else if (this.rot < 0) {
      this.rot += 360;
    }
    this.rotation.y = radians(this.rot);

    // apply velocity
    this.vel.x += this.acc.x * delta;
    this.vel.y += this.acc.y * delta;
    this.position.x += this.vel.x * delta;
    this.position.z -= this.vel.y * delta;

    // apply traction (force move into current direction)
    this.translate(Axis.Z, this.power * this.traction * delta, Space.LOCAL);
  }

}

// ==================================================

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
