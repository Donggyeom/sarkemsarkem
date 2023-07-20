# 2023_07_20_React_Lifecycle_useEffect

강의 번호: React
복습: Yes
키워드: Lifecycle, useEffect

### Lifecycle

1. **컴포넌트의 Lifecycle**
    - 페이지에 장착되기도 하고(mount)
    - 가끔 업데이트도 되고(update)
        - update : 다시 렌더링
    - 필요없으면 제거되고(unmount)
2. **useEffect 언제 사용?**
    - useEffect 안에 있는 코드는 html 렌더링 후에 동작함
    - 시간이 오래 걸리는 작업들을 useEffect 안에 적어둠
    - 타이머 장착하는것
    - 서버에서 데이터가져오는 작업
3. **Lifecycle 사용법**
    
    1) useEffect import 함
    
    ```jsx
    import { useEffect } from "react";
    ```
    
    2) update
    
    ```jsx
    let [count, setCount] = useState(0)
    
    <button onClick={()=> {setCount(count+1)}}>버튼</button>
    ```
    
4. **예시 (2초 후에 UI 안보이게 처리하기)**
    - setTimeout( ()=>{ 1초 후 실행할 코드 }, 1000); 사용하기
    
    ```jsx
    useEffect(()=>{
        setTimeout(()=>{setalert(false)}, 2000)
    
      })
    
    let [alert, setalert] = useState(true)
    ```
    
    - **clean up function 응용**
    
    ```jsx
    **1. 타이머 만드는 기능**
    
    useEffect(()=>{
        setTimeout(()=>{setalert(false)}, 2000)
        return ()=>{
          // useEffect 동작 전에 실행됨 (clean up function)
          // 예를들어 타이머를 생성할 때, '기존 타이머는 제거'하는 코드를
          // 여기에 작성함.
        }
      })
    
    **2. 서버로 데이터 요청**
    
    useEffect(()=>{
        let a = setTimeout(()=>{setalert(false)}, 2000)
        return ()=>{
          clearTimeout(a)
       }
    })
    ```
    
5. 정리
    1. 재렌더링마다 코드 실행하고싶을 때
        
        ```jsx
        useEffect(()=>{실행할코드})
        ```
        
    2. 컴포넌트 mount(로드)시 1회만 실행가능
        
        ```jsx
        useEFFECT(()=>{실행할코드}, [])
        ```
        
    3. useEffect 안의 코드 실행 전에 항상 실행되도록
        - 이전작업 지우거나 할 때
        
        ```jsx
        useEffect(()=>{
        	return()=>{
        		실행할코드
        	}
        })
        ```
        
    4. 컴포넌트 unmount(삭제)시 1회 실행
        
        ```jsx
        useEffect(()=>{
        	return()=>{
        		실행할코드
        	}
        }, [])
        ```
        
    5. state1이 변경될 때만 실행가능
        
        ```jsx
        useEffect(()=>{ 
          실행할코드
        }, [state1])
        ```
        
6. 예시 ( input에 숫자 말고 다른걸 입력하면 “그러지마세요”라는 안내메세지 출력하는 법)
    
    ```jsx
    function Detail(){
      let [num, setNum] = useState('')
    
      useEffect(()=>{
        if (isNaN(num) == true){
          alert('그러지마세요')
        }
      }, [num])
    
      return (
        <input onChange((e)=>{ setNum(e.target.value) }) />
      )
    }
    ```
    
    - 'ㄱㄴㄷ' 이렇게 숫자가 없는 문자인지 파악하고 싶으면 여러 방법이 있는데 isNaN()쓰면 됨