import { Color3, Color4 } from "@babylonjs/core";

export const Colors = {
    aqua: "#00ffff",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    black: "#000000",
    blue: "#0000ff",
    brown: "#a52a2a",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgrey: "#a9a9a9",
    darkgreen: "#006400",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkviolet: "#9400d3",
    fuchsia: "#ff00ff",
    gold: "#ffd700",
    green: "#008000",
    indigo: "#4b0082",
    khaki: "#f0e68c",
    lightblue: "#add8e6",
    lightcyan: "#e0ffff",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    magenta: "#ff00ff",
    maroon: "#800000",
    navy: "#000080",
    olive: "#808000",
    orange: "#ffa500",
    pink: "#ffc0cb",
    purple: "#800080",
    violet: "#800080",
    red: "#ff0000",
    silver: "#c0c0c0",
    white: "#ffffff",
    yellow: "#ffff00"  
};


export const randomColor3 = (): Color3 => {
  var keys = Object.keys(Colors)
  const prop = Colors[keys[ keys.length * Math.random() << 0]];
  return color3(prop);
}

export const randomColor4 = (): Color4 => {
  var keys = Object.keys(Colors)
  const prop = Colors[keys[ keys.length * Math.random() << 0]];
  return color4(prop);
}

// return new Color3(r, g, b) from any valid color.
export const color3 = (color: string): Color3 => {
  if (color[0] === '#') {
    // convert #RGB and #RGBA to #RRGGBB and #RRGGBBAA
    color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3] + (color.length > 4 ? color[4] + color[4] : '');
    
    return new Color3(
      parseInt(color.substr(1, 2), 16)/255,
      parseInt(color.substr(3, 2), 16)/255,
      parseInt(color.substr(5, 2), 16)/255,
      // color.length > 7 ? parseInt(color.substr(7, 2), 16)/255 : 1
    ) 
  }
}

// return new Color4(r, g, b, a) from any valid color.
export const color4 = (color: string): Color4 => {
  if (color[0] === '#') {
    // convert #RGB and #RGBA to #RRGGBB and #RRGGBBAA
    color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3] + (color.length > 4 ? color[4] + color[4] : '');
    
    return new Color4(
      parseInt(color.substr(1, 2), 16)/255,
      parseInt(color.substr(3, 2), 16)/255,
      parseInt(color.substr(5, 2), 16)/255,
      color.length > 7 ? parseInt(color.substr(7, 2), 16)/255 : 1
    ) 
  }
}


// // return new Color4(r, g, b, a) from any valid color.
// export const Color = (color) => {
//   if (color === '') {
//     return null;
//   }
      
//   if (color.toLowerCase() === 'transparent') {
//     return new Color4(0, 0, 0, 0);
//   }
      
    
//   if (color[0] === '#') {
//     if (color.length < 7) {
//       // convert #RGB and #RGBA to #RRGGBB and #RRGGBBAA
//       color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3] + (color.length > 4 ? color[4] + color[4] : '');
//     }

//     return new Color3(
//       parseInt(color.substr(1, 2), 16)/255,
//       parseInt(color.substr(3, 2), 16)/255,
//       parseInt(color.substr(5, 2), 16)/255,
//       // color.length > 7 ? parseInt(color.substr(7, 2), 16)/255 : 1
//     ) 
//   }

//   if (color.indexOf('rgb') === -1) {
//     // convert named colors
//     var temp_elem = document.body.appendChild(document.createElement('fictum')); // intentionally use unknown tag to lower chances of css rule override with !important
//     var flag = 'rgb(1, 2, 3)'; // this flag tested on chrome 59, ff 53, ie9, ie10, ie11, edge 14
    
//     temp_elem.style.color = flag;
//     if (temp_elem.style.color !== flag) {
//       return; // color set failed - some monstrous css rule is probably taking over the color of our object
//     }

//     temp_elem.style.color = color;
//     if (temp_elem.style.color === flag || temp_elem.style.color === '') {
//       return; // color parse failed
//     }   
//     color = getComputedStyle(temp_elem).color;
//     document.body.removeChild(temp_elem);
//   }

//   if (color.indexOf('rgb') === 0) {
//     if (color.indexOf('rgba') === -1) {
//       color += ',1'; // convert 'rgb(R,G,B)' to 'rgb(R,G,B)A' which looks awful but will pass the regxep below
//     }
//     return color.match(/[\.\d]+/g).map(function (a) {
//       return +a
//     });
//   }
// }