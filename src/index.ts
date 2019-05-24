import { Engine } from "@babylonjs/core/Engines/engine";
// import "@babylonjs/core/Debug/debugLayer"; // Augments the scene with the debug methods
// import "@babylonjs/inspector"; // Injects a local ES6 version of the inspector to prevent automatically relying on the none compatible version

import { terrainScene } from "./scenes/terrainScene";
import { followScene } from "./scenes/followScene";
import { bounceScene } from "./scenes/bounceScene";
import { testScene } from "./scenes/testScene";
import { shadowScene } from "./scenes/shadowScene";
import { sunScene } from "./scenes/sunScene";
import LoaderScene from "./scenes/LoaderScene";
import { emptyScene } from "./scenes/emptyScene";

// Get the canvas element from the DOM and Associate a Babylon Engine to it.
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new Engine(canvas, true, {}, false);

// create a scene
// const scene = terrainScene(canvas, engine);
// const scene = followScene(canvas, engine);
// const scene = bounceScene(canvas, engine);
// const scene = testScene(canvas, engine);
// const scene = shadowScene(canvas, engine);
// const scene = sunScene(canvas, engine);
const scene = new LoaderScene(canvas, engine, {});
// const scene = emptyScene(canvas, engine);

// fps
const times = [];
const calculateFps = () => {
  // calculate fps
  const now = performance.now();
  while (times.length > 0 && times[0] <= now - 1000) {
    times.shift();
  }
  times.push(now);
  const fps = times.length;
  // console.log(fps);
};

// Render every frame
engine.runRenderLoop(() => {
  scene.render();
  // calculateFps();
});
