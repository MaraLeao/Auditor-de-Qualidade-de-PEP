import fs from 'fs';

const content = fs.readFileSync('./src/App.jsx', 'utf8');

// Extract the content between const EXAMPLE_INPUT = ` and the next `
const match = content.match(/const EXAMPLE_INPUT_2 = `([\s\S]*?)`/);
if (!match) {
  console.error("Could not find EXAMPLE_INPUT in src/App.jsx");
  process.exit(1);
}

// In JS, a template literal evaluates escape sequences.
// Let's use eval to get the evaluated string just like the browser does.
let evaluatedStr;
try {
  evaluatedStr = eval("`" + match[1] + "`");
} catch (e) {
  console.error("Failed to evaluate template literal string:", e.message);
  process.exit(1);
}

try {
  JSON.parse(evaluatedStr);
  console.log("JSON is valid when evaluated!");
} catch (e) {
  console.error("JSON parsing failed on evaluated template literal:");
  console.error(e.message);
  
  const posMatch = e.message.match(/at position (\d+)/);
  if (posMatch) {
    const pos = parseInt(posMatch[1], 10);
    const start = Math.max(0, pos - 50);
    const end = Math.min(evaluatedStr.length, pos + 50);
    console.error("\nContext around the error position:");
    console.error(JSON.stringify(evaluatedStr.substring(start, pos)) + " >>>HERE<<< " + JSON.stringify(evaluatedStr.substring(pos, end)));
  }
}
