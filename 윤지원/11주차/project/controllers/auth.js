const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/user");

//구조분해 할당
exports.join = async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    // 항상 기존 유저랑 안 겹치는지 확인해야 함
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect("/join?error=exist");
    }
    const hash = await bcrypt.hash(password, 12); //bycrpt 로 비번 암호화
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect("/"); //메인화면으로 돌림
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

//POST/auth/login
exports.login = (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?error=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/"); //302
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
};
