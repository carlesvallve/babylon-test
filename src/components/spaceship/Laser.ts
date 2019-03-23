import { TransformNode, Vector3, StandardMaterial, Axis, Space, MeshBuilder, Color4, ParticleSystem, Texture, AbstractMesh } from "@babylonjs/core";
import { addToEnvironmentEffects } from "../../utils/environment";
import { radians } from "../../utils/math";
import { laserExplosionParticles } from "../../utils/particles";


export default class Laser extends AbstractMesh {
  scene;
  spaceship;
  color;
  delta;
  vel;
  range;

  mesh;
  exploding;

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
    this.translate(Axis.Z, props.pos.z -  0.6, Space.LOCAL);
    
    this.initVars();

    this.mesh = this.initMesh();
    addToEnvironmentEffects(this.scene, this);

    this.scene.registerBeforeRender(
      this.update.bind(this)
    );
  }

  initVars() {
    this.vel = 20;
    this.range = 100;
    this.exploding = false;
  }

  initMesh() {
    const mesh = MeshBuilder.CreateCylinder(
      "laser-mesh", { diameter: 0.25, tessellation: 10, height: 1 }, this.scene
    );

    mesh.setParent(this);
    mesh.isVisible = true;
    mesh.receiveShadows = false;
    mesh.isPickable = false;

    mesh.position = new Vector3(0, 0, 0);
    mesh.rotation = new Vector3(radians(90), 0, 0);

    mesh.material = new StandardMaterial('laser-material', this.scene);
    // (<StandardMaterial>mesh.material).diffuseColor = this.color; 
    (<StandardMaterial>mesh.material).emissiveColor = this.color;  
    
    return mesh;
  }

  update() {
    if (this.exploding) {
      return;
    }

    this.translate(Axis.Z, this.vel * this.delta, Space.LOCAL);

    const distance = Vector3.Distance(this.position, this.spaceship.position);
    if (distance > this.range) {
      this.destroy();
      return;
    }

    const h = this.scene.ground.mesh.getHeightAtCoordinates(this.position.x, this.position.z);
    if ( h > this.position.y) {
      this.explode();
      return;
    }
  }

  explode () {
    this.exploding = true;
    this.mesh.visible = false; 
    this.mesh.scaling.z = 0;

    laserExplosionParticles(this.scene, this, this.color);

    setTimeout(() => {
      this.destroy();
    }, 1000);
  }

  destroy() {
    this.scene.unregisterBeforeRender(this.update);
    this.dispose();
  }

}