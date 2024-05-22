const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length; //본인 컴퓨터의 CPU개수만큼 서버가 생성

if (cluster.isMaster) {
  console.log(`마스터 프로세스 아이디: ${process.pid}`);
  // CPU 개수만큼 워커를 생산
  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork();
  }
  // 워커가 종료되었을 때
  cluster.on('exit', (worker, code, signal) => {
    console.log(`${worker.process.pid}번 워커가 종료되었습니다.`);
    console.log('code', code, 'signal', signal);
    cluster.fork(); //종료됐을 때 새로운 것 하나 생성(종료되더라도 다시 실행한다. )
  });
} else {
  // 워커들이 포트에서 대기
  http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); //호출 한 다음에 
    res.write('<h1>Hello Node!</h1>');
    res.end('<p>Hello Cluster!</p>');
    setTimeout(() => { // 워커 존재를 확인하기 위해 1초마다 강제 종료
      process.exit(1);
    }, 1000); //모든 프로세스와 서버가 종료된다. 
  }).listen(8086);

  console.log(`${process.pid}번 워커 실행`);
}
