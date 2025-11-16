const fs = require('fs');

function darkenTwice(hexColor) {
  // Remove # if present
  let hex = hexColor.replace('#', '');
  
  // Handle 3-char hex colors
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Apply darkening twice (0.9 * 0.9 = 0.81)
  const newR = Math.floor(r * 0.81);
  const newG = Math.floor(g * 0.81);
  const newB = Math.floor(b * 0.81);
  
  // Convert back to hex
  return '#' + 
    newR.toString(16).padStart(2, '0') + 
    newG.toString(16).padStart(2, '0') + 
    newB.toString(16).padStart(2, '0');
}

// Colors to darken (grays and browns, not yellows/oranges)
const colorMap = {
  '#000000': darkenTwice('#000000'),
  '#757575': darkenTwice('#757575'),
  '#7d7d7d': darkenTwice('#7d7d7d'),
  '#848484': darkenTwice('#848484'),
  '#878787': darkenTwice('#878787'),
  '#8c8c8c': darkenTwice('#8c8c8c'),
  '#929090': darkenTwice('#929090'),
  '#979797': darkenTwice('#979797'),
  '#999': darkenTwice('#999999'),
  '#a6a6a6': darkenTwice('#a6a6a6'),
  '#ababab': darkenTwice('#ababab'),
  '#ac501b': darkenTwice('#ac501b'),
  '#b0b0b0': darkenTwice('#b0b0b0'),
  '#bababa': darkenTwice('#bababa'),
  '#bdbdbd': darkenTwice('#bdbdbd'),
  '#c2c2c2': darkenTwice('#c2c2c2'),
  '#ccc': darkenTwice('#cccccc'),
  '#cfcfcf': darkenTwice('#cfcfcf'),
  '#d1d1d1': darkenTwice('#d1d1d1'),
  '#dedede': darkenTwice('#dedede'),
};

// Read SVG file
let content = fs.readFileSync('vike.svg', 'utf8');

// Replace all colors
for (const [oldColor, newColor] of Object.entries(colorMap)) {
  const regex = new RegExp(oldColor.replace('#', '#'), 'gi');
  content = content.replace(regex, newColor);
}

// Write back
fs.writeFileSync('vike.svg', content);

console.log('SVG colors darkened successfully!');
console.log('Color mappings:');
for (const [old, newColor] of Object.entries(colorMap)) {
  console.log(`${old} -> ${newColor}`);
}
