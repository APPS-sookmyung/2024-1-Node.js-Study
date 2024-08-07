const Sequelize = require("sequelize");
const fs = require("fs"); //파일들을 읽는 모듈
const path = require("path");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;

const basename = path.basename(__filename); //index.js
fs.readdirSync(__dirname) // 현재 폴더의 모든 파일을 조회 (모델들을 읽는 것)
  .filter((file) => {
    //index.js 는 모델이 아니기 때문에 제외해야함
    // 숨김 파일, index.js, js 확장자가 아닌 파일 필터링
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    // 해당 파일의 모델 불러와서 init
    const model = require(path.join(__dirname, file));
    console.log(file, model.name); //제대로 됐는지 확인
    db[model.name] = model;
    model.initiate(sequelize);
    //모든 파일들을 불러와서 db에 넣고 initiate 호출해줌
  });

Object.keys(db).forEach((modelName) => {
  // associate 호출
  if (db[modelName].associate) {
    db[modelName].associate(db);
  } // initiate 전부하고 associate를 해주어야함 -> 같이 위에 넣어주면 안됨
});

module.exports = db;
