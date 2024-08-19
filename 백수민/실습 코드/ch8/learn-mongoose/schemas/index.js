const mongoose = require('mongoose');

const connect = () => {
  if (process.env.NODE_ENV !== 'production') { // 배포가 아니고 개발 모드일 때
    mongoose.set('debug', true);
  }
  mongoose.connect('mongodb://root:mongodbpwd@localhost:27017/admin', {
    dbName: 'nodejs',
    useNewUrlParser: true,
  }).then(() => {
    console.log("몽고디비 연결 성공");
  }).catch((err) => {
    console.error("몽고디비 연결 에러", err);
  });
};

// 에러를 기록하는 이벤트 리스너
mongoose.connection.on('error', (error) => {
  console.error('몽고디비 연결 에러', error);
});
mongoose.connection.on('disconnected', () => {
  console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
  connect();
});

module.exports = connect;