// 기본 틀=> initiate: 테이블 정보. associate: 테이블 관계
const Sequelize = require("sequelize");

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init(
      //테이블 설정
      {
        //아래 코드가 수정된다고 DB가 수정되지는 않는다
        email: {
          //카톡 로그인은 비어있어도 된다.
          type: Sequelize.STRING(40),
          allowNull: true,
          unique: true,
        },
        nick: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        provider: {
          //사람들이 로컬 또는 카카오 둘 중에 하나만 적게끔 제한을 두는 것
          //이메일로 로그인한 사용자와 카카오로 로그인한 사용자 구분짓게끔
          type: Sequelize.ENUM("local", "kakao"),
          allowNull: false,
          defaultValue: "local",
        },
        snsId: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true, // 자동으로 유저 정보 수정 시간을 기록함
        underscored: false,
        modelName: "User", //자스에서 쓰이는
        tableName: "users", //테이블에서 쓰이는
        paranoid: true, //유저 삭제일-> 회원탈퇴해서 데이터 삭제 후 데이터 복구 부탁할때
        //soft delete
        charset: "utf8",
        collate: "utf8_general_ci", //DB에 어떤 식으로 문자를 저장할지
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.belongsToMany(db.User, {
      //follower
      //n:n 관계
      foreignKey: "followingId",
      as: "Followers", //중간 테이블
      through: "Follow",
    });
    db.User.belongsToMany(db.User, {
      //following
      foreignKey: "followerId",
      as: "Followings",
      through: "Follow",
    });
  }
}

module.exports = User;
