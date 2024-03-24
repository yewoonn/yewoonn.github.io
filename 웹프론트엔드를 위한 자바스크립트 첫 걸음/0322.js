//[비동기 처리]
//1) 동기 : 하나의 작업이 실행되는 동안은 다른 작업을 동시에 진행하지 않는 방식
// -> 순차적으로 작업이 진행

//스레드 : 프로그램을 작업하는 주체
//멀티 스레드 : 여러 개의 스레드로 사용, but 자바 스크립트에서는 X
//블로킹 방식 : 하나의 작업이 종료된 이후에 다음 작업을 수행할 수 있는 방식

//2) 비동기 : 여러 작업을 동시에 처리, 하나의 스레드에서 동시에 작업 처리
// -> 논블로킹 방식

//setTime() - 비동기 함수,
//매개 변수로 전달 받은 시간 만큼 기다렸다가 콜백 함수 호출

//setTimeout 출력 이전에 종료 출력
setTimeout(()=>{
    console.log("3초만 기다리세요");
},3000);

console.log("종료");

//setTimeout 출력 이후에 종료를 출력하고 싶다면
const work = (callback) => {
    setTimeout(()=>{
        console.log("3초만 기다리세요");
        callback();
    }, 3000);
}


work(() => {
    console.log("종료");
});

//work A,B,C 비동기 처리
const workA = () =>{
    setTimeout(()=>{
        console.log("5초만 기다리세요");
    }, 5000);
}

const workB = () =>{
    setTimeout(()=>{
        console.log("5초만 기다리세요");
    }, 5000);
}

const workC = () =>{
    setTimeout(()=>{
        console.log("10초만 기다리세요");
    }, 10000);
}

//비동기 처리 함수
const workD = () =>{
    setTimeout(()=>{
        console.log("WorkD");
    }, 10000);
}