# 2023_07_20_styled-components

강의 번호: React
복습: Yes
키워드: styled-components

### styled-components

1. **styled-components 설치**
    
    ```jsx
    npm install styled-components
    ```
    
2. **styled-components 사용법**
    
    1)  import, 컴포넌트화
    
    ```
    import styled from 'styled-components'
    
    let YellowBtn = styled.button`
      background : yellow;
      color : black;
      padding : 10px;
    `
    
    styled.div`
      background : grey;
      padding : 20px;
    `
    ```
    
    2)  컴포넌트 꺼내쓰기
    
    ```jsx
    <YellowBtn>버튼</YellowBtn>
    ```
    
    3) props해서 사용하기
    
    ```jsx
    let Btn = styled.button`
      background : **${ props => props.bg };**
      color : **${props => props.bg =='blue' ? 'white' : 'black'};**
      padding : 10px;
    `
    
    ------
    
    <Btn **bg="blue"**>버튼</Btn>
    ```
    
    - 조건문도 사용 가능
3. **styled-components 장점**
    - CSS 파일 열지 않아도 됨
    - 다른 JS 파일로 오염되지 않음
    - 페이지 로딩시간 단축됨

1. **styled-components 단점**
    - js 파일이 복잡해짐
    - css파일과 다를게 없음
    - 협업시 불편함