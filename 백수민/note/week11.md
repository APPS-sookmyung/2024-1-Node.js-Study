## < 섹션 6. MongoDB >

### 1. 몽고디비 설치하기

1. brew services start mongodb-community@7.0
2. brew services restart mongodb-community@7.0
3. brew services stop mongodb-community@7.0
4. mongosh >> test
5. mongosh admin -u root -p 비번 >> admin

<img src="https://raw.githubusercontent.com/suminb99/2024-1-Node.js-Study/main/%EB%B0%B1%EC%88%98%EB%AF%BC/image/week11/img1.png" width="450" height="250"/>

---

### 2. 데이터베이스와 컬렉션 만들기

#### mongosh shell 명령어:

- `use nodejs : nodejs라는 DB가 만들어짐`
- `show dbs : 생성된 DB를 보여주는 명령어 `
-  DB안에 실제 데이터를 적어도 하나라도 넣어야 제대로 생성됨

<img src="https://raw.githubusercontent.com/suminb99/2024-1-Node.js-Study/main/%EB%B0%B1%EC%88%98%EB%AF%BC/image/week11/img2.png" width="320" height="280"/>

#### 컬렉션 (collection)
- MySQL의 테이블에 해당됨
- 다큐먼트는 MySQL의 ROW로 비슷한 개념
- 따로 생성할 필요 X: 다큐먼트를 넣는 순간 자동으로 생성됨
- BUT, 직접 생성하는 명령어 있음 : `db.createCollection('...')`

--- 

### 3. CRUD 작업하기

**1. CREATE**
- Compass보다 mongoDB 쿼리에 익숙에 지는 것이 좋음 (compass & workbench 자제)
- **insertOne**: document 하나 추가하기
- **insertMany**: document 여러개 추가하기
- ObjectId: 
    - MySQL의 id, primary key와 같음
    - 안에 날짜 정보를 담고 있기 때문에 정렬이 됨! (문자열 안에 정보가 숨겨져 있음)
    - MySQL의 primary key처럼 사용하면 됨 
    - MySQL에서는 foreign key의 유효성을 검증해 주지만 mongoDB는 안해준다 (그러므로 오타에 취약)

<img src="https://raw.githubusercontent.com/suminb99/2024-1-Node.js-Study/main/%EB%B0%B1%EC%88%98%EB%AF%BC/image/week11/img3.png" width="600" height="150"/>

<img src="https://raw.githubusercontent.com/suminb99/2024-1-Node.js-Study/main/%EB%B0%B1%EC%88%98%EB%AF%BC/image/week11/img4.png" width="580" height="250"/>

**2. READ**
- `db.users.find({}); find로 모두 조회`
- `db.users.findOne({}); findOne으로 하나만 조회`
- 두번째 인수로 조회할 필드 선택 가능: 1은 추가, 0은 제외
    - `db.users.find({}, { _id: 0, name: 1, married: 1 });` 
- sort: 1은 ascending, -1은 descending (.sort({ age: -1 }))
- limit: 조회할 다큐먼트 개수 제한 (.limt(1))
- skip: 건너뛸 다큐너트 개수 제공 (.skip(1))

<img src="https://raw.githubusercontent.com/suminb99/2024-1-Node.js-Study/main/%EB%B0%B1%EC%88%98%EB%AF%BC/image/week11/img6.png" width="450" height="300"/>

**3. UPDATE**
- 첫 번째 인수로 수정 대상을 찾고, 두 번째 인수로 수정 내용을 제공
- 수정 내용에 $set을 붙이지 않으면 document 전체가 대체되므로 주의!!!
- `db.users.updateOne({ name: 'James' }, { $set: { comment: '안녕하세요. 이 필드를 바꿔보겠습니다!' } });`
- `updateOne(조건, 수정할 내용, { upsert: true })` : upsert: 조건에 맞는 document가 있으면 수정 없으면 하나 생성하라

<img src="https://raw.githubusercontent.com/suminb99/2024-1-Node.js-Study/main/%EB%B0%B1%EC%88%98%EB%AF%BC/image/week11/img7.png" width="630" height="120"/>

**4. DELETE**
- 첫 번째 인수로 삭제할 대상 조건 제공
- .**deleteOne**({ name: 'James' });
- 성공시 삭제된 개수가 반환됨

--- 

### 4. 몽구스 사용하기

**Mongoose**: 몽고디비 작업을 쉽게 할 수 있도록 도와주는 라이브러리
- ODM (Object Document Mapping): 객체와 다큐먼트를 매핑 (1대1 짝지음)
- 몽고디비에 없어 불편한 기능들을 몽구스가 보완
- 테이블과 유사한 기능, JOIN 기능 추가
- sequelize는 model, mongoose는 schema

--- 

### 5. 몽구스 스키마 사용하기

- schemas 폴더 안에 작성
- MySQL의 테이블처럼 정해진 데이터만 들어갈 수 있게 강제함
    - type: 자료형 (JS data type을 사용함)
    - require: 필수 여부
    - default: 기본값
    - unique: 고유 여부
- 몽구스의 populate는 JS로 하기 때문에 속도가 느림

```JavaScript
{
commenter: {
    type: ObjectId,
    required: true,
    ref: 'User',
},
comment: { ... },
createdAt: { ... },
}
```
- 데이터의 중복을 피할 수 있음 BUT, JOIN하는데 비용이 많이 든다

```JavaScript
{
_id: 123djafnidjnjafdsl,
commenter: {
    name: 'Zero',
    age: '24',
    married: false,
    comment: '안녕하세요. 제로입니다.'
},
comment: { ... },
createdAt: { ... },
}
```
- Nested Object의 방식을 취할 경우 (객체 안에 객체 넣기), 데이터 접근이 쉬워진다, BUT, 데이터 수정 또는 삭제시 더 번거로워진다

--- 

### 6. 몽구스 실전 프로젝트

- 실습코드 확인!
- 코드는 같아도 데이터베이스가 점점 더 쌓일수록 응답속도가 느려짐
- 아래와 같은 라우터 조심! (find는 모든 객체 조회)
- DB 성능 최적화 공부 따로 필요함

```JavaScript
router.route('/')
  .get(async (req, res, next) => {
    try {
      const users = await User.find({}); // *이 부분* 데이터가 많아질수록 서비스를 느리게 만듦
      res.json(users);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
```
