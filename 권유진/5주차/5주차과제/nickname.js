document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault(); //폼 제출 시 페이지 리로드를 방지한다. 

    const name = document.getElementById('name').value;
    const nickname = document.getElementById('nickname').value;

    const customEvent = new CustomEvent('greetUser', {
        detail: {
            name: name,
            nickname: nickname
        }
    });

    document.dispatchEvent(customEvent); //커스텀 이벤트 디스패치
});

document.addEventListener('greetUser', function(event) { //커스텀 이벤트 리스너 등록
    const nickname = event.detail.nickname;
    const greetingElement = document.getElementById('greeting');
    greetingElement.textContent = `안녕하세요! ${nickname}님.`;
});