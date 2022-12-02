// Sortable JS 라이브러리
import Sortable from "sortablejs";

// 함수들 import
import { createTodo } from "./createTodo.js";
import { deleteTodoAll } from "./deleteTodo.js";
import { renderTodo } from "./renderTodo.js";
import { fetchAPI } from "./requests.js";

// API KEY 환경변수 설정
require("dotenv").config();

// 변수들
export const API_URL = `https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos`;
export const HEADERS = {
  "content-type": "application/json",
  apikey: process.env.API_KEY,
  username: "KDT3_RohJunYoung",
};
export const submitBtn = document.querySelector(".submit-btn");
export const inputData = document.querySelector(".todo-input");
export const todoLists = document.querySelector(".todo-lists");
export const doneSelector = document.querySelector(".done-selector");
export const sortSelector = document.querySelector(".sort-selector");
export const alertStatus = document.querySelector(".status-alert");
export const loadEl = document.querySelector(".loader");
const inputForm = document.querySelector(".todo-form");
const clearBtn = document.querySelector(".clear-btn");

// 첫렌더링, 버튼들 이벤트리스너 생성
renderTodo(doneSelector.value, sortSelector.value);

// html select 표시방식과 정렬방식 감지
doneSelector.addEventListener("change", () => {
  renderTodo(doneSelector.value, sortSelector.value);
});
sortSelector.addEventListener("change", () => {
  renderTodo(doneSelector.value, sortSelector.value);
});

// todo추가 버튼
inputForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await createTodo(inputData.value);
  inputData.value = null;
});

// todo전체삭제 버튼
clearBtn.addEventListener("click", deleteTodoAll);

// 커서로 순서바꾸기 기능
// reorder를 사용해주면 order가 잘 부여가 됨
new Sortable(todoLists, {
  handle: ".todos",
  animation: 200,
  // 순서가바뀌면 컨텐트들도 재배치...
  onEnd: async function reOrder(event) {
    const tmpIds = [];
    event.to.childNodes.forEach((node) => {
      tmpIds.push(node.id);
    });
    const body = JSON.stringify({
      todoIds: tmpIds,
    });
    await fetchAPI("PUT", `${API_URL}/reorder`, body);
  },
});
