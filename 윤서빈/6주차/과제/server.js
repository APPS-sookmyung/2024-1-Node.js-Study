const http = require("http");
const fs = require("fs").promises;
const path = require("path");
const querystring = require("querystring");

const users = {};
const notes = [];

http
  .createServer(async (req, res) => {
    try {
      if (req.method === "GET") {
        if (req.url === "/") {
          const data = await fs.readFile(path.join(__dirname, "login.html"));
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(data);
        } else if (req.url === "/about") {
          const data = await fs.readFile(path.join(__dirname, "about.html"));
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(data);
        } else if (req.url === "/notes") {
          const data = await fs.readFile(path.join(__dirname, "notes.html"));
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.write(data);
          res.write("<script>");
          res.write('document.getElementById("noteList").innerHTML = `');
          notes.forEach((note) => {
            res.write(`<li>${note.title}: ${note.content}</li>`);
          });
          res.write("`;</script>");
          res.end();
        } else if (req.url === "/add-note-page") {
          const data = await fs.readFile(path.join(__dirname, "addNote.html"));
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(data);
        } else {
          try {
            const data = await fs.readFile(path.join(__dirname, req.url));
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            res.end(data);
          } catch (err) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("NOT FOUND");
          }
        }
      } else if (req.method === "POST") {
        if (req.url === "/login") {
          let body = "";
          req.on("data", (data) => {
            body += data;
          });
          req.on("end", () => {
            const { name, birthday } = querystring.parse(body);
            const userId = `${name}-${birthday}`;
            users[userId] = { name, birthday };
            res.writeHead(302, { Location: "/notes" });
            res.end();
          });
        } else if (req.url === "/add-note") {
          let body = "";
          req.on("data", (data) => {
            body += data;
          });
          req.on("end", () => {
            const { title, content } = querystring.parse(body);
            notes.push({ title, content });
            res.writeHead(302, { Location: "/notes" });
            res.end();
          });
        }
      } else if (req.method === "PUT") {
        if (req.url.startsWith("/user/")) {
          const key = req.url.split("/")[2];
          let body = "";
          req.on("data", (data) => {
            body += data;
          });
          req.on("end", () => {
            users[key] = JSON.parse(body).name;
            res.writeHead(200, {
              "Content-Type": "application/json; charset=utf-8",
            });
            res.end(JSON.stringify(users));
          });
        }
      } else if (req.method === "DELETE") {
        if (req.url.startsWith("/user/")) {
          const key = req.url.split("/")[2];
          delete users[key];
          res.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8",
          });
          res.end(JSON.stringify(users));
        }
      } else {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("NOT FOUND");
      }
    } catch (err) {
      console.error(err);
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(err.message);
    }
  })
  .listen(8086, () => {
    console.log("8086번 포트에서 서버 대기 중");
  });
