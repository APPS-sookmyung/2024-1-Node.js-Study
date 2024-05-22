const https = require('https');
const fs = require('fs');

https.createServer({
  cert: fs.readFileSync('도메인 인증서 경로'), //인수 3개가 추가된 형태
  key: fs.readFileSync('도메인 비밀키 경로'), //sync를 서버에서 써도 되는 경우 1. 1번 사용할 때, 2. 서버를 초기화 할 때 
  ca: [
    fs.readFileSync('상위 인증서 경로'), //공식인증기관에서 받은 인증서를 등록하지 않으면 https가 안된다. 
    fs.readFileSync('상위 인증서 경로'),
  ],
}, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.write('<h1>Hello Node!</h1>');
  res.end('<p>Hello Server!</p>');
})
  .listen(443, () => { //443으로 해야 생략 가능
    console.log('443번 포트에서 서버 대기 중입니다!');
  });
