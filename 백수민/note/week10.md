## < 섹션 6. MySQL >

### 1. 데이터베이스

- 지금까지는 데이터를 서버 메모리에 저장했음
    - 서버를 재시작하면 데이터도 사라짐 -> 영구적으로 저장할 공간 필요
- 보안에 위협이 되지 않는 데이터의 경우 클라이언트에 둠
- 보안 체크가 필요한 데이터의 경우 서버에 저장
- 서버 비용을 줄이기 위해 클라이언트로 보낼 수 있는 데이터는 클라이언트로 보내는게 효율적

- **MySQL** : 관계형 데이터베이스 사용 (관계도를 형성하고 있음)
    - 데이터베이스: 관련성을 가지며 중복이 없는 데이터들의 집합
    - 데이터가 정형화 되어있고 서로간의 관계가 존재
    - 정형 데이터; 틀에서 벗어나면 안된다
- 정형 데이터: 다른 데이터와 relation, association을 갖기 쉬움 (ex: excel)
- NoSQL: 다른 데이터와의 관계 X, 어떤 형식의 데이터가 들어와도 다 받아들임, 데이터 수집에 우선적으로 목적을 둠 (ex: MongoDB)

---

### 2. MySQL, 워크벤치 설치하기

- MySQL Community Downloads에서 MySQL 다운받기
- MySQL workbench 다운받기

<img src="https://raw.githubusercontent.com/suminb99/2024-1-Node.js-Study/main/%EB%B0%B1%EC%88%98%EB%AF%BC/image/week10/img1.png" width="400" height="300"/>

- MySQL terminal에서 접속하기
    - 터미널에서 MySQL이 설치된 경로로 이동: `$ cd /usr/local/mysql/bin`
    - MySQL root로 접속하기: `$ ./mysql -u root -p`
    - password 입력
    - 종료하기: `$ exit`

<img src="https://raw.githubusercontent.com/suminb99/2024-1-Node.js-Study/main/%EB%B0%B1%EC%88%98%EB%AF%BC/image/week10/img2.png" width="550" height="280"/>

---

### 3. 테이블 만들기

- MySQL에서 schema == data

1. 하나의 서비스를 위한 데이터베이스(schema) 생성하기

2. 테이블 생성하기

- **users table:**

<img src="https://raw.githubusercontent.com/suminb99/2024-1-Node.js-Study/main/%EB%B0%B1%EC%88%98%EB%AF%BC/image/week10/img4.png" width="450" height="400"/>

- **comments table:**

<img src="https://raw.githubusercontent.com/suminb99/2024-1-Node.js-Study/main/%EB%B0%B1%EC%88%98%EB%AF%BC/image/week10/img5.png" width="450" height="400"/>


- `mysql> SHOW TABLES`

<img src="https://raw.githubusercontent.com/suminb99/2024-1-Node.js-Study/main/%EB%B0%B1%EC%88%98%EB%AF%BC/image/week10/img6.png" width="300" height="200"/>


---

### 4. 컬럼 옵션들

| 컬럼 옵션 | description |
|---|---|
|INT|정수 자료형(FLOAT, DOUBLE은 실수)|
|VARCHAR|문자열 자료형, 가변 길이(CHAR은 고정 길이)|
|TEXT|긴 문자열은 TEXT로 별도 저장|
|DATETIME|날짜 자료형 저장|
|TINYINT|-128에서 127까지 저장하지만 여기서는 1 또는 0만 저장해 불 값 표현|
|NOT NULL|빈 값은 받지 않는다는 뜻(NULL은 빈 값 허용)|
|AUTO_INCREMENT|숫자 자료형인 경우 다음 로우가 저장될 때 자동으로 1 증가|
|UNISIGNED|0과 양수만 허용|
|ZEROFILL|숫자의 자리 수가 고정된 경우 빈 자리에 0을 넣음|
|DEFAULT now()|날짜 컬럼의 기본값을 현재 시간으로|

- primary key: id로 주로 설정
- Index commenter_idx: 테이블에서 자주 검색할만 것들에 INDEX를 걸어주면 검색 성능이 빨라진다 (ex: 댓글 이름)
- commenter 컬럼을 오름차순으로 indexing 하겠다
- constraint commenter : commenter에 제약을 두겠다
- FOREGIN KEY (외래키): 어떤 컬럼이 다른 테이블의 컬럼을 참조해서 그 값이 있어야만 등록하게 해줌
- CASCADE SEND NULL NO ACTION
- utf8mb4 이모티콘 포함
- UNIQUE INDEX 같이 사용하게 됨

---

### 5. CRUD 작업하기

**CRUD**: 데이터베이스에서 많이하는 작업 4가지
1. Create
2. Read
3. Update
4. Delete

- INSERT INTO 테이블 (컬럼명들) VALUES (값들)

---

### 6. 시퀄라이즈 사용하기

**시퀄라이즈 ORM**
- SQL 작업을 쉽게 할 수 있도록 도와주는 라이브러리 (js 코드를 sql로 바꿔줌)
- 자바스크립트 문법으로 데이터베이스 조작 가능
- MySQL 외에도 다른 RDB (Maria, Postgre, SQLite, MSSQL)와도 호환됨
- 초기 규모의 프로젝트에 사용 가능

<img src="https://raw.githubusercontent.com/suminb99/2024-1-Node.js-Study/main/%EB%B0%B1%EC%88%98%EB%AF%BC/image/week10/img3.png" width="580" height="250"/>

```JavaScript
const Sequelize = require('sequelize'); // Sequelize: 객체 / 생성자

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

//하나의 노드에서 두개 이상의 MySQL에 연결 가능
const sequelize1 = new Sequelize(config.database, config.username, config.password, config);
const sequelize2 = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
```

<img src="https://raw.githubusercontent.com/suminb99/2024-1-Node.js-Study/main/%EB%B0%B1%EC%88%98%EB%AF%BC/image/week10/img7.png" width="400" height="230"/>

---

### 7. 시퀄라이즈 모델 만들기

- sequelize에서 model == MySQL에서 table
- 기본 틀: static init(sequelize) { modelname.init({....})};
- id 설정 생략해도 기본으로 생성됨
- 자료형 표현에 있어 MySQL과 차이가 있음 (다른 db와도 호환할 수 있어야 하기 때문)
- timestamps: true일 경우 createdAt, updatedAt 자동으로 제공됨
- paranoid: true면 deletedAt 지원

```javascript
..., {
    sequelize,
    timestamps: true, // createdAt, updatedAt 지원
    underscored: false,  // camelcase
    paranoid: true, // 데이터를 저게할 때 deletedAt: true로 만듦 (삭제됐다는 표시) => soft delete, 실제 row 제거 => hard delete
    modelname: 'User',
    tablename: 'users',
    charset: 'utf8',
    collate: 'utf9_general_ci',
}

```

---

### 8. 테이블 관계 이해하기

- 1:N 관계
    - hasMany: 사용자.hasmany(댓글)
        - hasmany => sourcekey
        - `db.User.hasMany(db.Comment, {foreginKey: 'commenter', sourceKey: 'id'});`
    - belongsTo: 댓글.belongsto(사용자)
        - belongsto => targetkey
        - `db.Comment.belongsTo(db.User, {foreginKey: 'commenter', targetKey: 'id'});`

- 1:1 관계
    - ex: 사용자 테이블과 사용자 정보 테이블
    - `db.User.hasOne(db.Info, {foreginKey: 'UserId', sourceKey: 'id'});`
    - `db.Info.belongsTo(db.User, {foreginKey: 'UserId', targetKey: 'id'});`
- 다대다 관계
    - ex: 게시글과 해시태그 테이블
    - DB 특성상 다대다 관계는 중간 테이블이 생김
    - `db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag'});`
    - `db.Hashtag.belongsToMany(db.Post, {through: 'PostHashtag'});`

---

### 9. 시퀄라이저 쿼리 알아보기

Op.(operator)
- gt: > 
- lt: <
- gte: >=
- lte: <=

- [['age', 'desc'], ['createdAt', 'asc']]: 1순위 정렬, 2순위 정렬

```javascript
User.destroy({
    where: {id: {[Op.in]: [1, 3, 5]}} // 1, 3, 5 지우기 
})

User.destroy({
    where: {id: {[Op.ne]: 5}} // 5번 제외 지우기
})
```

### 10. 관계 쿼리 알아보기


--- 

### 11. 시퀄라이즈 실습하기

- npx sequelize db:create (데이터베이스 sequelize 명령어로 만들기)