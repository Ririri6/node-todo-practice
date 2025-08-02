const http = require("http");
const fs = require("fs");
const { error } = require("console");
const { url } = require("inspector");

const port = 3000;

//タスクを格納する配列
let Tasks = [];
console.log(Tasks.length);
//タスク追加関数
const addTask = (task) => {
  let num = Tasks.length + 1;
  Tasks.push({ id: num, task: task });
  Tasks.forEach((task) => {
    console.log(`${task.id}:${task.task}`);
  });
};

//タスク削除関数
const deleteTask = (id) => {
  const index = Tasks.findIndex((task) => task.id === Number(id));
  if (index !== -1) {
    Tasks.splice(index, 1);
  }
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
  } else if (path === "/alltasks" && method === "GET") {
    const responseContent = fs.readFile(
      "./../front/allTask.html",
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
  } else if (path === "/allTasks.js" && method === "GET") {
    fs.readFile("./../front/allTasks.js", (err, data) => {
      if (err) {
        response.writeHead(404);
        response.end("JS not found");
      } else {
        response.writeHead(200, { "Content-Type": "application/javascript" });
        response.end(data);
      }
    });
  } else if (path === "/api/tasks" && method === "GET") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(Tasks));
  } else if (path === "/api/delete/" && method === "POST") {
    //削除API
    console.log("delete");
    //リクエスト受け取り
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", () => {
      try {
        const data = JSON.parse(body);
        const deleteID = data.id;
        console.log("受け取ったタスク:", deleteID);

        deleteTask(deleteID);
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ status: "ok", receivedID: deleteID }));
      } catch (err) {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(
          JSON.stringify({ status: "error", message: "Invalid JSON" })
        );
      }
    });
  } else {
    response.writeHead(404, {
      "Content-type": "text/html",
    });
    response.end("Not Found");
  }
});

server.listen(port);
