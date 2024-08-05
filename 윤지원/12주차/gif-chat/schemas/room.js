const mongoose = require("mongoose");

const { Schema } = mongoose;
const roomSchema = new Schema({
  title: {
    //방 제목
    type: String,
    required: true,
  },
  max: {
    //최대 인원
    type: Number,
    required: true,
    default: 10,
    min: 2, //최소 두명
  },
  owner: {
    // 방장 표시
    type: String,
    required: true,
  },
  password: String, //비밀번호 있을수도 있고 없을수도 있음
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Room", roomSchema);
