
import { Scene, AbstractMesh, Mesh, Ray, PickingInfo, Vector3, RayHelper } from "@babylonjs/core";


export const castRayDown = (
  scene: Scene,
  me: AbstractMesh,
  colliderArr: Array<Mesh> = [],
  length:number = 100,
  offset:Vector3 = Vector3.Zero()
): PickingInfo => {

  // const origin = me.position.add(offset);
  const origin = new Vector3(
    me.position.x + offset.x,
    me.position.y + offset.y,
    me.position.z + offset.z
  )

  const down = new Vector3(0,-1,0);		

  let direction = down.subtract(origin);
  direction = Vector3.Normalize(direction);

  const predicate = (mesh) => {
    for (let i = 0; i < colliderArr.length; i++) {
      if (mesh === colliderArr[i]) { return true; }
    }
    return false;
  }

  const ray: Ray = new Ray(origin, direction, length);
  const hit: PickingInfo = scene.pickWithRay(ray, predicate);

  // rayHelper(scene, ray, <AbstractMesh>me, origin, direction, length);

  if (hit.pickedMesh) { return hit; }
  return null;
}


export const castRayForward = (
  scene: Scene,
  me: AbstractMesh,
  colliderArr: Array<Mesh> = [],
  length:number = 100,
  offset:Vector3 = Vector3.Zero()
): PickingInfo => {

  const vecToLocal = (vector, mesh) => {
    var m = mesh.getWorldMatrix();
    var v = Vector3.TransformCoordinates(vector, m);
    return v;		 
  }

  // const origin = me.position.add(offset);
  const origin = new Vector3(
    me.position.x + offset.x,
    me.position.y + offset.y,
    me.position.z + offset.z
  )

  const forward = vecToLocal(new Vector3(0, 0, 1), me);

  let direction = forward.subtract(origin);
  direction = Vector3.Normalize(direction);

  const predicate = (mesh) => {
    for (let i = 0; i < colliderArr.length; i++) {
      if (mesh === colliderArr[i]) { return true; }
    }
    return false;
  }

  const ray: Ray = new Ray(origin, direction, length);
  const hit: PickingInfo = scene.pickWithRay(ray, predicate);

  // rayHelper(scene, ray, <AbstractMesh>me, origin, direction, length);

  if (hit.pickedMesh) { return hit; }
  return null;
}

export const rayHelper = (scene:Scene, ray: Ray, me: AbstractMesh, origin: Vector3, direction: Vector3, length: number) => {
  var rayHelper = new RayHelper (ray);
  console.log(rayHelper);
  // rayHelper.attachToMesh(me, direction, origin, length);
  rayHelper.show(scene);
}