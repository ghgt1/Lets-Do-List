# 📌 REST API 를 활용한 할 일 관리(Todo) 사이트📝

패스트캠퍼스에서 진행한 REST API 를 활용한 할 일 관리 사이트입니다.
버그 제보 받습니다!

## 배포주소

데모를 [여기서](https://todo-jyroh.netlify.app/) 보실수 있습니다 

## 설치법

```shell
$ git clone {주소복사}
$ npm install
$ npm init-y
$ npm i -D parcel
$ npm install sortablejs --save
$ npm run dev
```

## 기간

- 2022/11/28 ~ 2022/12/02

## 사용 기술 스택

- Programming

<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white"> <img src="https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=SASS&logoColor=white"> <img src="https://img.shields.io/badge/JAVASCRIPT-F7DF1E?style=for-the-badge&logo=JAVASCRIPT&logoColor=white"> 

- Deploy

<img src="https://img.shields.io/badge/NETLIFY-00C7B7?style=for-the-badge&logo=NETLIFY&logoColor=white">

- Etc

<img src="https://img.shields.io/badge/.ENV-ECD53F?style=for-the-badge&logo=.ENV&logoColor=white"> <img src="https://img.shields.io/badge/PARCEL-8DD6F9?style=for-the-badge&logoColor=white"> <img src="https://img.shields.io/badge/SORTABLE.JS-E2231A?style=for-the-badge&logo=Sauce Labs&logoColor=white">

## 주요 구현 사항

- TODO CRUD를 모두 구현하였습니다.
- 드래그 앤 드롭을 SortableJS를 활용하여 구현하였습니다.
- 완료/미완료, 시간순 보기 기능을 구현하였습니다.
- 화면 상단에 상태 창을 구현하였습니다.
- .env를 활용하여 API KEY를 숨겼습니다.
- 할일 완료 체크시 가로줄을 그어 확실히 알 수 있개 하였습니다.

### :exclamation: 필수

- [x] 할 일 목록(List)이 출력돼야 합니다.
- [x] 할 일 항목(Item)을 새롭게 추가할 수 있어야 합니다.
- [x] 할 일 항목을 수정할 수 있어야 합니다.
- [x] 할 일 항목을 삭제할 수 있어야 합니다.
- [x] jQuery, React, Vue 등 JS 라이브러리와 프레임워크는 사용하지 않아야 합니다.
- [x] 실제 서비스로 배포하고 접근 가능한 링크를 추가해야 합니다.

### :grey_question: 선택

- [ ] 가능하다면, 타입스크립트를 사용해보세요.
- [x] 할 일 항목의 순서를 바꿀 수 있도록 만들어보세요.
- [x] 할 일을 완료하지 않은 항목과 완료한 항목을 분류해서 출력해보세요.
- [x] 할 일을 완료한 항목을 한 번에 삭제할 수 있도록 만들어보세요.
- [x] 할 일 항목의 최신 수정일을 표시해보세요.
- [x] 할 일 목록이 출력되기 전에 로딩 애니메이션이 보이도록 만들어보세요.
- [x] 기타 동작이 완료되기 전에 로딩 애니메이션이 보이도록 만들어보세요.
- [x] 차별화가 가능하도록 프로젝트를 최대한 예쁘게 만들어보세요.
- [x] 할 일과 관련된 기타 기능도 고려해보세요.

## 어려웠던 부분 && 아쉬웠던 부분

- eventListner가 여러번 중첩되는 문제가 있었고(remove로해결), 이벤트 버블링/캡처링도 처음 겪어봐서 매우 당황스러웠다.
- setTimeout을 동기적으로 처리하고 싶었는데 Promise가 반환값이 아니라 구현이 힘들었다(직접 Promise로 변환).
- 버튼들에 ID값들을 부여해놨었는데 querySelector가 숫자로 시작하는 ID값을 인지못하는 문제([출처](https://dev-son.tistory.com/24)) - ID앞에 문자를 넣어 해결
- 두서없는 모듈화. 
- `await`를 안걸어주어 비동기적으로 코드가 꼬이는경우가 많았다.

## 피드백 받고 싶은 부분

- 모듈화를 할때 `main.js`의 기능이 무엇이어야 할지 궁금합니다. 또한 모듈화를 적절히 했을까요?
- 가끔 전체 할일 제거를 할때 console에 ERROR가 출력되는문제(동작엔 이상이 없습니다). 
- API동작때의 에러를 처리해주고자 try-catch로 모두 감싸주었는데 (`requests.js` 참조) 이렇게 쓰는게 맞는지?
- API에 전체 삭제 기능이 따로없어서 하나씩 삭제를 해주어야할 것 같은데 개수가 많을때 삭제 시간이 오래걸림. 따라서 `Promise.all`을 활용하면 시간을 줄일 수 있지 않을까 싶어서 사용했는데 맞게 사용한지를 모르겠습니다. (`deleteTodoAll()` 함수) 
- 그 밖의 어떠한 피드백도 좋습니다!
