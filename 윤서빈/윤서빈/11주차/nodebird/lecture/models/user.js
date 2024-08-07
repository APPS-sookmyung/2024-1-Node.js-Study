const Sequelize = require("sequelize");

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init(
      {
        email: {
          type: Sequelize.STRING(40),
          allowNull: true,
          unique: true, // 이메일 비워져있어도 되고, 있으면 유일.
          // 여기를 수정한다고 해서 db가 수정되지 않음, workbanch 같은 걸로 수정
          //개발 단계에서는 잘 못 만들었으면 테이블 지웠다가 서버 재시작
        },
        nick: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100), // 암호화되면 매우 길어짐
          allowNull: true,
        },
        provider: {
          type: Sequelize.ENUM("local", "kakao"),
          // ENUM : local/kakao 만 로그인 하도록 제한을 두는 것
          allowNull: false,
          defaultValue: "local",
        },
        snsId: {
          type: Sequelize.STRING(30),
          allowNull: true,
          //이메일이 없으면 snsId 있어야함
        },
      },
      {
        sequelize,
        timestamps: true, // createdAt, updateAt (유저 정보 생성일, 마지막 수정일 자동 기록)
        underscored: false,
        modelName: "User", // 자스에서 이름
        tableName: "users", // db에서의 이름
        paranoid: true, // 유저 삭제일 deletedAt, soft delete - 복구 가능
        charset: "utf8mb4",
        //기본은 utf8, 이모티콘까지 저장하고 싶으면 utf8mb4
        collate: "utf8mb4_general_ci", //저장된 문자열을 어떻게 정렬할지
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.belongsToMany(db.User, {
      //팔로워
      foreignKey: "followingId",
      as: "Followers",
      through: "Follow",
    });
    db.User.belongsToMany(db.User, {
      //팔로잉
      foreignKey: "followerId",
      as: "Followings",
      through: "Follow",
    });
  }
}

module.exports = User;
