const fs = require('fs');

// TODO:
// - require argument to determine file path: show help if no argument
// - Don't darken yellow/orange colors (the ligthning bolt) — only darken gray & braun colors — it work I just tried!

function darken(hexColor, amount = 0.9) {
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
  
  // Apply darkening
  const newR = Math.floor(r * amount);
  const newG = Math.floor(g * amount);
  const newB = Math.floor(b * amount);
  
  // Convert back to hex
  return '#' + 
    newR.toString(16).padStart(2, '0') + 
    newG.toString(16).padStart(2, '0') + 
    newB.toString(16).padStart(2, '0');
}

function extractColors(content) {
  // Extract all unique hex colors from the content
  const colorRegex = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;
  const colors = new Set();
  let match;
  
  while ((match = colorRegex.exec(content)) !== null) {
    colors.add(match[0].toLowerCase());
  }
  
  return Array.from(colors).sort();
}

function showHelp() {
  console.log(`
Usage: node darken-svg.js [input] [output] [amount] [exclude]

Arguments:
  input    Input SVG file (default: vike.svg)
  output   Output SVG file (default: same as input)
  amount   Darken amount as decimal (default: 0.9, meaning multiply RGB by 0.9)
  exclude  Regex pattern for colors to exclude (e.g., "ff[0-9a-f]" for yellows)

Examples:
  node darken-svg.js                           # Darken vike.svg by 0.9
  node darken-svg.js logo.svg                  # Darken logo.svg by 0.9
  node darken-svg.js logo.svg out.svg 0.8      # Darken logo.svg by 0.8, save to out.svg
  node darken-svg.js logo.svg out.svg 0.9 "ff" # Darken logo.svg, exclude colors with "ff"
`);
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

const inputFile = args[0] || 'vike.svg';
const outputFile = args[1] || inputFile;
const darkenAmount = parseFloat(args[2]) || 0.9;
const excludePattern = args[3]; // Optional regex pattern for colors to exclude

// Check if input file exists
if (!fs.existsSync(inputFile)) {
  console.error(`Error: Input file '${inputFile}' not found`);
  console.log('\nRun with --help to see usage');
  process.exit(1);
}

// Read SVG file
let content = fs.readFileSync(inputFile, 'utf8');

// Extract all colors from the file
const allColors = extractColors(content);

// Build color map, excluding specified patterns
const colorMap = {};
for (const color of allColors) {
  // Skip if color matches exclude pattern (e.g., yellow/orange colors)
  if (excludePattern) {
    const excludeRegex = new RegExp(excludePattern, 'i');
    if (excludeRegex.test(color)) {
      console.log(`Skipping excluded color: ${color}`);
      continue;
    }
  }
  
  colorMap[color] = darken(color, darkenAmount);
}

// Replace all colors
for (const [oldColor, newColor] of Object.entries(colorMap)) {
  const regex = new RegExp(oldColor.replace('#', '#'), 'gi');
  content = content.replace(regex, newColor);
}

// Write back
fs.writeFileSync(outputFile, content);

console.log(`\nSVG colors darkened successfully!`);
console.log(`Input: ${inputFile}`);
console.log(`Output: ${outputFile}`);
console.log(`Darken amount: ${darkenAmount} (multiply RGB by ${darkenAmount})`);
console.log(`\nColor mappings:`);
for (const [old, newColor] of Object.entries(colorMap)) {
  console.log(`${old} -> ${newColor}`);
}
