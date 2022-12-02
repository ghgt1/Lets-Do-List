import {
  API_URL,
  todoLists,
  doneSelector,
  sortSelector,
  alertStatus,
} from "./main.js";
import { deleteEachTodo } from "./deleteTodo.js";
import { editContent, editCheckbox } from "./editTodo.js";
import { fetchAPI } from "./requests.js";

// 전체 todo 받아오기
export async function getTodo() {
  const json = await fetchAPI("GET", API_URL);
  console.log(json);
  return json;
}

// todo 하나 렌더링 과정
export function renderEachItem(todo) {
  const todoSection = document.createElement("div");
  todoSection.classList.add("todos");
  todoSection.id = todo.id;
  // left Container생성
  const leftContainer = document.createElement("div");
  leftContainer.classList.add("left-container");
  const checkEl = document.createElement("input");
  checkEl.type = "checkbox";
  checkEl.checked = todo.done;
  // 숫자로 id를 시작하면 안되는 오류....
  checkEl.id = `check${todo.id}`;
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
    await renderTodo(doneSelector.value, sortSelector.value);
    alertHandler("alert-clear", "TODO 삭제 완료");
  });
  btnSection.append(timeEl, editBtn, deleteBtn);
  todoSection.append(leftContainer, btnSection);
  todoLists.append(todoSection);
}

// todo 전체 렌더링
export async function renderTodo(done = "", sort = "") {
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

//alert 제어 함수
export function alertHandler(addClass, content) {
  alertStatus.classList.add(addClass);
  alertStatus.textContent = content;
  setTimeout(() => {
    alertStatus.classList.remove(addClass);
    alertStatus.textContent = "";
  }, 1000);
}

// 로딩 제어 함수
// settimeout은 promise를 반환하지 않아서 반환하게 직접 생성.
export const waitLoad = (timeToDelay) =>
  new Promise((resolve) => setTimeout(resolve, timeToDelay)); //이와 같이 선언 후
// loadEl.classList.remove("loader-hidden");
// await wait(500);
// loadEl.classList.add("loader-hidden");
