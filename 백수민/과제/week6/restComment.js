async function getComment() { // 로딩 시 사용자 가져오는 함수
    try {
      const res = await axios.get('/comments');
      const comments = res.data;
      const list = document.getElementById('list');
      list.innerHTML = '';
      // 사용자마다 반복적으로 화면 표시 및 이벤트 연결
      Object.keys(comments).map(function (key) {
        const commentDiv = document.createElement('div');
        const span = document.createElement('span');
        span.textContent = comments[key];
        const edit = document.createElement('button');
        edit.textContent = '수정';
        edit.addEventListener('click', async () => { // 수정 버튼 클릭
          const comment = prompt('댓글을 입력하세요');
          if (!comment) {
            return alert('댓글을 반드시 입력하셔야 합니다');
          }
          try {
            await axios.put('/comment/' + key, { comment });
            getComment();
          } catch (err) {
            console.error(err);
          }
        });
        const remove = document.createElement('button');
        remove.textContent = '삭제';
        remove.addEventListener('click', async () => { // 삭제 버튼 클릭
          try {
            await axios.delete('/comment/' + key);
            getComment();
          } catch (err) {
            console.error(err);
          }
        });
        commentDiv.appendChild(span);
        commentDiv.appendChild(edit);
        commentDiv.appendChild(remove);
        list.appendChild(commentDiv);
        console.log(res.data);
      });
    } catch (err) {
      console.error(err);
    }
  }
  
  window.onload = getComment; // 화면 로딩 시 getUser 호출
  // 폼 제출(submit) 시 실행
  document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const comment = e.target.comment.value;
    if (!comment) {
      return alert('댓글을 입력하세요');
    }
    try {
      await axios.post('/comment', { comment });
      getComment();
    } catch (err) {
      console.error(err);
    }
    e.target.comment.value = '';
  });