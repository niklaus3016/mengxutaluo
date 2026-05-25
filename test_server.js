import http from 'http';
import fs from 'fs';
import path from 'path';

// Let's check if the file in dist/assets/tarot/m00.jpg actually exists and has size
const p = path.join(process.cwd(), "dist", "assets", "tarot", "m00.jpg");
console.log("File path:", p);
console.log("Exists:", fs.existsSync(p));
if (fs.existsSync(p)) {
  console.log("Size:", fs.statSync(p).size);
}
