# 2023_07_21_React_AJAX

강의 번호: React
복습: No

### **AJAX**

1. **서버**
    - 요청하면 보내주는 프로그램
    - 요청 방식 맞춰서 요청 보내야함
        1. 어떤 데이터인지 (URL 형식으로)
        2. 어떤 방법으로 요청할지 (GET or POST)
            1. GET : 데이터 가져올 때
            2. POST : 데이터 서버로 보낼 때
2. **AJAX**
    - AJAX를 사용하지 않을 때 GET/POST 요청시 새로고침 되는데, AJAX를 사용하면 새로고침 되지 않음.
3. **AJAX 사용법 (택1)**
    
    1) XMLHttpRequest
    
    2) fetch()
    
    3) axios
    

### axios 사용해서 AJAX 사용하기

1. **axios 설치**
    
    ```jsx
    npm install axios
    ```
    
2. **axios import**
    
    ```jsx
    import axios from 'axios'
    ```
    
3. **ajax를 이용한 GET 요청**
    - 한 개 요청 보내기
        
        ```jsx
        axios.get('url')
        ```
        
    - 요청 여러개 보내기
        
        ```jsx
        Promise.all( [axios.get('URL1'), axios.get('URL2')] )
        ```
        
    - button 누르면 데이터 받아오는 코드
        
        ```jsx
        <button onClick={()=>{
          axios.get('url').then((결과)=>{
            console.log(결과.data)
          })
          .catch(()=>{
            console.log('실패함')
          })
        }}>버튼</button>
        ```
        
    - button 눌러서 데이터 받아오고, card 형식으로 출력하는 코드
        
        ```jsx
        let [shoes, setShoes] = useState(data);
        
        <button onClick={()=>{
          axios.get('url').then((결과)=>{
            **let copy = [...shoes, ...결과.data]** 
            setShoes(copy)
          })
          .catch(()=>{
            console.log('실패함')
          })
        }}>버튼</button>
        ```
        
        - array자료 copy해서 수정하고
        - setsShoes()에서 state 수정 후 생성되도록 함
4. **ajax를 이용한 POST**
    
    ```jsx
    axios.post('url', {보낼데이터})
    ```
    
    - 서버와 문자만 주고받을 수 있지만, 따옴표 쳐 놓으면 array, object도 주고받기 가능 예 )  “{ name : hae , age : 20 }”
5. **fetch**
    
    ```jsx
    fetch('URL').then(결과 => 결과.json()).then((결과) => { console.log(결과) } )
    ```
    
    - fetch() 를 이용해도 GET/POST 요청이 가능한데 JSON -> object/array 이렇게 직접 바꾸어줘야 함