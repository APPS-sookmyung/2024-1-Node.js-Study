const express = require("express");
const cookieParser = require("cookie-parser"); //{connect.sid: 세션쿠키}
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");
const passport = require("passport");
// process.env 없음
dotenv.config(); //process.env안에 들어가게 됨
const pageRouter = require("./routes/page");
// process.env 있음
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");

const { sequelize } = require("./models"); // db객체 안에 있는 sequelize
const passportConfig = require("./passport");

const app = express();
passportConfig();
app.set("port", process.env.PORT || 8001);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});
sequelize
  .sync({ force: false }) // ()안에 {force: true} 하고서 서버 재시작하면 테이블 다 삭제되고 재 생성됨 (개발시에만)
  .then(() => {
    console.log("데이터 베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public"))); // public파일이 프론트에서 접근할 수 있도록 해줌
app.use("/img", express.static(path.join(__dirname, "uploads"))); // 서버에서 프론트로 이미지를 가지고 와야함
app.use(express.json()); //json 요청
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false, // 나중에 배포할 때 https 적용하면 true로 변경
    },
  })
);
app.use(passport.initialize()); // 위치 주의 (session, ezpress아래로)
//req.user, req.login, req.isAuthenticate, req.logout
//로그인에 필요한 것들을 만들어줌
app.use(passport.session()); //connet.sid 라는 이름으로 세션 쿠키가 브라우저로 전송
//쿠키로 로그인하는 것을 도와줌

app.use("/", pageRouter);
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  // 배포 전에는 에러 메세지 있고, 배포 이후에는 에러 메세지 안띄움 (보안)
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
