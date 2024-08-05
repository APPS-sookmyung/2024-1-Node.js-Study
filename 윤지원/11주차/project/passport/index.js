const passport = require("passport");
const local = require("./localStrategy");//이메일 로그인
const kakao = require("./kakaoStrategy");//카카오 로그인 
const User = require("../models/user");//유저 테이블에 데이터를 꽂기

module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log("serialize");
    done(null, user.id);
  });

  //유저 아이디만 꺼내서 저장하기
  passport.deserializeUser((id, done) => {
    console.log("deserialize");
    User.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ["id", "nick"],
          as: "Followers",
        },
        {
          model: User,
          attributes: ["id", "nick"],
          as: "Followings",
        },
      ],
    })
      .then((user) => {
        console.log("user", user);
        done(null, user);
      })
      .catch((err) => done(err));
  });

  local();
  kakao();
};
