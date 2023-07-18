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

---

- Bootstrap
    
    ```jsx
    npm install react-bootstrap bootstrap
    
    App.js에 아래 코드 하든가
    import 'bootstrap/dist/css/bootstrap.min.css';
    
    index.html의 head에 아래 코드 넣든가
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
      crossorigin="anonymous"
    />
    ```
    
    그리고 사용할 컴포넌트 import 하기
    
    ```jsx
    import {Button, Navbar, Container, Nav} from 'react-bootstrap';
    ```
    
- 이미지 넣기 + public 폴더 이용
    
    CSS에서 하기
    
    ```jsx
    #app.css
    .main-bg{
      height: 300px;
      background-image: url('./cat.jpg'); #src 안에 있는 거 넣을땐 ./
      background-size: cover;
      background-position: center;
    }
    ```
    
    JS에서 하기
    
    ```jsx
    import './App.css';
    import 작명 from './img/bg.png';
    
    하고 div태그 안에서
    style={{backgroundImage: 'url('+작명+')'}}
    ```
    
    public에 넣어서도 가능함! 압축 안 되기 때문에. src는 다 압축돼서 이름 바뀜
    
    public에 있는 파일 쓸 때는 그냥 경로만 써 주면 됨 import같은 거 필요x
    
    발행 시에 주의해 줘야 됨 싫으면 아래 코드처럼
    
    ```jsx
    <img src={process.env.PUBLIC_URL + '/logo192.png'} />
    ```
    
    ---
    
- 코드가 길어지면 import export
    
    ```jsx
    data.js 생성
    
    let a = 10;
    export default a
    
    여러개 하고 싶으면
    export {a,b}
    ```
    
    ```jsx
    App.js
    
    import 작명 from './data.js';
    import {a,b} from './data.js'; (export default 안 했을 때 -> 작명 불가)
    ```
    
    컴포넌트, 함수 등도 export 가능함
    
    - data로 해보기
    
    ```jsx
    let data = 위에있던 긴 array 자료;
    export default data
    ```
    
    ```jsx
    import data from './data.js';
    
    function App(){
      let [shoes] = useState(data);
    
    }
    ```
    
    ```jsx
    <div className="col-md-4">
                <img src="https://codingapple1.github.io/shop/shoes1.jpg" width="80%" />
                <h4>{ shoes[0].title }</h4>
                <p>{ shoes[0].price }</p>
              </div>
    ```
    
- Card 컴포넌트 만들기
    - 컴포넌트 만들기
    
    ```jsx
    <Card/>
    
    function Card(){
      return (
        <div className="col-md-4">
          <img src="https://codingapple1.github.io/shop/shoes1.jpg" width="80%" />
          <h4>상품명</h4>
          <p>상품정보</p>
        </div>
      )
    }
    ```
    
    - 데이터 다시 꽂기
    
    ```jsx
    (function App 내부)
    
    <Card shoes={shoes[0]} i={1} />
    <Card shoes={shoes[1]} i={2} />
    <Card shoes={shoes[2]} i={3} />
    
    function Card(props){
      return (
        <div className="col-md-4">
          <img src={'https://codingapple1.github.io/shop/shoes' + props.i + '.jpg'} width="80%" />
          <h4>{ props.shoes.title }</h4>
          <p>{ props.shoes.price }</p>
        </div>
      )
    }
    ```
    
- 라우터: 기본 라우팅
    - 리액트는 single page → index,js만 사용함
    
    ```jsx
    npm install react-router-dom@6
    설치한 다음에
    
    index.js
    import { BrowserRouter } from "react-router-dom";
    
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
          <BrowserRouter>
            <App />
          </BrowserRouter>
      </React.StrictMode>
    );
    ```
    
    1. 우선 상단에서 여러가지 컴포넌트를 import 해오고
    2. <Routes> 만들고 그 안에 <Route>를 작성합니다.
    3. <Route path="/url경로" element={ <보여줄html> } /> 이렇게 작성하면 됩니다.
    
    ```jsx
    (App.js)
    
    import { Routes, Route, Link } from 'react-router-dom'
    
    function App(){
      return (
        (생략)
        <Routes>
          <Route path="/detail" element={ <div>상세페이지임</div> } />
          <Route path="/about" element={ <div>어바웃페이지임</div> } />
        </Routes>
      )
    }
    ```
    
    ```jsx
    메인 페이지
    <Route path="/" element={ <div>메인페이지에서 보여줄거</div> } />
    ```
    
    ```jsx
    메인 페이지 접속 시에 상품 목록 보여주기
    <Route path="/" element={ 
      <>
       <div className="main-bg"></div>
       <div className="container">
         <div className="row">
           { shoes.map((a, i)=>{
             return <Card shoes={shoes[i]} i={i} ></Card>
            })}
          </div>
        </div> 
      </>
    } />
    ```
    
    ```jsx
    페이지 이동
    react-router-dom에서 Link 컴포넌트 import 해오고
    
    <Link to="/">홈</Link>
    <Link to="/detail">상세페이지</Link>
    ```
    
- 라우터: navigate, nested routes, outlet
    - src/routes/Detail.js 만들어서 컴포넌트 만들었음
    
    ```jsx
    function Detail(){
      return (
        저번강의에서 준 html 코드
      )
    }
    
    export default Detail
    ```
    
    ```jsx
    import Detail from './routes/Detail.js'
    
    function App(){
      return (
        (생략)
        <Route path="/detail" element={ <Detail/> } />
      )
    }
    ```
    
    - 폴더 구조
    
    비슷한 .js 파일끼리 한 폴더에 묶어놓으면 그냥 그게 좋은 폴더구조
    
    컴포넌트 역할하는 js 파일은 components 폴더에 묶고
    
    페이지 역할하는 js 파일은 routes 아니면 pages 폴더에 묶고
    
    자주 쓰는 함수가 들어있는 js 파일은 utils 폴더에 묶고
    
    ```jsx
    import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom'
    ```
    
    - useNavigate()
        - 페이지 이동 기능
        - Link 안 쓰고 싶을 때
        - navigate(2) 숫자넣으면 앞으로가기, 뒤로가기 기능개발도 가능합니다.
            - 1 넣으면 뒤로 1번 가기
            - 2 넣으면 앞으로 2번 가기 기능입니다.
        
        ```jsx
        function App(){
          let navigate = useNavigate()
          
          return (
            (생략)
            <button onClick={()=>{ navigate('/detail') }}>이동버튼</button>
          )
        }
        ```
        
    - 404 페이지 만들기
    
    ```jsx
    <Route path="*" element={ <div>없는페이지임</div> } />
    ```
    
    - nested routes
        - 서브경로 만들기
        - 라우터 안에 라우터
        
        ```jsx
        <Route path="/about" element={ <About/> } >  
          <Route path="member" element={ <div>멤버들</div> } />
          <Route path="location" element={ <div>회사위치</div> } />
        </Route>
        ```
        
    - Outlet
        - nested routes안의 element들을 어디에 보여줄지 표기하는 곳
        - 구멍이라고 생각
        
        ```jsx
        <Route path="/about" element={ <About/> } >  
          <Route path="member" element={ <div>멤버들</div> } />
          <Route path="location" element={ <div>회사위치</div> } />
        </Route>
        ```
        
        ```jsx
        function About(){
          return (
            <div>
              <h4>about페이지임</h4>
              <Outlet></Outlet>
            </div>
          )
        }
        ```
        
        유사한 서브페이지들이 많이 필요하다면 이렇게 만들어도 됨
        
- 라우터: url 파라미터로 상세페이지 100개 만들기
    
    ```jsx
    <Route path="/detail/0" element={ <Detail shoes={shoes}/> }/>
    <Route path="/detail/1" element={ <Detail shoes={shoes}/> }/>
    <Route path="/detail/2" element={ <Detail shoes={shoes}/> }/>
    이렇게 하면 많아질수록 끔찍하니까
    <Route path="/detail/:id" element={ <Detail shoes={shoes}/> }/>
    근데 이렇게 하면 뭘 쓰든 detail로만 가는 거임
    ```
    
    ```jsx
    그래서 detail/1, detail/2 등으로 넣어주기 위해 id를 받도록
    
    import { useParams } from 'react-router-dom'
    
    function Detail(){
      let {id} = useParams();
      console.log(id)
      
      return (
        <div className="container>
          <div className="row">
            <div className="col-md-6">
              <img src="https://codingapple1.github.io/shop/shoes1.jpg" width="100%" />
            </div>
            <div className="col-md-6 mt-4">
            <h4 className="pt-5">{props.shoes[id].title}</h4>
            <p>{props.shoes[0].content}</p>
            <p>{props.shoes[0].price}원</p>
            <button className="btn btn-danger">주문하기</button>
          </div>
        </div>
      </div>
      )
    }
    ```
    
    ```jsx
    자료 순서 바뀌어도 원래대로 쓰고 싶으면
    function Detail(props){
    
      let { id } = useParams();
      let 찾은상품 = props.shoes.find(function(x){
        return x.id == id
      });
    
      return (
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <img src="https://codingapple1.github.io/shop/shoes1.jpg" width="100%" />
            </div>
            <div className="col-md-6 mt-4">
              <h4 className="pt-5">{찾은상품.title}</h4>
              <p>{찾은상품.content}</p>
              <p>{찾은상품.price}원</p>
              <button className="btn btn-danger">주문하기</button> 
            </div>
          </div>
      </div>  
      )
    };
    
    export default Detail
    ```
    
- styled-components
    
    ```jsx
    npm install styled-components
    import styled from 'styled-components'
    ```
    
    ```jsx
    import styled from 'styled-components';
    
    let Box = styled.div`
      padding : 20px;
      color : grey
    `;
    let YellowBtn = styled.button`
      background : yellow;
      color : black;
      padding : 10px;
    `;
    
    function Detail(){
      return (
        <div>
          <Box>
            <YellowBtn>버튼임</YellowBtn>
          </Box>
        </div>
      )
    }
    ```
    
    장점
    
    **1.** CSS 파일 오픈할 필요없이 JS 파일에서 바로 스타일넣을 수 있습니다.
    
    **2.** 여기 적은 스타일이 다른 JS 파일로 오염되지 않습니다. 원래 그냥 CSS파일은 오염됩니다.
    
    **3.** 페이지 로딩시간 단축됩니다. 왜냐면 저기 적은 스타일은 html 페이지의 <style>태그에 넣어줘서 그렇습니다.
    
    ---
    
    - 사실 일반 CSS도 오염방지 가능
    
    CSS파일에서도 다른 JS 파일에 간섭하지 않는 '모듈화' 기능을 제공하는데
    
    **컴포넌트명.module.css**
    
    이렇게 CSS 파일을 작명하면 됩니다.
    
    ```jsx
    props로 재활용 가능
    import styled from 'styled-components';
    
    let YellowBtn = styled.button`
      background : ${ props => props.bg };
      color : black;
      padding : 10px;
    `;
    
    function Detail(){
      return (
        <div>
            <YellowBtn bg="orange">오렌지색 버튼임</YellowBtn>
            <YellowBtn bg="blue">파란색 버튼임</YellowBtn>
        </div>
      )
    }
    ```
    
    **단점1.** JS 파일이 매우 복잡해집니다.
    
    그리고 이 컴포넌트가 styled 인지 아니면 일반 컴포넌트인지 구분도 어렵습니다.
    
    **단점2.** JS 파일 간 중복 디자인이 많이 필요하면 어쩌죠?
    
    다른 파일에서 스타일 넣은 것들 import 해와서 쓰면 됩니다.
    
    근데 그럼 CSS파일 쓰는거랑 차이가 없을 수도요
    
    **단점3.** CSS 담당하는 디자이너가 있다면 협업시 불편할텐데
    
    그 사람이 styled-components 문법을 모른다면
    
    그 사람이 CSS로 짠걸 styled-components 문법으로 다시 바꾸거나 그런 작업이 필요하겠군요.
    
    그래서 신기술같은거 도입시엔 언제나 미래를 생각해보아야합니다.
    
- Lifecycle과 useEffect
    
    컴포넌트는
    
    1. 생성이 될 수도 있고 (전문용어로 mount)
    2. 재렌더링이 될 수도 있고 (전문용어로 update)
    3. 삭제가 될 수도 있습니다. (전문용어로 unmount)
    - 컴포넌트에 갈고리 달기 (옛날 버전)
    
    ```jsx
    class Detail2 extends React.Component {
      componentDidMount(){
        //Detail2 컴포넌트가 로드되고나서 실행할 코드
      }
      componentDidUpdate(){
        //Detail2 컴포넌트가 업데이트 되고나서 실행할 코드
      }
      componentWillUnmount(){
        //Detail2 컴포넌트가 삭제되기전에 실행할 코드
      }
    }
    ```
    
    - useEffect()
    
    ```jsx
    import {useState, useEffect} from 'react';
    
    function Detail(){
    
      useEffect(()=>{
        //여기적은 코드는 컴포넌트 로드 & 업데이트 마다 실행됨
        console.log('안녕')
      });
    
      let [count, setCount] = useState(0)
      
      return (
        <button onClick={()=>{ setCount(count+1) }}>버튼</button>
      )
    }
    ```
    
    **useEffect 안에 적은 코드는 html 렌더링 이후에 동작합니다.**
    
    ```jsx
    function Detail(){
    
      (반복문 10억번 돌리는 코드)
      return (생략)
    }
    여기에 대충 적으면 반복문 돌리고 나서 하단의 html 보여줌
    ```
    
    ```jsx
    function Detail(){
    
      useEffect(()=>{
        (반복문 10억번 돌리는 코드)
      });
      
      return (생략)
    }
    useEffect 안에 적으면 html 보여주고 나서 반복문 돌림
    -> 조금이라도 html 렌더링이 빠른 사이트를 원하면
    쓸데없는 것들은 useEffect 안에 넣어보길 바랍니다.
    ```
    
    - Detail 페이지 후 2초 후에 박스가 사라지게 해보기
        
        ```jsx
        function Detail(){
        
          let [alert, setAlert] = useState(true)
          useEffect(()=>{
            setTimeout(()=>{ setAlert(false) }, 2000)
          }, [])
        
          return (
          {
            alert == true
            ? <div className="alert alert-warning">
                2초이내 구매시 할인
              </div>
            : null
          }
          )
        }
        ```
        
        ```jsx
        useEffect(()=>{ 실행할코드 }, [count])
        
        useEffect()의 둘째 파라미터로 [ ] 를 넣을 수 있는데
        거기에 변수나 state같은 것들을 넣을 수 있습니다. 여러개 가능
        아무것도 안 넣으면 mount시 1회 실행하고 영영 x
        
        ```
        
    - clean up function
        - return 부분!
        
        ```jsx
        useEffect(()=>{ 
          let a = setTimeout(()=>{ setAlert(false) }, 2000)
          return ()=>{
            clearTimeout(a) #기존 타이머 제거
          }
        }, [])
        ```
        
    - 정리
    
    ```jsx
    useEffect(()=>{ 실행할코드 }) #이러면 재렌더링마다 코드를 실행가능합니다.
    useEffect(()=>{ 실행할코드 }, []) #컴포넌트 mount시 (로드시) 1회만 실행가능합니다.
    useEffect(()=>{ 
      return ()=>{
        실행할코드
      }
    }) #이러면 useEffect 안의 코드 실행 전에 항상 실행됩니다.
    useEffect(()=>{ 
      return ()=>{
        실행할코드
      }
    }, []) #이러면 컴포넌트 unmount시 1회 실행됩니다.
    useEffect(()=>{ 
      실행할코드
    }, [state1]) #이러면 state1이 변경될 때만 실행됩니다.
    ```
    
- 리액트에서 서버와 통신하려면 ajax 1
    
    AJAX로 GET/POST요청하려면 방법 3개 중 택1 하면 됩니다.
    
    1. XMLHttpRequest라는 옛날 문법 쓰기
    2. fetch() 라는 최신 문법 쓰기
    3. axios 같은 외부 라이브러리 쓰기
    
    ```jsx
    npm install axios
    ```
    
    ```jsx
    import axios from 'axios'
    
    function App(){
      return (
        <button onClick={()=>{
          axios.get('https://codingapple1.github.io/shop/data2.json').then((결과)=>{
            console.log(결과.data)
          })
          .catch(()=>{
            console.log('실패함')
          })
        }}>버튼</button>
      )
    }
    ```
    
    1. axios를 쓰려면 상단에서 import해오고
    2. axios.get(URL) 이러면 그 URL로 GET요청이 됩니다.
    3. 데이터 가져온 결과는 결과.data 안에 들어있습니다. 그래서 위의 버튼 누르면 서버에서 가져온 데이터가 콘솔창에 출력됩니다.
    4. 인터넷이 안되거나 URL이 이상하면 실패하는데 실패했을 때 실행할 코드는 .catch() 안에 적으면 됩니다.
- 리액트에서 서버와 통신하려면 ajax 2 : post, fetch
    
    ```jsx
    import axios from 'axios'
    
    function App(){
    
      let [shoes, setShoes] = useState(어쩌구);
      return (
        <button onClick={()=>{
          axios.get('https://codingapple1.github.io/shop/data2.json').then((결과)=>{
            let copy = [...shoes, ...결과.data]
            setShoes(copy)
          })
          .catch(()=>{
            console.log('실패함')
          })
        }}>버튼</button>
      )
    }
    ```
    
    1. 점3개 이용해서 shoes의 사본을 만들었습니다.
    
    근데 그 안에 **...결과.data** 이것도 함께 뒤에 집어넣었습니다.
    
    결과.data 출력해보면 [{4번상품}, {5번상품}, {6번상품}] 이게 나오기 때문에 **...결과.data** 하면 { }, { }, { } 이것만 남을듯요
    
    2. 그 다음에 그걸 shoes라는 state에 추가했습니다.
    
    ```jsx
    POST요청 하는 법
    axios.post('URL', {name : 'kim'})
    ```
    
    ```jsx
    동시에 AJAX 요청 여러개 날리려면
    Promise.all( [axios.get('URL1'), axios.get('URL2')] )
    ```
    
    둘 다 완료시 특정 코드를 실행하고 싶으면 .then() 뒤에 붙이면 됨
    
- 탭 UI 만들기
    
    ```jsx
    
    <Nav variant="tabs"  defaultActiveKey="link0">
        <Nav.Item>
          <Nav.Link onClick={()=>{ 탭변경(0) }} eventKey="link0">버튼0</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link onClick={()=>{ 탭변경(1) }} eventKey="link1">버튼1</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link onClick={()=>{ 탭변경(2) }} eventKey="link2">버튼2</Nav.Link>
        </Nav.Item>
    </Nav>
    
    eventKey 속성은 버튼마다 맘대로 작명하면 된다고 합니다. 
    defaultActiveKey 여기는 페이지 로드시 어떤 버튼에 눌린효과를 줄지 결정하는 부분입니다.
    
    function Detail(){
      let [탭, 탭변경] = useState(0)
      
      return (
        <TabContent 탭={탭}/>
      )
    }
    
    function TabContent(props){
      if (props.탭 === 0){
        return <div>내용0</div>
      }
      if (props.탭 === 1){
        return <div>내용1</div>
      }
      if (props.탭 === 2){
        return <div>내용2</div>
      }
    }
    ```
    
    ```jsx
    props 쉽게 쓰기
    
    function TabContent({탭}){
      return [ <div>내용0</div>, <div>내용1</div>, <div>내용2</div> ][탭]
    }
    
    자식컴포넌트에서 props라고 파라미터를 하나만 작명하는게 아니라
    {state1이름, state2이름 ... }
    이렇게 작성하면 props.state1이름 이렇게 쓸 필요가 없어집니다.
    ```
    
- 멋있게 컴포넌트 전환 애니메이션 주는 법 (transition)
    
    애니메이션 만들고 싶으면
    
    1. 애니메이션 동작 전 스타일을 담을 className 만들기
    2. 애니메이션 동작 후 스타일을 담을 className 만들기
    3. transition 속성도 추가
    4. 원할 때 2번 탈부착
    
    ```jsx
    css
    .start {
      opacity : 0
    }
    .end {
      opacity : 1;
      transition : opacity 0.5s;
    }
    ```
    
    ```jsx
    js
    function TabContent({탭}){
    
      let [fade, setFade] = useState('')
    
      useEffect(()=>{
        setTImeout(()=>{ setFade('end') }, 100)
      return ()=>{
        setFade('')
      }
      }, [탭])
    
      return (
        <div className={'start ' + fade}>
          { [<div>내용0</div>, <div>내용1</div>, <div>내용2</div>][탭] }
        </div>
      )
    }
    ```
    
- props 싫으면 Context API
    - Context API: 리액트 기본 문법 but 많이 쓰지는 않음
    
    ```jsx
    (App.js)
    
    export let Context1 = React.createContext();
    
    function App(){
      let [재고, 재고변경] = useState([10,11,12]);
    
      return (
        <Context1.Provider value={ {재고, shoes} }>
          <Detail shoes={shoes}/>
        </Context1.Provider>
        
      )
    }
    ```
    
    ```jsx
    (Detail.js)
    
    import {useState, useEffect, useContext} from 'react';
    import {Context1} from './../App.js';
    
    function Detail(){
      let {재고} = useContext(Context1)
    
      return (
        <div>{재고}</div>
      )
    }
    ```
    
- 🤍 Redux ; Toolkit 설치
    - Table 레이아웃
        - 표 만들고 싶을 때
        - tr: 행 하나
        - th, td: 열 하나
    
    ---
    
    Redux 쓰는 이유
    
    - 컴포넌트들이 props 없이 state 공유 가능 (할 줄 알아야 댐)
    
    ```jsx
    npm install @reduxjs/toolkit react-redux
    ```
    
    - 아무데나 store.js 파일 만들어
    
    ```jsx
    import { configureStore } from '@reduxjs/toolkit'
    
    export default configureStore({
      reducer: { }
    })
    ```
    
    - index.js
    
    ```jsx
    import { Provider } from "react-redux";
    import store from './store.js'
    
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </React.StrictMode>
    );
    ```
    
    이제 <App>과 그 모든 자식컴포넌트들은 store.js에 있던 state를 맘대로 꺼내쓸 수 있습니다.
    
- **R**edux 2 : store에 state 보관하고 쓰는 법
    
    state를 Redux store에 보관해둘 수 있는데 모든 컴포넌트가 거기 있던 state를 직접 꺼내쓸 수 있어서 **props 없어도 편리하게 state 공유가 가능**
    
    - store.js
    
    ```jsx
    import { configureStore, createSlice } from '@reduxjs/toolkit'
    
    let user = createSlice({
      name : 'user',
      initialState : 'kim'
    })
    
    export default configureStore({
      reducer: {
        user : user.reducer
      }
    })
    ```
    
    - cart.js
    
    ```jsx
    import { useSelector } from "react-redux"
    
    function Cart(){
      let a = useSelector((state) => { return state } )
      console.log(a)
    
      return (생략)
    }
    ```
    
    간단한거 만들 때 컴포넌트가 몇개 없을 때 이럴 땐 그냥 props 쓰는게 더 코드가 짧습니다.
    
- Redux 3 : store의 state 변경하는 법
    1. state 수정해주는 함수 만들기
    2. 만든 함수 export (밖으로 빼서)
    3. 만든 함수 import해서 사용
    - store.js
    
    ```jsx
    let user = createSlice({
      name : 'user',
      initialState : 'kim',
      reducers : { #얘 만듦
        changeName(state){
          return 'john ' + state 
        }
      }
    })
    
    export let { changeName } = user.actions
    ```
    
    - cart.js
    
    ```jsx
    import { useDispatch, useSelector } from "react-redux"
    import { changeName } from "./../store.js"
    
    (생략) 
    
    <button onClick={()=>{
      dispatch(changeName())
    }}>버튼임</button>
    ```
    
- Redux 4: state가 object/array일 경우 변경하는 법
    
    array/object 자료의 경우 state변경은 **state를 직접 수정해버려도 잘 되니까 직접 수정하십시오.**
    
    - 버튼을 누르면 위에 있는 state 중에 age 항목이 +1
    
    ```jsx
    let user = createSlice({
      name : 'user',
      initialState : {name : 'kim', age : 20},
      reducers : {
        increase(state){
          state.age += 1
        }
      }
    })
    ```
    
    - state 변경 함수가 여러 개 필요하면
    
    ```jsx
    let user = createSlice({
      name : 'user',
      initialState : {name : 'kim', age : 20},
      reducers : {
        increase(state, a){
          state.age += a.payload
        }
      }
    })
    ```
    
- if문 작성 패턴 5개
    1. 컴포넌트 안에서 쓰는 if/else
    
    ```jsx
    function Component() {
      if ( true ) {
        return <p>참이면 보여줄 HTML</p>;
      } else {
        return null;
      }
    }
    ```
    
    ```jsx
    function Component() {
      if ( true ) {
        return <p>참이면 보여줄 HTML</p>;
      } 
      return null;
    } # else 생략 가능
    ```
    
    1. JSX 안에서 쓰는 삼항연산자
        
        **조건문 ? 조건문 참일때 실행할 코드 : 거짓일 때 실행할 코드**
        
        중첩 사용도 가능 그러나 비추
        
    
    ```jsx
    function Component() {
      return (
        <div>
          {
            1 === 1
            ? <p>참이면 보여줄 HTML</p>
            : null
          }
        </div>
      )
    }
    ```
    
    1. && 연산자로 if 역할 대신하기
        
        **그냥 왼쪽 오른쪽 둘다 true면 전체를 true로 바꿔주세요~"**
        
        ```jsx
        true && false; -> false
        true && true; -> true
        true && false && '안녕'; -> false
        ```
        
    2. switch/case 조건문
    
    ```jsx
    function Component2(){
      var user = 'seller';
      if (user === 'seller'){
        return <h4>판매자 로그인</h4>
      } else if (user === 'customer'){
        return <h4>구매자 로그인</h4>
      } else {
        return <h4>그냥 로그인</h4>
      }
    }
    
    이 코드랑 같은 코드
    
    function Component2(){
      var user = 'seller';
      switch (user){
        case 'seller' :
          return <h4>판매자 로그인</h4>
        case 'customer' :
          return <h4>구매자 로그인</h4>
        default : 
          return <h4>그냥 로그인</h4>
      }
    }
    ```
    
    1. **switch (검사할변수){}** 이거부터 작성하고
    
    2. 그 안에 **case 검사할변수가이거랑일치하냐 :** 를 넣어줍니다.
    
    3. 그래서 이게 일치하면 case : 밑에 있는 코드를 실행해줍니다.
    
    4. **default :** 는 그냥 맨 마지막에 쓰는 else문과 동일합니다.
    
    1. object/array 자료형 응용
    
    ```jsx
    function Component() {
      var 현재상태 = 'info';
      return (
        <div>
          {
            { 
               info : <p>상품정보</p>,
               shipping : <p>배송관련</p>,
               refund : <p>환불약관</p>
            }[현재상태]
          }
    
        </div>
      )
    }
    ```
 
