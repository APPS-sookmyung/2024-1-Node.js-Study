const Sequelize = require("sequelize");
const fs = require("fs");
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
fs.readdirSync(__dirname) // 현재 폴더의 모든 파일을 조회
  .filter((file) => {
    // 숨김 파일, index.js, js 확장자가 아닌 파일 필터링
    //리눅스는 .으로 시작하는 파일들은 숨김 파일임.
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    // 해당 파일의 모델 불러와서 init
    // ( 현재 이 models 폴더 안에는 hashtag, post,user)
    const model = require(path.join(__dirname, file));
    console.log(file, model.name);
    db[model.name] = model; //? 이게 뭐죠
    model.initiate(sequelize);
  });

//해시택, post,user다시 불러옴
Object.keys(db).forEach((modelName) => {
  // inititate 전부 했으니까 associate 호출
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
