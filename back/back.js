const http = require("http");
const fs = require("fs");
const { error } = require("console");

const port = 3000;

//タスクを格納する配列
let Tasks = [
  {
    id: "",
    task: "",
  },
];
console.log(Tasks.length);
//タスク追加関数
const addTask = (task) => {
  let num = Tasks.length;
  Tasks.push({ id: num, task: task });
  Tasks.forEach((task) => {
    console.log(`${task.id}:${task.task}`);
  });
};

const server = http.createServer((request, response) => {
  const path = request.url;
  const method = request.method;

  if (path === "/" && method === "GET") {
    const responseContent = fs.readFile(
      "./../front/index.html",
      (error, data) => {
        if (error) {
          response.writeHead(500);
          response.end("Error loading index.html");
        } else {
          response.writeHead(200, {
            "content-type": "text/html",
          });
          response.end(data);
        }
      }
    );
  } else if (path === "/api/addTask" && method === "POST") {
    console.log("addTask");

    //リクエスト受け取り
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", () => {
      try {
        const data = JSON.parse(body);
        const task = data.task;
        console.log("受け取ったタスク:", task);

        addTask(task);
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ status: "ok", receivedTask: task }));
      } catch (err) {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(
          JSON.stringify({ status: "error", message: "Invalid JSON" })
        );
      }
    });
  } else {
    response.writeHead(404, {
      "content-type": "text/html",
    });
    response.end("Not Found");
  }
});

server.listen(port);
