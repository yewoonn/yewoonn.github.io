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


//[함수와 지역변수, 외부 변수]
//즉시 실행 함수(IIFE) : 선언되지마자 즉시 실행되는 함수
(function(){
    console.log("즉시실행함수");
})();


//[스코프]
//var는 let과 달리, 같은 이름의 변수를 여러 번 생성 가능 -> 기존에 선언된 뱐수 무시
//var는 let과 달리, 함수 스코프이므로 해당 함수 내에서 사용 가능(let은 블록스코프)
//var 사용 자제

//[호이스팅]
//: 아직 선언되지 않은 함수나 변수들을, 해당 스코프의 맨 위로 끌어 올려 사용하는 작동 방식
//함수 호이스팅 : 함수 정의 구문을 호이스팅
//변수 호이스팅 : 변수의 선언문만 호이스팅(할당문은 호이스팅 되지 않음)
//var가 아닌 let과 const는 변수 호이스팅 불가능 why? 값이 할당되기 전까지 TDZ에 존재
//var는 변수 선언 완료 시 바로 메모리 할당
//TDZ(Temporal Dead Zone) : 일시적인 사각지대로, 변수를 사용하는 것을 허용하지 않는 공간
//>> 호이스팅 사용 자제

//[함수 표현식]
//1) 함수 선언식 - 호이스팅 O
function print() {
    console.log("hello");
}
//2) 함수 표현식 - 호이스팅 X
let print = function(){
    console.log("hello");
};

//화살표 함수 <- 함수 표현식을 간결히
const print = () => {
    console.log("hello");
};

//콜백 함수 : 다른 함수에 매개 변수로 넘겨준 함수
function start(name, callback){
    console.log(`안녕하세요 $(name)입니다.`);
    callback();
}

function finish(){
    console.log("감사");
}

start("han", finish);

//[객체]
//객체 생성
//객체 생성자 방식으로 생성
let person1 = new Object();
//객체 리터럴 방식으로 생성
let person = {
    name: "hong",
    age: 20,
    etc:function() {
        console.log("hello world");
    },
    pet : "cat",
};

//객체 프로퍼티 꺼내기
//1) 점 표기법 person.age
//2) 괄호 표기법 person["age"] -> 문자열로 표현해야, 주로 동적일 때 사용

//객체 프로퍼티 추가
person1.phone="010-2324-2323" //점 표기법
person1["height"] = 140; //괄호 표기법

//객체 프로퍼티 수정
//const로 선언되어도 프로퍼티 수정 가능
//but 객체의 고유ID자체는 변경 불가능

//객체 프로퍼티 삭제
delete person.pet;
delete person[age];

//객체 프로퍼티가 함수일 때
person.print();
person["print"]();
//객체 프로퍼티의 값이 함수 일때 메서드 -> 객체 내부의 값에 접근 가능
//메서드에서 객체 내부의 프로퍼티 접근은 this로
//메서드에서는 function() 함수로 정의해야(화살표 함수에서 this 사용 불가능)

//[배열]
//배열 생성, 타입에 상관없이 넣을 수 있음
//생성자로 배열 생성
let arr = new Array(1,2,3); //3개의 칸에 1,2,3
let arr1 = new Array(3);//3만큼의 크기로 설정
//리터럴 방식, 대괄호로 배열 생성 -> 모두 배열 요소로
let arr2 = [1,3,4];
let arr3 =[1]; 

//배열에 요소 추가 : push(), unshift()
arr.push(4); //마지막에
arr.unshift(0); //앞에

//배열 수정
arr[0] = 5;
//const도 수정 가능, 객체에 해당하는 배열 자체를 수정하는 게 아니라 고유 ID 그대로 

//배열 삭제
arr.pop(); //마지막 요소 삭제
arr.shift(); //앞 요소 삭제

//배열의 길이
arr.length

//[반복문]
//객체를 반복문으로 순회하기 위해서는 배열로 객체를 변경해줘야
//1)Object.keys(person) - 키 값
let newArray = Object.keys(person);

for(let i=0; i<newArray.length;i++){
    let nowKey = newArray[i];
}
//2) Object.values(person) - 키 값 없이 value값을 알 수 있음

//3) Object.entries - 객체를 배열로 변환, ㅏkey와 value 모두 있음
//key:0번 인덱스, value:1번 인덱스

//배열의 모든 값들에 접근할 때
for(let i of arr){
    console.log(i);
}

//객체의 모든 값들에 접근할 때
for(let i in person){
    console.log(`key $(key), value $(person[key])`);
}