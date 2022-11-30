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
// 나중에 request하는 header와 body까지도 함수화하면 좋을듯.

renderTodo();

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
  const res = await fetch(API_URL, {
    method: "GET",
    headers: HEADERS,
  });
  const json = await res.json();
  return json;
}

// todo 생성
async function createTodo(content) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      title: content,
    }),
  });
  alertHandler("alert-add", "TODO 추가 완료");
  // 여기서 이벤트생성이 아닌 render all 어차피 서버에 정보는 있다
  renderTodo();
}

// todo 하나 렌더링 과정
function renderEachItem(todo) {
  const todoSection = document.createElement("div");
  todoSection.classList.add("todos");

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
    alertHandler("alert-clear", "TODO 삭제 완료");
    renderTodo();
  });
  btnSection.append(timeEl, editBtn, deleteBtn);
  todoSection.append(leftContainer, btnSection);
  todoLists.append(todoSection);
}

// todo 전체 렌더링
async function renderTodo() {
  let json = await getTodo();
  // json = json.reverse();
  todoLists.innerHTML = "";
  json.forEach((todo) => {
    renderEachItem(todo);
  });
}

//todo check 변경
//찍긋기도 구현.
//이건 전체 rendering안하고 방법은... dom으로 다루기?
async function editCheckbox(todoId, todoTitle, todoDone) {
  const checkEl = document.getElementById(todoId);
  const checked = checkEl.checked;
  const content = checkEl.nextElementSibling;
  // 이게 다시 렌더링될때는 기억못하고 사라짐
  if (checked) content.style.textDecoration = "line-through";
  else content.style.textDecoration = "none";
  const res = await fetch(`${API_URL}/${todoId}`, {
    method: "PUT",
    headers: HEADERS,
    body: JSON.stringify({
      title: todoTitle,
      done: checked,
    }),
  });
}

//todo 내용 변경
async function editContent(todoId, todoTitle, todoDone) {
  submitBtn.textContent = "Edit";
  inputData.value = null;
  inputData.placeholder = "변경할 내용을 입력해주세요";

  const editFunction = async (event) => {
    event.preventDefault();
    const res = await fetch(`${API_URL}/${todoId}`, {
      method: "PUT",
      headers: HEADERS,
      body: JSON.stringify({
        title: inputData.value,
        done: todoDone,
      }),
    });
    submitBtn.textContent = "Submit";
    inputData.value = null;
    submitBtn.removeEventListener("click", editFunction);
    alertHandler("alert-edit", "TODO 수정 완료");
    renderTodo();
  };

  submitBtn.addEventListener("click", editFunction);
}

// todo 개별 삭제
async function deleteEachTodo(todoId = "") {
  const res = await fetch(`${API_URL}/${todoId}`, {
    method: "DELETE",
    headers: HEADERS,
  });
}

// todo 전체 삭제
async function deleteTodoAll() {
  let json = await getTodo();
  let promises = [];
  // 좀더연구
  json.forEach((todo) => {
    promises.push(deleteEachTodo(todo.id));
  });
  await Promise.all(promises);
  alertHandler("alert-clear", "전체 삭제 완료");
  renderTodo();
}
