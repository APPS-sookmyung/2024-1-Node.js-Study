//사용자 객체 정의
const userWithAddress = {
  address: {
    city: "Seoul",
  },
};

const userWithoutAddress = {
  //주소 정보가 없는 경우
};

//옵셔널 체이닝 연산자를 사용하여 사용자의 도시 정보에 안전하게 접근
const city1 = userWithAddress.address?.city;
if (city1 !== undefined) {
  console.log("사용자의 도시 정보:", city1);
} else {
  console.log("사용자의 주소 정보가 없습니다.");
}

const city2 = userWithoutAddress.address?.city;
if (city2 !== undefined) {
  console.log("사용자의 도시 정보:", city2);
} else {
  console.log("사용자의 주소 정보가 없습니다.");
}
