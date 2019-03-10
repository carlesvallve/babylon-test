import { TransformNode, Vector3, Color3, Mesh, PowerEase, Axis, Space, StandardMaterial, Quaternion } from "@babylonjs/core";
import { randomColor3, randomColor4 } from "../../utils/colors";
import { spaceshipParticles } from "../../utils/particles";
import { addToEnvironmentEffects } from "../../utils/environment";
import { radians } from "../../utils/math";
import Laser from "./Laser";

export default class Spaceship extends TransformNode {
  scene;
  mesh;
  material;

  delta;
  color;
  
  vel;
  acc;
  rot;
  
  traction;
  friction;
  powerRot;

  power;
  powerPlus;
  powerMinus
  powerMax;
  break;


  constructor(name, scene, isPure, props) {
    super(name, scene, isPure);
    this.scene = scene;

    this.initVars();

    this.initMesh(props.mesh);
    this.initMaterial();
    this.initParticles();
    addToEnvironmentEffects(this.scene, this);

    this.scene.registerBeforeRender(() => {
      // delta allows us to speedup or slowdown our movements
      this.move(this.delta); 
    });
  }

  initVars() {
    this.delta = 0.075
    this.color = randomColor3();

    this.vel = { x: 0, y: 0, rot: 0 };
    this.acc = { x: 0, y: 0 };
    this.rot = 0;
    
    this.friction = 0.995; // 0.998;
    this.traction = 0.5;
    this.powerRot = 35;

    this.power = 0;
    this.powerPlus = 0.1;
    this.powerMinus = 0.2;
    this.powerMax = 1;
    this.break = 0.95;
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
    this.material.diffuseColor = c;
    this.material.specularColor = new Color3(0.8, 0.8, 0.8);
    // this.material.emissiveColor = c; 
  }

  initParticles() {
    const thrusters = [];
    spaceshipData[this.name].thrusters.map((thruster, index) => {
      const emitter = Mesh.CreateBox(`thruster${index}`, 0.1, this.scene);
      emitter.setParent(this);
      emitter.isVisible = true;
      const particleSystem = spaceshipParticles(this.scene, emitter, thruster, this.color);
      thrusters.push({ emitter, particleSystem });
    })
  }

  // ==================================================

  control(keyMap) {
    // rotate
    this.vel.rot = 0;
    if ((keyMap.a || keyMap.A)) { // left
      this.vel.rot = -this.powerRot;
    } else
    if ((keyMap.d || keyMap.D)) { // right
      this.vel.rot = this.powerRot;
    } 

    // accelerate
    if ((keyMap.w || keyMap.W)) {
      this.power += this.powerPlus;
      if (this.power >= this.powerMax) { this.power = this.powerMax; }
    } 

    // deaccelerate
    if ((keyMap.s || keyMap.S)) {
      this.power -= this.powerMinus;
      if (this.power <= 0) { this.power = 0; }
      this.vel.x *= this.break;
      this.vel.y *= this.break;   
    }

    if ((keyMap.space || keyMap.SPACE)) {
      this.shoot();
    }
  }

  move(delta) {
    // apply rotation
    this.rot += this.vel.rot * delta;
    if (this.rot > 360) { this.rot -= 360; }
    if (this.rot < 0) { this.rot += 360; }
    this.rotation.y = radians(this.rot);

    // apply acceleration
    var rad = ((this.rot-90) * Math.PI)/180;
    this.acc.x = this.power * Math.cos(rad);
    this.acc.y = this.power * Math.sin(rad);

    this.power *= this.friction;
    this.vel.x *= this.friction;
    this.vel.y *= this.friction;

    // apply velocity
    this.vel.x += this.acc.x * delta;
    this.vel.y += this.acc.y * delta;

    // apply friction
    this.vel.x *= this.friction;
    this.vel.y *= this.friction;

    // set position
    this.position.x += this.vel.x * delta;
    this.position.z -= this.vel.y * delta;

    // apply traction (force move into current direction at current velocity)
    const d = new Vector3(this.vel.x, 0, this.vel.y).length();
    this.translate(Axis.Z, d * this.traction * delta, Space.LOCAL);
  }

  shoot() {
    spaceshipData[this.name].lasers.map((pos, index) => {
      const laser = new Laser('laser', this, {
        delta: this.delta,
        pos: new Vector3(pos.x, pos.y, pos.z),
        rot: this.rotation.y,
        color: this.color,
      });
    });
  }

}

// ==================================================

export const spaceshipData = {
  DroidFighter: {
    thrusters: [
      { min: new Vector3(-0.4, -0.1, -2.7), max: new Vector3(0.4, 0.1, -2.7), }
    ],
    lasers: [
      { x: -2.85, y: -1.25, z: 1.85 }, { x: 2.85, y: -1.25, z: 1.85 }
    ]
  },
  SpeedFighter: {
    thrusters: [
      { min: new Vector3(-1.25 -0.075, 0.275, -1.4), max: new Vector3(-1.25 + 0.075, 0.325, -1.4), },
      { min: new Vector3(1.25 -0.075, 0.275, -1.4), max: new Vector3(1.25 + 0.075, 0.325, -1.4), }
    ],
    lasers: [
      { x: -1.2, y: -0.75, z: 0.5 }, { x: 1.2, y: -0.75, z: 0.5 }
    ]
  },
  SharkFighter: {
    thrusters: [
      { min: new Vector3(-0.2, -0.2, -2.1), max: new Vector3(0.2, 0.2, -2.1), }
    ],
    lasers: [
      { x: 0, y: -1.5, z: 3.25 }
    ]
  },
  StarFighter: {
    thrusters: [
      { min: new Vector3(-0.7 -0.15, 0.125, -1.7), max: new Vector3(-0.7 + 0.15, 0.375, -1.7), },
      { min: new Vector3(0.7 -0.15, 0.125, -1.7), max: new Vector3(0.7 + 0.15, 0.375, -1.7), }
    ],
    lasers: [
      { x: -0.1, y: -1.65, z: 3.5 }, { x: 0.1, y: -1.65, z: 3.5 }
    ]
  }
};
