# React

작성일시: 2023년 7월 16일 오후 7:37

# 코딩애플

### ****React 리액트 기초부터 쇼핑몰 프로젝트까지!****

- React 파일 생성
    
    npx create-react-app 파일명
    
    npm start
    
    [[리액트 초보 따라하기 / To do] 1. create-react-app으로 프로젝트 생성하기](https://codingbroker.tistory.com/3)
    
- JSX문법 3개
    - class X, className O
    - 데이터 바인딩: 변수를 넣을 땐 {중괄호}
    - style 속성 사용 가능
        - style = { {스타일명: ‘값’}}. ‘ ‘ 하면 안 됨
    - 뺄셈 기호 거의 없음! font-size → fontSize
    - 
- 변수
    - return() 안에는 병렬로 태그 2개 이상 기입 금지
    - 자료를 잠깐 저장할 때는 let, var 등 변수 사용 가능
    그러나 state 써도 됨.
        
        ```jsx
        import {useState} from 'react';
        let [a작명, b작명] = useState(’보관할 자료’);
        # a는 뒤에 자료를 그대로 나타내줌
        b는 state의 변경을 도와주는 함수
        ```
        
        - array자료처럼 생겼지만 distructuring임
        
        ![Untitled](React%20ecdfa19c95ee4c359b5dc03e0228807b/Untitled.png)
        
        - state 쓰는 이유: 일반 변수는 갑자기 변경되면 html에 저장해야 자동으로 반영됨. 그러나 state는 갑자기 변경되어도 state 쓰던 html은 자동 재렌더링됨
        - 그러니까 변동 시 자동으로 html에 반영되게 만들고 싶으면 state 쓰기! 평생 안 바뀔 것 같으면 안 써도 됨
        
- 버튼 기능 개발 + 리액트 state 변경
    
    ```jsx
    onClick = {함수이름}
    
    function App(){
      function 함수임(){
        console.log(1)
      }
      return (
         <div onClick={함수임}> 안녕하세요 </div>
      )
    }
    ```
    
    1. Click이 대문자인거
    2. {} 중괄호 사용하는거
    3. 그냥 코드가 아니라 함수를 넣어야 잘 동작한다는 거
    - state 변경하는 법
    
    ```jsx
    function App(){
      
      let [ 따봉, 따봉변경 ] = useState(0);
      return (
          <h4> { 글제목[0] } <span onClick={ ()=>{ 따봉변경(따봉 + 1) } } >👍</span> { 따봉 }</h4>
      )
    }
    ```
    
    1. 클릭 시 뭔가 실행하고 싶으면 onClick={함수} 이렇게 이벤트 핸들러를 달아서 사용합니다.
    2. state를 변경하시려면 state 변경 함수를 꼭 이용하십시오.
    
    state변경 함수는 ( ) 안에 입력한 걸로 기존 state를 갈아치워 줍니다.
    
- array, object state 변경하는 법
    - 다룰 때 원본 데이터는 저장해 두는 게 좋음. 변경하려면 사본 만들어라
    - array 어쩌구 그냥 포인터라고 생각 reference data
    
    […어쩌구] → …이 화살표를 바꿔달라는 뜻임!
    
    ![Untitled](React%20ecdfa19c95ee4c359b5dc03e0228807b/Untitled%201.png)
    
- Component : 많은 div들을 한 단어로 줄이고 싶으면
    
    방법
    
    1. function을 이용해서 함수를 하나 만들어주고 작명합니다.
    
    2. 그 함수 안에 return () 안에 축약을 원하는 HTML을 담으면 됩니다.
    
    3. 그럼 원하는 곳에서 **<함수명></함수명>** 사용하면 아까 축약한 HTML이 등장합니다.
    
    ```jsx
    function App (){
      return (
        <div>
          (생략)
          <Modal></Modal>
        </div>
      )
    }
    
    function Modal(){
      return (
        <div className="modal">
          <h4>제목</h4>
          <p>날짜</p>
          <p>상세내용</p>
        </div>
      )
    }
    ```
    
    컴포넌트 생성 시 주의
    
    1. component 작명할 땐 영어대문자로 보통 작명합니다.
    2. return () 안엔 html 태그들이 평행하게 여러개 들어갈 수 없습니다.
    3. function App(){} 내부에서 만들면 안됩니다.
    
    왜냐면 function App(){} 이것도 다시보니 컴포넌트 생성문법이죠?
    
    component 안에 component 를 만들진 않습니다.
    
    1. <컴포넌트></컴포넌트> 이렇게 써도 되고 <컴포넌트/> 이렇게 써도 됩니다.
    
    컴포넌트 사용해야 되는 경우
    
    기준은 없습니다만 관습적으로 어떤 부분을 주로 Component화 하냐면
    
    - 사이트에 반복해서 출현하는 HTML 덩어리들은 Component로 만들면 좋습니다.
    - 내용이 매우 자주 변경될 것 같은 HTML 부분을 잘라서 Component로 만들면 좋습니다.
    - 다른 페이지를 만들고 싶다면 그 페이지의 HTML 내용을 하나의 Component로 만드는게 좋습니다.
    - 또는 다른 팀원과 협업할 때 웹페이지를 Component 단위로 나눠서 작업을 분배하기도 합니다..
    
    컴포넌트 단점
    
    state 안 됨
    
    자바스크립트에선 한 function 안에 있는 변수를 다른 function에서 맘대로 쓸 수 없어서 그렇습니다. props라는 문법을 이용해 state를 <Modal>까지 전해줘야 비로소 사용가능합니다.
    
- 리액트 환경에서 동적인 UI 만드는 법 (모달창만들기)
    - 동적 UI 만들기
        
        **1. html css로 미리 UI 디자인을 다 해놓고**
        
        **2. UI의 현재 상태를 state로 저장해두고**
        
        ```jsx
        let [modal, setModal] = useState(false);
        ```
        
        **3. state에 따라서 UI가 어떻게 보일지 조건문 등으로 작성**
        
    - 삼항연산자
        
        ```jsx
         조건식 ? 조건식 참일 때 실행할 코드 : 조건식 거짓일 때 실행할 코드
        ```
        
        ```jsx
        function App (){
        
          let [modal, setModal] = useState(false);
          return (
            <div className="app">
              (생략)
              {
                modal == true ? <Modal></Modal> : null
              }
            </div>
          )
        }
        ```
        
    - 글 제목 누르면 modal을 on/off처럼 true/false 왓다갓다
    
    ```jsx
    function App (){
    
      let [modal, setModal] = useState(false);
      return (
        <div>
          (생략)
          <button onClick={ ()=>{ setModal(!modal) } }> {글제목[0]} </button>
          { 
             modal == true ? <Modal></Modal> : null
          }
        </div>
      )
    }
    ```
    
- map: 많은 div들을 반복문으로 줄이고 싶은 충동이 들 때
    - map()
        - **기능 1.** array에 들어있는 자료갯수만큼 그 안에 있는 코드를 반복실행해줍니다.
        - **기능 2.** 콜백함수에 파라미터 아무렇게나 작명하면 그 파라미터는 어레이 안에 있던 모든 자료를 하나씩 출력해줍니다.
        - **기능3.** return 오른쪽에 뭐 적으면 array로 담아줍니다. 그리고 map() 쓴 자리에 남겨줍니다.
    - 각각 다른 글제목 반복 생성
    
    ```jsx
    function App (){
      return (
        <div>
          (생략)
          { 
            글제목.map(function(a){
              return (
              <div className="list">
                <h4>{ a }</h4>
                <p>2월 18일 발행</p>
              </div> )
            }) 
          }
        </div>
      )
    }
    ```
    
    - 좋아요 버튼 개별적으로 증가
    
    ```jsx
    let [따봉, 따봉변경] = useState([0,0,0]);
    <h4> 
      { 글제목[i] } 
       <span onClick={()=>{ 
          let copy = [...따봉];
          copy[i] = copy[i] + 1;
          따봉변경(copy)  
       }}>👍</span> {따봉[i]} 
    </h4>
    ```
    
- 자식이 부모의 state 가져다쓰고 싶을 때는 props
    - 모든 변수는 함수 탈출 불가!
    - 자식 컴포넌트가 부모 컴포넌트에 있던 state를 쓰고 싶으면 그냥 쓰면 안되고 **props로 전송해서** 써야합니다.
    - **props로 부모 -> 자식 state 전송하는 법**
        
        **1. 자식컴포넌트 사용하는 곳에 가서 <자식컴포넌트 작명={state이름} />**
        
        **2. 자식컴포넌트 만드는 function으로 가서 props라는 파라미터 등록 후 props.작명 사용**
        
        ![Untitled](React%20ecdfa19c95ee4c359b5dc03e0228807b/Untitled%202.png)
        
    - 참고
        
        (참고1) props는 **<Modal 이런거={이런거}  저런거={저런거}>** 이렇게 10개 100개 1000개 무한히 전송이 가능합니다.
        
        (참고2) 꼭 state만 전송할 수 있는건 아닙니다.
        
        ---
        
        props.color 이런 식으로 구멍을 뚫어놓으면 이제 컴포넌트 사용할 때
        
        <Modal color={'skyblue'} /> 이러면 하늘색 모달창이 생성됩니다.
        
        <Modal color={'orange'} /> 이러면 오렌지색 모달창이 생성됩니다.
        
    
    ```jsx
    function Modal(props){
      return (
        <div className="modal" style={{ background : props.color }}>
          <h4>{ props.글제목[0] }</h4>
          <p>날짜</p>
          <p>상세내용</p>
        </div>
      )
    }
    ```
    
- props를 응용한 상세페이지 만들기
    
    동적인 UI
    
    1. html css로 미리 디자인해놓고
    2. 현재 UI의 상태를 state로 만들어두고
    3. state 종류에 따라서 UI가 어떻게 보일지 작성
    
    ```jsx
    function App (){
      return (
        <div>
          { 
            글제목.map(function(a, i){
              return (
              <div className="list">
                <h4 onClick={()=>{ setModal(true); setTitle(i); }}>{ 글제목[i] }</h4>
                <p>2월 18일 발행</p>
              </div> )
            }) 
          }
        </div>
      )
    }
    ```
    
    state는 state를 사용하는 컴포넌트 중 최고 부모에 만들어 놓아야 함. 모르면 Apps에 
    
- input 1 : 사용자가 입력한 글 다루기
    - 이벤트 핸들러 매우 많음! 약 30개 필요할 때마다 찾아서 쓰기
    - 상위 html로 퍼지는 이벤트 버블링을 막고 싶으면
        
        e.target 이러면 현재 이벤트가 발생한 곳을 알려주고
        
        e.preventDefault() 이러면 이벤트 기본 동작을 막아주고
        
        e.stopPropagation() 이러면 이벤트 버블링도 막아줍니다
        
    
    ```jsx
    function App (){
    
      let [입력값, 입력값변경] = useState('');
      return (
        <input onChange={(e)=>{ 
          입력값변경(e.target.value) 
          console.log(입력값)
        }} />
      )
    }
    ```
    
- input 다루기 2 : 블로그 글발행 기능 만들기
    
    ```jsx
    function App (){
      let [글제목, 글제목변경] = useState(['남자코트추천', '강남우동맛집', '파이썬독학']);
      let [입력값, 입력값변경] = useState('');
      return (
        <div>
          <input onChange={ (e)=>{ 입력값변경(e.target.value) } } />
          <button onClick={()=>{ 
            let copy = [...글제목];
            copy.unshift(입력값);
            글제목변경(copy)
          }}>글발행</button>
        </div>
      )
    }
    ```
    
    1. 버튼누르면 일단 글제목state를 카피부터했습니다. array 형태의 state 조작은 우선 카피부터하면 된댔습니다.
    2. 카피한거에 unshift(입력값) 해줬는데 이게 뭐냐면 array자료 맨 앞에 자료추가하는 문법입니다.
    3. 그리고 state변경함수 사용했습니다.
    
    ```jsx
    function App (){
      let [글제목, 글제목변경] = useState(['남자코트추천', '강남우동맛집', '파이썬독학']);
      let [입력값, 입력값변경] = useState('');
      return ( 
        <div>
        { 
         글제목.map(function(a, i){
            return (
              <div className="list">
                <h4>{ 글제목[i] }</h4>
                <p>2월 18일 발행</p>
                <button onClick={()=>{ 
                  let copy = [...글제목];
                  copy.splice(i, 1);
                  글제목변경(copy);
               }}>삭제</button>
              </div> 
            )
         }) 
        }  
      </div>
      )
    }
    ```
    
    1. 일단 버튼누르면 글제목state 사본부터 만들었습니다.
    2. 글제목state에서 x번째 데이터를 삭제하고 싶으면 splice(x, 1) 쓰면 된댔습니다.
- class를 이용한 옛날 React 문법
    
    요즘은 다 function으로 씀
    
    ```jsx
    class Modal2 extends React.Component {
      constructor(props){
        super(props);
        this.state = {
          name : 'kim',
          age : 20
        }
      }
    
      render(){
        return (
          <div>안녕 { this.props.프롭스이름 }</div>
        )
      }
    
    }
    ```
    
- 만든 리액트 사이트 build & Github Pages로 배포해보기
    1. 미리보기 띄워 볼 때 콘솔, 터미널에 에러 안 나는지 확인
        1. 하위 경로에 배포하고 싶다면 프로젝트에 따로 설정 필요
            
            ```jsx
            #package.json
            "homepage": "http://codingapple.com/blog",
            ```
            
    2. npm run build
    3. github pages로  (html/css/js 파일을 무료로 호스팅해 줌)
        1. 레포 생성하는데 생성 시 [아이디.github.io](http://아이디.github.io) 라고 입력해야 함
        2. repo에 전부 업로드
    4. 여러 개도 호스팅 가능
        1. 위에서 만든 [github.io](http://github.io) 그대로 둬야 함
        2. 레포 새로 생성하고 업로드, 확인
        3. repo setting 들어가서 github pages
        4. source에서 none이 아니라 main으로 바꾸고 저장
        5. **[아이디.github.io/repository이름/](http://아이디.github.io/repository이름/) 혹은 아이디.github.io/repository이름/html파일명.html**