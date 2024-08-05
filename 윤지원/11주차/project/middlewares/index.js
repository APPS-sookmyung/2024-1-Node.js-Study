exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    //패스포트 통해서 로그인했는지 확인
    next();
  } else {
    res.status(403).send("로그인 필요");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //패스포트 통해서 로그인 안 했으면 다음으로 넘어감 
    next();
  } else {
    //이미 로그인한 상태일때 에러메세지
    const message = encodeURIComponent("로그인한 상태입니다.");
    res.redirect(`/?error=${message}`);
  }
};
