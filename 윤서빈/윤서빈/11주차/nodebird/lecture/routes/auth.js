const express = require("express");
const passport = require("passport");

const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const { join, login, logout } = require("../controllers/auth");

const router = express.Router();

// POST /auth/join
router.post("/join", isNotLoggedIn, join);

// POST /auth/login
router.post("/login", isNotLoggedIn, login);

// GET /auth/logout
router.get("/logout", isLoggedIn, logout);

// GET /auth/kakao
router.get("/kakao", passport.authenticate("kakao")); //카카오 로그인 화면으로 redirect
// /authf/kakao -> 카카오톡로그인화면 ->/auth/kakao/callback
// GET /auth/kakao/callback
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/?error=카카오로그인 실패", //실패할 때 리다이렉트
  }),
  (req, res) => {
    res.redirect("/"); // 성공 시에는 /로 이동
  }
);

module.exports = router;
