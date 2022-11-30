// Sortable JS 라이브러리
import Sortable from "sortablejs";

// API KEY 환경변수 설정
require("dotenv").config();

const API_URL = `https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos`;
const HEADERS = {
  "content-type": "application/json",
  apikey: process.env.API_KEY,
  username: "KDT3_RohJunYoung",
};

const inputForm = document.querySelector(".todo-form");
const submitBtn = document.querySelector(".submit-btn");
const inputData = document.querySelector(".todo-input");
const todoLists = document.querySelector(".todo-lists");
const clearBtn = document.querySelector(".clear-btn");
const alertStatus = document.querySelector(".status-alert");
const doneSelector = document.querySelector(".done-selector");
const sortSelector = document.querySelector(".sort-selector");

renderTodo();

doneSelector.addEventListener("change", () => {
  renderTodo(doneSelector.value, sortSelector.value);
});
sortSelector.addEventListener("change", () => {
  renderTodo(doneSelector.value, sortSelector.value);
});

// api fetch Header, Body함수
async function fetchAPI(method, endpoint, body = "") {
  if (method === "GET") {
    const res = await fetch(`${endpoint}`, {
      method: method,
      headers: HEADERS,
    });
    const json = await res.json();
    return json;
  }
  if (!body) {
    await fetch(`${endpoint}`, {
      method: method,
      headers: HEADERS,
    });
  } else {
    await fetch(`${endpoint}`, {
      method: method,
      headers: HEADERS,
      body: body,
    });
  }
}

//alert 제어 함수
function alertHandler(addClass, content) {
  alertStatus.classList.add(addClass);
  alertStatus.textContent = content;
  setTimeout(() => {
    alertStatus.classList.remove(addClass);
    alertStatus.textContent = "";
  }, 1000);
}

// todo추가
inputForm.addEventListener("submit", (event) => {
  event.preventDefault();
  createTodo(inputData.value);
  inputData.value = null;
});

// todo전체삭제
clearBtn.addEventListener("click", deleteTodoAll);

// 전체 todo 받아오기
async function getTodo() {
  const json = await fetchAPI("GET", API_URL);
  return json;
}

// todo 생성
async function createTodo(content) {
  const body = JSON.stringify({
    title: content,
  });
  const res = await fetchAPI("POST", API_URL, body);
  // 여기서 이벤트생성이 아닌 render all 어차피 서버에 정보는 있다
  await renderTodo();
  alertHandler("alert-add", "TODO 추가 완료");
}

// todo 하나 렌더링 과정
function renderEachItem(todo) {
  const todoSection = document.createElement("div");
  todoSection.classList.add("todos");
  todoSection.id = todo.id;
  // left Container생성
  const leftContainer = document.createElement("div");
  leftContainer.classList.add("left-container");
  const checkEl = document.createElement("input");
  checkEl.type = "checkbox";
  checkEl.checked = todo.done;
  checkEl.id = todo.id;
  // checkEl 이벤트리스너 생성
  checkEl.addEventListener("click", () => {
    editCheckbox(todo.id, todo.title, todo.done);
  });
  const titleEl = document.createElement("p");
  titleEl.classList.add("title");
  titleEl.textContent = todo.title;
  if (todo.done) titleEl.style.textDecoration = "line-through";
  leftContainer.append(checkEl, titleEl);

  // btn Container 생성
  const btnSection = document.createElement("div");
  btnSection.classList.add("btn-container");
  const timeEl = document.createElement("p");
  timeEl.classList.add("title");
  timeEl.textContent = `Last Updated: ${new Date(
    todo.updatedAt
  ).toLocaleString()}`;
  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.classList.add("edit-btn");
  const editIcon = document.createElement("i");
  editIcon.classList.add("fa-solid", "fa-pen-to-square");
  editBtn.append(editIcon);
  // editBtn 이벤트리스너 생성
  editBtn.addEventListener("click", async () => {
    await editContent(todo.id, todo.title, todo.done);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.classList.add("delete-btn");
  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fa-solid", "fa-trash");
  deleteBtn.append(deleteIcon);
  //이벤트리스너 즉시실행문제 해결
  deleteBtn.addEventListener("click", async () => {
    await deleteEachTodo(todo.id);
    await renderTodo();
    alertHandler("alert-clear", "TODO 삭제 완료");
  });
  btnSection.append(timeEl, editBtn, deleteBtn);
  todoSection.append(leftContainer, btnSection);
  todoLists.append(todoSection);
}

// todo 전체 렌더링
async function renderTodo(done = "", sort = "") {
  let json = Array.from(await getTodo());
  todoLists.innerHTML = "";
  // 자 무조건 정렬의 default는 order임(사용자 지정)
  // 따라서 최신순 오래된순은 reorder를 쓰지않고 내가 렌더링 상에서 해야할듯
  // 아래의 if문에 안걸리면 그건 사용자지정임(order가 관리)
  if (sort === "newest")
    json.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  else if (sort === "oldest")
    json.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));

  if (done === "done") json = json.filter((item) => item.done);
  else if (done === "yet") json = json.filter((item) => !item.done);
  json.forEach((todo) => {
    renderEachItem(todo);
  });
}

//todo check 변경
//찍긋기도 구현.
//이건 전체 rendering안하고 방법은... dom으로 다루기?
async function editCheckbox(todoId, todoTitle, todoDone) {
  const checkEl = document.querySelector(`input#${todoId}`);
  const checked = checkEl.checked;
  const content = checkEl.nextElementSibling;
  if (checked) content.style.textDecoration = "line-through";
  else content.style.textDecoration = "none";
  const body = JSON.stringify({
    title: todoTitle,
    done: checked,
  });
  await fetchAPI("PUT", `${API_URL}/${todoId}`, body);
}

//todo 내용 변경
async function editContent(todoId, todoTitle, todoDone) {
  submitBtn.textContent = "Edit";
  inputData.value = null;
  inputData.placeholder = "변경할 내용을 입력해주세요";
  const editFunction = async (event) => {
    event.preventDefault();
    const body = JSON.stringify({
      title: inputData.value,
      done: todoDone,
    });
    await fetchAPI("PUT", `${API_URL}/${todoId}`, body);
    submitBtn.textContent = "Submit";
    inputData.value = null;
    submitBtn.removeEventListener("click", editFunction);
    await renderTodo();
    alertHandler("alert-edit", "TODO 수정 완료");
  };

  submitBtn.addEventListener("click", editFunction);
}

// todo 개별 삭제
async function deleteEachTodo(todoId) {
  await fetchAPI("DELETE", `${API_URL}/${todoId}`);
}

// todo 전체 삭제
async function deleteTodoAll() {
  let json = await getTodo();
  let promises = [];
  // 좀더연구
  json.forEach((todo) => {
    if (todo.done) promises.push(deleteEachTodo(todo.id));
  });
  await Promise.all(promises);
  await renderTodo();
  alertHandler("alert-clear", "삭제 완료");
}

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
