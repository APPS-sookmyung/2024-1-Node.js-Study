// 1. 널 병합 연산자와 옵셔널 체이닝 연산자의 차이점은?
    
//     널 병합 연산자는 null r과 undefined를 구분해서 뒤에 있는 값을 할당하는 연산자이고 옵셔널 체이닝 연산자는 null이나 undefined에 접근하는 경우 에러를 방지해 주는 것으로 역할이 다르다. 
    
// 2. 널 병합 연산자와 옵셔널 체이닝 연산자의 사용 사례는?
    
//     주로 옵셔널 체이닝 연산자를 사용해 null, undifined를 접근해도 오류가 발생하지 않도록 하고 해당 반환값을 널 연산자를 이용해 처리하는 식으로 사용한다. 
    
// 3. 옵셔널 체이닝 연산자 사용 예시 코드 짜기

const c = undefined;
console.log(c?.d); // undefined

// 1. 널 병합 연산자 사용 예시 코드 짜기

const e = null;
const f = e ?? "fff";
console.log(f); // 'fff'
