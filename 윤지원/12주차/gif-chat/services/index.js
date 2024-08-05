//컨트롤러랑 코드는 똑같음
const Room = require("../schemas/room");
const Chat = require("../schemas/chat");

exports.removeRoom = async (roomID) => {
  try {
    await Room.deleteOne({ _id: roomID });
    await Chat.deleteMany({ room: roomID });
  } catch (error) {
    throw error; //컨트롤러로 에러 넘겨줌
  }
};
