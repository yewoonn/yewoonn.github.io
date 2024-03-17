//0317 강의 요약

//[변수와 상수]
//변수의 설정 - let 사용, 자료형 선언 불필요
let color = "skyblue"
color = "yellow"

console.log(color);

let isCatOrDog; //카멜 표기법
console.log(typeof color); //자료형 확인 가능, 동적 타입 언어(값에 따라 자료형 변화)

//상수의 설정 - const 사용, 값 변경 불가능
const NAME = "Yewon"

//[자료형과 형 변환]
//원시 타입 자료형 : 한번에 하나의 값만을 가짐
//비원시 타입 자료형 : 한번에 여러 개의 값을 가짐

//정수형
let number = 20;
number = Infinity; //무한
number = NaN; //부정확한 연산

//문자열
let name = "Han";
let intro = `제 이름은 $(name)입니다.`; //역 따옴표, templete literal

console.log(intro);

//boolean형

//null형
//알 수 없는 값을 사용할 때

//형 변환
//자동 형변환
//곱하기 나누기 빼기 : 문자열을 숫자로
//더하기 : 숫자를 문자열로

//[자바스크립트의 연산자]
//비교 연산자
//=== : 자료형까지, == : 오직 값만을 비교
//!== : 자료형까지, != :
//연결 연산자 +
//null 변환 연산자
let num;
num = num ?? 20;
//num이 undefine이거나 null일 때 20 대입