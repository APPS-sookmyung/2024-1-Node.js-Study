//채팅방에 대한 설정 ( 방 입장 , 인원 수 , 비번 입력 등 )

const Room = require("../schemas/room");
const Chat = require("../schemas/chat");
const { removeRoom: removeRoomService } = require("../services");

//메인화면
exports.renderMain = async (req, res, next) => {
  try {
    const rooms = await Room.find({});
    res.render("main", { rooms, title: "GIF 채팅방" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 방 생성화면
exports.renderRoom = (req, res) => {
  res.render("room", { title: "GIF 채팅방 생성" });
};

//채팅들 추가
exports.createRoom = async (req, res, next) => {
  try {
    const newRoom = await Room.create({
      title: req.body.title,
      max: req.body.max,
      owner: req.session.color, //세션이기 때문에 새로고침해도 남아있음
      password: req.body.password,
    });
    const io = req.app.get("io");
    io.of("/room").emit("newRoom", newRoom); // room 에 있는 사람들에게 새로운 방에 대한 데이터 전송
    if (req.body.password) {
      // 비밀번호가 있는 방이면 방id 뒤에 비밀번호 붙여넣음
      res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
    } else {
      res.redirect(`/room/${newRoom._id}`);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.enterRoom = async (req, res, next) => {
  try {
    const room = await Room.findOne({ _id: req.params.id });
    if (!room) {
      //방이 있는지부터 찾음
      return res.redirect("/?error=존재하지 않는 방입니다.");
    } // 방에 비밀번호가 있는데 입력한거랑 다르면 에러 띄우기
    if (room.password && room.password !== req.query.password) {
      return res.redirect("/?error=비밀번호가 틀렸습니다.");
    }
    const io = req.app.get("io");
    //특정 방 조회
    const { rooms } = io.of("/chat").adapter;
    console.log(rooms, rooms.get(req.params.id), rooms.get(req.params.id));
    if (room.max <= rooms.get(req.params.id)?.size) {
      return res.redirect("/?error=허용 인원이 초과하였습니다.");
    }
    const chats = await Chat.find({ room: room._id }).sort("createdAt");
    return res.render("chat", {
      room,
      title: room.title,
      chats,
      user: req.session.color,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.removeRoom = async (req, res, next) => {
  try {
    await removeRoomService(req.params.id);
    res.send("ok");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

//새로운 챗
exports.sendChat = async (req, res, next) => {
  try {
    const chat = await Chat.create({
      room: req.params.id, //폼에서 전달될 데이터들 
      user: req.session.color, // 유저 컬러
      chat: req.body.chat,
    });
    //실시간으로 전송 
    req.app.get("io").of("/chat").to(req.params.id).emit("chat", chat);
    res.send("ok");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.sendGif = async (req, res, next) => {
  try {
    const chat = await Chat.create({
      room: req.params.id,
      user: req.session.color,
      gif: req.file.filename,
    });
    req.app.get("io").of("/chat").to(req.params.id).emit("chat", chat);
    res.send("ok");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
