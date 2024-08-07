const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;

const User = require("../models/user");

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: "/auth/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        //accessToken, refreshToken 카카오 api 호출할 때 사용
        console.log("kakao profile", profile); //사용자 정보, 카카오에서 계속 바껴서 항상 봐야함
        try {
          const exUser = await User.findOne({
            //기존 유저 찾기
            where: { snsId: profile.id, provider: "kakao" },
          });
          if (exUser) {
            done(null, exUser); //사용자 있는 경우(로그인)
          } else {
            //회원가입
            const newUser = await User.create({
              email: profile._json?.kakao_account?.email, //구조가 계속 바뀜
              nick: profile.displayName,
              snsId: profile.id,
              provider: "kakao",
            });
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
