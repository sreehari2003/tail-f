const fs = require("fs");
const http = require("http");
const path = require("path");

const server = http.createServer((req, res) => {
  // Enable CORS for all routes
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.url === "/tail" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    const p = path.join("index.txt");

    const tail = fs.watch(p, (type, file) => {
      // on file change
      if (type === "change") {
        const lines = tailLog(p, 10);

        // Send each line as an event to the client
        lines.forEach((line) => {
          res.write(`data: ${line}\n\n`);
        });
      }
    });

    req.on("close", () => {
      tail.close();
      console.log("connection was closed");
      res.end();
    });
  }
});

server.listen(8080, () => {
  console.log("Server is listening on port 8080");
});

const tailLog = (path, lineNumber) => {
  const c = fs.readFileSync(path, "utf-8");
  // used to filter out empty lines
  const lines = c.split("\n").filter(Boolean);
  const start = Math.max(lines.length - lineNumber, 0);
  return lines.slice(start);
};
