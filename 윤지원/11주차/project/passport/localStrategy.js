const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/user");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: false, //true면 async에 req 들어감
      },
      async (email, password, done) => {
        // done(서버실패, 성공유저, 로직실패)
        try {
          const exUser = await User.findOne({ where: { email } }); // 일단 그 이메일이 있는지
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password); // 비밀번호 비교
            if (result) {
              done(null, exUser);
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다." }); // 서버는 안 실패했는데 로그인 실패한 이유
            }
          } else {
            // 사용자가 그냥 없음
            done(null, false, { message: "가입되지 않은 회원입니다." });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
