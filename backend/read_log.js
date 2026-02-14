const fs = require("fs");
try {
  const content = fs.readFileSync("debug_error.log", "utf8");
  console.log(content.substring(0, 5000)); // Print first 5000 chars
} catch (err) {
  console.error("Error reading log:", err);
}
