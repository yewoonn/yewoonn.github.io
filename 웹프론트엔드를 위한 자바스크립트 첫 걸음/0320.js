//[구조 분해 할당]
//배열이나 객체의 요소 및 프로퍼티들을 분해해, 그 값들을 각각의 변수에 할당하는 표현식
let colors = ["green", "blue", "purple"];

let [c1, c2, c3] = colors; //c1에 green, c2에 purple, ...

//선언 분리 할당
let ca, cb, cc;
[ca, cb, cc] = ["green", "blue", "purple"];

//배열의 길이보다 적은 수를 할당 시, 순서대로 할당

//배열의 길이보다 많은 수를 할당 시, undefined -> 기본값 할당 가능
let cA, cB, cC;
[cA, cB, cC = "yellow" ] = ["green", "blue"];

//두 변수의 값을 바꿀 때
let a = 10;
let b = 5;

[a, b] = [b, a]

//객체의 구조 분해 할당 - 중괄호 사용, 키 값을 기준으로 객체 분해해 할당
let color = {
    c11: "green",
    c22: "purple",
    c33: "yellow"
}

let { c11, c22, c33 } = color; //객체의 키와 같은 값으로

let { c11:color1, c22:color2, c33:color3 } = color; //객체의 키와 다른 이름의 값으로

//[spread와 rest]
//spread : 반복되는 프로퍼티를 한번에

//객체
let toy = {
    type : "bear",
    price : 1500
}

const bluetoy = {
    
    ...toy,
    color : "blue"
}

const yellowtoy = {   
    type : "bear",
    price : 1500,
    color : "yellow"
}

//배열
const rainbow = [...color1, "green", ...color2]

//rest : 특정 부분을 하나의 객체나 배열로 묶는 역할

const bluetoy1 = {
    
    ...toy,
    colorr : "blue"
}

const {type, price, colorr} = bluetoy1;
const {type1, ...rest} = blue //맨 마지막에 작성, type 제외 나머지 값

//함수에서
//여러 매개 변수를 배열로 나타낼 때 유용
const print = (a, b, ...rest)=>{
    console.log(a, b, rest);
}

//함수에서 rest와 spread 사용하기
//rest
const prn = (...rest) => {
    //객체나 배열에서 하나의 객체나 배열로 묶을때, 함수의 매개 변수로 많은 값을 전달 받을 때 
}

//spread
print(...numbers); //객체나 배열에서 중복된 값을 퍼뜨릴 때, 인수로 많은 값을 넘겨주어야 할 때 많이 사용