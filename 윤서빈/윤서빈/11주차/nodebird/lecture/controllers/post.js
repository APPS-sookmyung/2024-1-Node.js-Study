const { Post, Hashtag } = require("../models");

exports.afterUploadImage = (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
};

exports.uploadPost = async (req, res, next) => {
  //req.body, content, req.body, url 이용가능
  try {
    //노드교과서 너무 재밌어요. #노드교과서 #익스프레스 짱짱
    //정규표현식이 가장 간단함 /#[^\s#]*/g 해시태그를 가르키는 정규표현
    const post = await Post.create({
      //게시글 저장
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id, //유저객체에서 아이디
    });
    const hashtags = req.body.content.match(/#[^\s#]*/g); //match로 추출
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) => {
          return Hashtag.findOrCreate({
            //있으면 가져오고 없으면 새로 만들어서 가져옴
            where: { title: tag.slice(1).toLowerCase() }, // # 때려고 slice(1)
          });
        })
      );
      console.log("result", result);
      await post.addHashtags(result.map((r) => r[0]));
    }
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
