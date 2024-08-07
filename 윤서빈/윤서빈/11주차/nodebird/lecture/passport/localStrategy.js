const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/user");

module.exports = () => {
  passport.use(
    new LocalStrategy( //passport에 미리 등록햐두는 것
      {
        usernameField: "email", // req, body. email
        passwordField: "password", // req, body, password
        passReqToCallback: false, //true이면 밑에 req추가
      },
      async (email, password, done) => {
        //done(서버실패, 성공유저, 로직실패)
        try {
          const exUser = await User.findOne({ where: { email } }); //이메일 있는지 판단
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password); //비밀번호 비교(compare), 사용자가 저장한 비밀번호와 디비에 저장된 비밀번호 일치하는지 확인
            if (result) {
              //일치한다면
              done(null, exUser); //성공
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다." });
            } //로직실패
          } else {
            done(null, false, { message: "가입되지 않은 회원입니다." });
          }
        } catch (error) {
          console.error(error);
          done(error); //서버실패
        }
      }
    )
  );
};
