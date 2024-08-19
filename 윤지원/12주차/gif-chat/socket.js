const SocketIO = require("socket.io");
const { removeRoom } = require("./services");

module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { path: "/socket.io" });
  app.set("io", io); // 익스프레스에 값을 저장
  const room = io.of("/room");
  const chat = io.of("/chat"); //네임스테이스

  const wrap = (middleware) => (socket, next) =>
    middleware(socket.request, {}, next);
  chat.use(wrap(sessionMiddleware));

  //네임스페이스별로 커넥션 ( 네임스페이스별로 다른 동작 하게 )
  room.on("connection", (socket) => {
    console.log("room 네임스페이스에 접속");
    socket.on("disconnect", () => {
      console.log("room 네임스페이스 접속 해제");
    });
  });

  chat.on("connection", (socket) => {
    console.log("chat 네임스페이스에 접속");

    socket.on("join", (data) => {
      socket.join(data); // room 의 object id
      //방에 참여 가능
      socket.to(data).emit("join", {
        user: "system",
        chat: `${socket.request.session.color}님이 입장하셨습니다.`,
      });
    });

    socket.on("disconnect", async () => {
      console.log("chat 네임스페이스 접속 해제");
      const { referer } = socket.request.headers; // 브라우저 주소가 들어있음
      const roomId = new URL(referer).pathname.split("/").at(-1);
      const currentRoom = chat.adapter.rooms.get(roomId);
      const userCount = currentRoom?.size || 0;
      if (userCount === 0) {
        // 유저가 0명이면 방 삭제
        await removeRoom(roomId); // 컨트롤러 대신 서비스를 사용
        room.emit("removeRoom", roomId);
        console.log("방 제거 요청 성공");
      } else {
        socket.to(roomId).emit("exit", {
          user: "system",
          chat: `${socket.request.session.color}님이 퇴장하셨습니다.`,
        });
      }
    });
  });
};
