import fs from 'fs';

const filepath = './src/App.jsx';
const content = fs.readFileSync(filepath, 'utf8');

// Find the EXAMPLE_INPUT block
const match = content.match(/(const EXAMPLE_INPUT = `)([\s\S]*?)(`[\s\S]*?const EXAMPLE_OUTPUT =)/);
if (!match) {
  console.error("Could not find EXAMPLE_INPUT template literal block in src/App.jsx");
  process.exit(1);
}

const prefix = match[1];
const inputStr = match[2];
const suffix = match[3];

// Replace any \n (backslash n) with \\n (double backslash n) if it is not already preceded by a backslash
// In JS source text, a single backslash is written as \\ and double backslash as \\\\
const fixedInputStr = inputStr.replace(/(?<!\\)\n/g, '\\n').replace(/(?<!\\)\\n/g, '\\\\n');
// Wait, let's make sure we don't break existing double backslashes or actual raw newlines.
// Let's do a more precise replacement.
// In the source text, the user wrote "\n" (backslash n) in several lines:
// E.g. "Descricao do registro": "... INTERNAMENTO\n#MEDICAÇÕES..."
// In the JS string `content`, this is represented as the character '\\' followed by 'n'.
// If we want it to be valid, it must be '\\\\' followed by 'n'.
// So we can replace any '\\n' that is not preceded by '\\' with '\\\\n'.
const parsedInputStr = inputStr.replace(/(?<!\\)\\n/g, '\\\\n');

const newContent = content.replace(/(const EXAMPLE_INPUT = `)([\s\S]*?)(`[\s\S]*?const EXAMPLE_OUTPUT =)/, `$1${parsedInputStr}$3`);

fs.writeFileSync(filepath, newContent, 'utf8');
console.log("Replacement complete!");
