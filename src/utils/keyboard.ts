import { ActionManager, ExecuteCodeAction } from "@babylonjs/core";

export const keyboard = (scene) => {

  /****************************Key Control Multiple Keys************************************************/

  var map = {}; //object for multiple key presses
  scene.actionManager = new ActionManager(scene);

  scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
      map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";

  }));

  scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
      map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
  }));


  /****************************Move Sphere******************************************************/

  // scene.registerAfterRender(function () {

  //     if ((map["w"] || map["W"])) {
  //         sphere.position.z += 0.1;
  //     };

  //     if ((map["z"] || map["Z"])) {
  //         sphere.position.z -= 0.1;
  //     };

  //     if ((map["a"] || map["A"])) {
  //         sphere.position.x -= 0.1;
  //     };

  //     if ((map["s"] || map["S"])) {
  //         sphere.position.x += 0.1;
  //     };

  // });

}
