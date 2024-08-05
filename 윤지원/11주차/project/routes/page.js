const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const router = express.Router();
const {
  renderJoin,
  renderMain,
  renderProfile,
  renderHashtag,
} = require("../controllers/page");
router.use((req, res, next) => {
  //여기에 공통적으로 쓰길 원하는 데이터를 넣어줌
  res.locals.user = req.user; //사용자 정보
  res.locals.followerCount = req.user?.Followers?.length || 0;
  res.locals.followingCount = req.user?.Followings?.length || 0;
  res.locals.followingIdList = req.user?.Followings?.map((f) => f.id) || [];
  next(); //필수적
});
//로그인 한 사람만 렌더링 할 수 있게
router.get("/profile", isLoggedIn, renderProfile);
//안 한 사람만 회원가입 할 수 있게
router.get("/join", isNotLoggedIn, renderJoin);
router.get("/", renderMain);
router.get("/hashtag", renderHashtag);
module.exports = router;
