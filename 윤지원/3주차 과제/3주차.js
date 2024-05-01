/*1. 널 병합 연산자는 ||연산자 대용으로, 0, false, Nan, null값 중에 널과 undefined 값만 따로 구분한다 */
/*2. 널과 undefined, 0을 구분하여 케이스 변수/함수에 사용할때 활용한다.
옵셔널 체이닝- 프로퍼티가 없는 중첩 객체를 에러 없이 안전하게 접근하는 데 사용한다. */
/*널병합*/
const c = 0;
const d = c ?? 3;
console.log(d); //0; 즉 안 넘어가는 걸 확인가능

const e = null;
const f = e ?? 3;
console.log(f); // 결과 3, 즉 뒤로 넘어감

/* 반면 옵셔널 체이닝 연산자는 null이나 undefined 의 속성을 조회하는 경우 에러가 발생하는 걸 막는다*/
try {
  c.f();
} catch (e) {
  console.error(e); //c에러 남
}
c?.f(); //문제없음 마찬가지로 c[0], c?.[0]도 문제없음
