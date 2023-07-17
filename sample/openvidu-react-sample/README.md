# openvidu-test
openvidu 테스트 하는 레포지토리

도커
docker run -p 4443:4443 --rm -e OPENVIDU_SECRET=MY_SECRET openvidu/openvidu-dev:2.28.0

스프링
그냥 실행시키면 된다. (아직 cors error 때문에 openvidu 서버 사용하고 있으므로 실행하지 않아도 무관)

리액트

npm i
npm start
