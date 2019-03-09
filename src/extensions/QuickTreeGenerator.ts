import { Vector3, VertexBuffer, VertexData, Mesh, Axis, StandardMaterial } from "@babylonjs/core";
import { addToEnvironmentEffects } from "../utils/babylon-utils";
import { color3, Colors } from "../utils/colors";
import { createTree } from "./SPSTreeGenerator";
import { radians } from "../utils/math";

export const makeTree = (type = 'basic', color = color3(Colors.olive)) => { // basic|pine|sds
  const trunkMaterial = new StandardMaterial('material', this);
  (<StandardMaterial>trunkMaterial).diffuseColor = color3(Colors.brown); 
  const leafMaterial = new StandardMaterial('material', this);
  (<StandardMaterial>leafMaterial).diffuseColor = color; // color3(Colors.olive); 

  // basic
  if (type = 'basic') {
    const tree = QuickTreeGenerator(4, 4, 0.8, trunkMaterial, leafMaterial, this);
    tree.position = new Vector3(15, 0 , 17);
    addToEnvironmentEffects(this, tree);
    return tree
  }

  // pine
  if (type = 'pine') {
    const pine = PineTreeGenerator(3, 30, trunkMaterial, leafMaterial, this);
    pine.position = new Vector3(-15, 0 , -17);
    addToEnvironmentEffects(this, pine);
  }

  // sps
  if (type = 'sps') {
    const sps = createTree (
      6, // trunkHeight, 
      0.7, // trunkTaper, 
      3, // trunkSlices, 
      trunkMaterial, // trunkMaterial, 
      3, // boughs, 
      3, // forks, 
      radians (45), // forkAngle, 
      0.1, // forkRatio, 
      2, // branches, 
      radians(45), // branchAngle, 
      3, // bowFreq, 
      3, // bowHeight, 
      3, // leavesOnBranch, 
      0.5, // leafWHRatio, 
      leafMaterial, // leafMaterial, 
      this, // scene
    );
    sps.position = new Vector3(-15, 0 , 17);
    addToEnvironmentEffects(this, sps);
  }
}
  

// QuickTreeGenerator
// sizeBranch - sphere radius used for branches and leaves 15 to 20.
// sizeTrunk - height of trunk 10 to 15.
// radius - radius of trunk 1 to 5.
// trunkMaterial - material used for trunk.
// leafMaterial - material for canopies.
// scene - BABYLON scene.

export const QuickTreeGenerator = function(sizeBranch, sizeTrunk, radius, trunkMaterial, leafMaterial, scene) {

  var tree = new Mesh("tree", scene);
  tree.isVisible = false;
  
  var leaves = new Mesh("leaves", scene);
  
  //var vertexData = VertexData.CreateSphere(2,sizeBranch); //this line for BABYLONJS2.2 or earlier
  var vertexData = VertexData.CreateSphere({segments:2, diameter:sizeBranch}); //this line for BABYLONJS2.3 or later
  
  vertexData.applyToMesh(leaves, false);

  var positions = leaves.getVerticesData(VertexBuffer.PositionKind);
  var indices = leaves.getIndices();
  var numberOfPoints = positions.length/3;

  var map = [];

  // The higher point in the sphere
  var v3 = Vector3 ;
  var max = [];

  for (var i=0; i<numberOfPoints; i++) {
      var p = new v3(positions[i*3], positions[i*3+1], positions[i*3+2]);

      if (p.y >= sizeBranch/2) {
          max.push(p);
      }

      var found = false;
      for (var index=0; index<map.length&&!found; index++) {
          var array = map[index];
          var p0 = array[0];
          if (p0.equals (p) || (p0.subtract(p)).lengthSquared() < 0.01){
              array.push(i*3);
              found = true;
          }
      }
      if (!found) {
          var array2 = [];
          array2.push(p, i*3);
          map.push(array2);
      }

  }
  var randomNumber = function (min, max) {
      if (min == max) {
          return (min);
      }
      var random = Math.random();
      return ((random * (max - min)) + min);
  };

  map.forEach(function(array) {
      var index, min = -sizeBranch/10, max = sizeBranch/10;
      var rx = randomNumber(min,max);
      var ry = randomNumber(min,max);
      var rz = randomNumber(min,max);

      for (index = 1; index<array.length; index++) {
          var i = array[index];
          positions[i] += rx;
          positions[i+1] += ry;
          positions[i+2] += rz;
      }
  });

  leaves.setVerticesData(VertexBuffer.PositionKind, positions);
  var normals = [];
  VertexData.ComputeNormals(positions, indices, normals);
  leaves.setVerticesData(VertexBuffer.NormalKind, normals);
  leaves.convertToFlatShadedMesh();
  
  leaves.material = leafMaterial;
  leaves.position.y = sizeTrunk+sizeBranch/2-2;
  

  var trunk = Mesh.CreateCylinder("trunk", sizeTrunk, radius-2<1?1:radius-2, radius, 10, 2, scene );
  
  trunk.position.y = (sizeBranch/2+2)-sizeTrunk/2;

  trunk.material = trunkMaterial;
  trunk.convertToFlatShadedMesh();
  
  leaves.parent = tree;
  trunk.parent = tree;
  return tree;

};


// PineTreeGenerator
// canopies - number of leaf sections.
// height - height of tree.
// trunkMaterial - material used for trunk.
// leafMaterial - material for canopies.
// scene - BABYLON scene

export var PineTreeGenerator = function(canopies, height, trunkMaterial, leafMaterial, scene) {
  var curvePoints = function(l, t) {
  var path = [];
  var step = l / t;
  for (var i = 0; i < l; i += step ) {
  path.push(new Vector3(0, i, 0));
     path.push(new Vector3(0, i, 0 ));
   }
  return path;
  };

  var nbL = canopies + 1;
  var nbS = height;
  var curve = curvePoints(nbS, nbL);
  var radiusFunction = function (i, distance) {
      var fact = 1;
    if (i % 2 == 0) { fact = .5; }
      var radius =  (nbL * 2 - i - 1) * fact;	
      return radius;
  };  

  var leaves = Mesh.CreateTube("tube", curve, 0, 10, radiusFunction, 1, scene);
  var trunk = Mesh.CreateCylinder("trunk", nbS/nbL, nbL*1.5 - nbL/2 - 1, nbL*1.5 - nbL/2 - 1, 12, 1, scene);

  trunk.position.y = (nbS/nbL) / 2;
  leaves.translate(Axis.Y, (nbS/nbL) / 2);

  leaves.material = leafMaterial;
  trunk.material = trunkMaterial;

  var tree = Mesh.CreateBox('',1,scene);
  tree.isVisible = false;
  leaves.parent = tree;
  trunk.parent = tree; 

  return tree; 
}