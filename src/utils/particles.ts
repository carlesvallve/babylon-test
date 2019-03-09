import { Vector3, ParticleSystem, Color4, Texture } from "@babylonjs/core";

export const spaceshipParticles = (scene, emmiterObject, emitBox) => {
  // Create a particle system
  var particleSystem = new ParticleSystem("particles", 2000, scene);

  //Texture of each particle
  particleSystem.particleTexture = new Texture ("/assets/particles/flare.png", scene);

  // Where the particles come from
  particleSystem.emitter = emmiterObject; // the starting object, the emitter
  const d = 0.3;
  particleSystem.minEmitBox = emitBox.min; // new Vector3(-d, -d, -d); // Starting all from
  particleSystem.maxEmitBox = emitBox.max; // new Vector3(d, d, -d); // To...

  // Colors of all particles
  particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
  particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0);
  particleSystem.colorDead = new Color4 (0, 0, 0.2, 0.0);

  // Size of each particle (random between...
  particleSystem.minSize = 0.1;
  particleSystem.maxSize = 0.5;

  // Life time of each particle (random between...
  particleSystem.minLifeTime = 0.3;
  particleSystem.maxLifeTime = 1.0;

  // Emission rate
  particleSystem.emitRate = 150;

  // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
  particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;

  // Set the gravity of all particles
  // particleSystem.gravity = new Vector3 (0, -9.81, 0);

  // Direction of each particle after it has been emitted
  // particleSystem.direction1 = new Vector3(-7, 8, 3);
  // particleSystem.direction2 = new Vector3(7, 8, -3);
  particleSystem.direction1 = new Vector3(0, 0, -0.3); //-0.5);
  particleSystem.direction2 = new Vector3(0, 0, -0.3); //-0.5);
  // Angular speed, in radians
  particleSystem.minAngularSpeed = 0;
  particleSystem.maxAngularSpeed = Math.PI;

  // Speed
  particleSystem.minEmitPower = 1;
  particleSystem.maxEmitPower = 3;
  particleSystem.updateSpeed = 0.025;

  // Start the particle system
  particleSystem.start();

  return particleSystem;
}