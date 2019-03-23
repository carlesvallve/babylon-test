import { Vector2, Vector3 } from "@babylonjs/core";

// ========================================
// Angles

export const radians = (degrees) => { // converts from degrees to radians
  return degrees * Math.PI / 180;
};
   
export const degrees = (radians) => { // converts from radians to degrees
  return radians * 180 / Math.PI;
};

export const getRandomVector3 = (min:Vector3, max:Vector3): Vector3 => {
  const p = new Vector3(
    getRandomInt(min.x, max.x),
    getRandomInt(min.y, max.y),
    getRandomInt(min.z, max.z),
  )

  return p;
}


// ========================================
// Random

export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


export const getRandomKeyValue = (obj) => {
  var keys = Object.keys(obj);
  const r = keys.length * Math.random() << 0;
  return { key: keys[r], value: obj[keys[r]] };
}

export const getRandomKeyValues = (obj, n = 1) => {
  var keys = Object.keys(obj)
  const arr = []
  for (let i = 0; i < n; i++) {
    const r = keys.length * Math.random() << 0;
    arr.push({ key: keys[r], value: obj[keys[r]] });
  }
  return arr
}

export const getRandomItemsFromArr = (arr, n = 1) => {
  // Shuffle array
  const shuffled = arr.sort(() => 0.5 - Math.random());
  // Get sub-array of first n elements after shuffled
  return shuffled.slice(0, n);
};

export const shuffleArray = (arr) => {
  return arr.sort(() => 0.5 - Math.random());
};