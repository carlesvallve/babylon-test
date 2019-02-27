import { Engine } from "@babylonjs/core/Engines/engine";
// import "@babylonjs/core/Debug/debugLayer"; // Augments the scene with the debug methods
// import "@babylonjs/inspector"; // Injects a local ES6 version of the inspector to prevent automatically relying on the none compatible version

import { testScene } from './testScene'
import { shadowScene } from './shadowScene'
import { sunScene } from './sunScene'


// Get the canvas element from the DOM and Associate a Babylon Engine to it.
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new Engine(canvas);




// create a scene
const scene = testScene(canvas, engine);
// const scene = shadowScene(canvas, engine);
// const scene = sunScene(canvas, engine);

// Render every frame
engine.runRenderLoop(() => {
    scene.render();
});

