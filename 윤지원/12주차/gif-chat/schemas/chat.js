// 방이 있으면 대화 하나하나가 전부 DB 에 저장
const mongoose = require("mongoose");

const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;
const chatSchema = new Schema({
  room: {
    type: ObjectId, //대화가 어떤 방에 속한건지 알게 됨
    required: true,
    ref: "Room", //roomschema
  },
  user: {
    type: String, //익명이지만 ID 가 있다
    required: true,
  },
  chat: String, //일반채팅 or 사진챝ㅇ
  gif: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Chat", chatSchema);
