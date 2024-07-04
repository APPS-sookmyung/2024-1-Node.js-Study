//멀터multer  예제 실습
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.set("port", process.env.Port || 3000);
app.use(morgan("combined"));
app.use("/", express.static(path.join(__dirname, "public"))); // 요청경로와 실제 경로. public 경로 안에 들어있다
//요청 주소에 따라서 미들웨어가 어디까지 실행되는지 결정됨. 보통 쿠키나 세션 위에 위치한다
//but fh

app.use(cookieParser(process.env.COOKIE_SECRET)); // 쿠키 관련 조작 하기 편해짐
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: "session-cookie",
  })
);

const multer = require("multer");
const fs = require("fs");
try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다");
  fs.mkdirSync("uploads");
}
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads/");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

app.get("/upload", (req, res) => {
  res.sendFile(path.koin(_dirname, "multipart.html"));
});
app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.send("ok");
});

app.post("/", (req, res) => {
  res.send("hello express");
});

app.get("/about", (req, res) => {
  res.send("hello express");
});

// 404 처리 미들웨어
app.use((req, res, next) => {
  res.status(404).send("404지롱");
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message); // res.send('에러남');
});

// 애플리케이션이 3000번 포트에서 수신 대기하도록 설정
app.listen(app.get("port"), () => {
  console.log("익스프레스 서버 실행");
});
