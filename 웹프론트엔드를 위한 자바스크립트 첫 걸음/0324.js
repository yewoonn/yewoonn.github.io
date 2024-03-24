//[프로미스 객체]_다시 복습
//비동기 함수의 결과값을 콜백 함수 안에 콜백 함수로 전달
//순서를 알기 쉽지만, 가독성 없음 - 콜백 지옥
//promise 객체로 해결
const workA = (value, callback)=>{
    setTimeout(()=>{
        callback(value);
    }, 5000);

}

const workB = (value, callback)=>{
    setTimeout(()=>{
        callback(value);
    }, 3000);

}

const workC = (value, callback)=>{
    setTimeout(()=>{
        callback(value);
    }, 10000);

}

const workD = (value, callback)=>{
    callback(value);
}


workA("workA",(res)=>{
    console.log(res)
})

workB("workB",(res)=>{
    console.log(res)
})

workC("workC",(res)=>{
    console.log(res)
})

workD("workD",(res)=>{
    console.log(res)
})

//실행함수, resoleve(비동기처리 성공 시 호출)와 reject(비동기 처리 실패 시 호출) 콜백 함수를 가짐
//promise 생성과 동시에 실행
//내부 프로퍼티 : state, result
//초기, state :pending(대기), result(undefined)
//resolve 호출, state :fulfilled(성공), result(value)
//reject 호출, state : rejected(실패), result(error)
//한번 변경된 상태에서는 더 이상 처리되지 않음
//처리가 끝난 상태에서 resolve와 reject 호출 시 무시된다.
const executor = (resolve, reject)=>{
    setTimeout(()=> {
        resolve("성공");
    }, 3000)
}

//실행 함수(비동기 함수)를 반드시 전달해주어야 한다.
const promise = new Promise(executor);
promise
.then((res)=>{ //작업이 성공했을 때 then
    console.log(res);
})

.catch((err)=>{ //작업이 실패했을 때 catch
    console.log(err);

})

//promise 객체를 활용한 비동기 처리
const worka=(value)=>{
    const promise = new Promise((resove, reject));
    setTimeout(()=>{
        resolve(value+5);
    }, 5000)
    }
    return promise;
    

const workb=(value)=>{
    const promise = new Promise((resolve, reject));
    setTimeout(()=>{
        resolve(value-3);
    }, 3000)
    }
    return promise;

const workc=(value)=>{
    const promise = new Promise((resolve, reject));
    setTimeout(()=>{
        resolve(value+10);
    }, 10000)
    }
    return promise;

/* worka(10).then((resA)=>{
    console.log(`1. ${resA}`);
    workb(resA).then((resB)=>{
        console.log(`2. ${resB}`)
        workc(resB).then((resC)=>{
            console.log(`3. ${resC}`)
        })
    })
}) */


//promise chaining(연속으로 then을 사용해 콜백 지옥 제거)
worka(10).then((resA)=>{
    console.log(`1. ${resA}`);
    return workb(resA);
})
.then((resB)=>{
    console.log(`2. ${resB}`);
    return workc(resB);
})
.then((resC)=>{
    console.log(`3. ${resC}`);
})

//[async와 await]
//1. async 키워드
//: 자동으로 promise 객체를 반환함과 동시에 return문 옆에 작성한 값이 resolve의 결과 값으로 설정
const start = async() =>{
    return "대기";
};

start().then((res)=>{
    console.log(res);
})

//2. await 키워드
//async 함수의 내부에서만 사용 가능
//: 특정 함수에 앞에 작성되며 then 메서드를 대신해서 사용
//해당 promise 객체가 처리 되기 전까지 이후의 코드가 실행되지 않음

const start2 = async() =>{
    await delay(2000);
    console.log("대기");
};

start();

//error처리
//try~catch문을 통해 에러 처리
const start3 = async() =>{
    try{
        await delay(2000);
        console.log("대기");
    } catch(error){
        console.log(error);
    }
    
};

//[API 호출]
//API : 애플리케이션 프로그래밍 인터페이스, 컴퓨터나 프로그램 사이의 연결
//클라이언트 - 서버 - 데이터 베이스
// 원하는 데이터 요청   ->    요청 받은 데이터 찾기
// 알맞은 데이터 전달   <-    찾은 데이터 꺼내기
//API는 클라이언트와 서버 사이의 연결 : 데이터 요청 및 전달하는 과정

//API 호출
//JSON : 자바스크립트 객체 표기법
const response = fetch("https://jsonplaceholder.typicode.com/posts")
    //fetch를 통해 API 성공 객체를 전달 받음, promise 객체 처리하는 비동기적 함수
    .then((res)=>console.log(res))
    .catch((error) => console.log(error));

console.log(response);

const getData = async ()=>{
    try{
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await res.json();
        console.log(data);

    } catch(error){
        console.log(console.log(error));
    }
    
}

getData();