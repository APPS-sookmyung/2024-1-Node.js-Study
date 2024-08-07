const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/user");

exports.join = async (req, res, next) => {
  const { email, nick, password } = req.body; //구조분해 할당
  //회원가입 하기전 검사부터
  try {
    const exUser = await User.findOne({ where: { email } });
    //이메일로 가입한 유저가 있는지 찾기
    if (exUser) {
      return res.redirect("/join?error=exist");
    }
    const hash = await bcrypt.hash(password, 12); //비밀번호 암호화 (12정도면 적당)
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.login = (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      // 서버실패
      console.error(authError);
      return next(authError); //서버에러는 next 로 넘기기
    }
    if (!user) {
      //로직실패
      return res.redirect(`/?loginerror=${info.message}`);
    }
    return req.login(user, (loginError) => {
      // 로그인 성공
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};

//app.use(passport.authenticate('kakao')); 기본
//app.use((req, res, next) => passport.authenticate('kakao')(req, res, next));확장

exports.logout = (req, res) => {
  //브라우저 connect.sid남아있어도, 서버에는 세션쿠키가 없음
  req.logout(() => {
    res.redirect("/");
  });
};
