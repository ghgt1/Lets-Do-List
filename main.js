const API_URL = `https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos`;
const HEADERS = {
  "content-type": "application/json",
  apikey: "FcKdtJs202209",
  username: "KDT3_RohJunYoung",
};

// require("dotenv").config();

// console.log(process.env.API_KEY);

const inputForm = document.querySelector(".todo-form");
const submitBtn = document.querySelector(".submit-btn");
const inputData = document.querySelector(".todo-input");
const todoLists = document.querySelector(".todo-lists");
const clearBtn = document.querySelector(".clear-btn");
const alertStatus = document.querySelector(".status-alert");
// 나중에 request하는 header와 body까지도 함수화하면 좋을듯.

inputForm.addEventListener("submit", (event) => {
  event.preventDefault();
  createTodo(inputData.value);
  inputData.value = null;
});

clearBtn.addEventListener("click", deleteTodoAll);

renderTodoAll();

// create List
async function createTodo(content) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      title: content,
    }),
  });
  //   json은 응답데이터
  const json = await res.json();
  console.log(json);
  renderEachItem(json);

  // const editBtn = document.getElementById(`edit${json.id}`);
  // editBtn.addEventListener("click", editGrocery);
  const deleteBtn = document.getElementById(`delete${json.id}`);
  console.log(deleteBtn);
  deleteBtn.addEventListener("click", deleteEachTodo);

  alertStatus.classList.add("alert-add");
  alertStatus.textContent = "TODO 추가 완료";
  setTimeout(() => {
    alertStatus.classList.remove("alert-add");
    alertStatus.textContent = "";
  }, 1000);
}

// render item
function renderEachItem(json) {
  //inner html로 작성
  const todoSection = document.createElement("div");
  todoSection.id = json.id;
  todoSection.classList.add("todos");
  todoSection.innerHTML = /* html */ `
<p class="title">${json.title}</p>
	<div class="btn-container">
		<button type="button" class="edit-btn" id=edit${json.id}>
			<i class="fa-solid fa-pen-to-square"></i>
		</button>
		<button type="button" class="delete-btn" id=delete${json.id}>
		<i class="fa-solid fa-trash"></i>
		</button>
	</div>
`;
  todoLists.append(todoSection);
}

// get List
async function getTodoData() {
  const res = await fetch(API_URL, {
    method: "GET",
    headers: HEADERS,
  });
  //   json은 응답데이터
  const json = await res.json();
  console.log(json);
  return json;
}

// render List
async function renderTodoAll() {
  todoLists.innerHTML = "";
  let json = await getTodoData();
  for (let todo of json) {
    renderEachItem(todo);
  }
  return json;
}

// 하나씩 삭제
async function deleteEachTodo(todoId = "", all = true) {
  let parentItem = "";
  if (all) {
    parentItem = document.getElementById(this.id.slice(6, this.id.length));
    todoId = parentItem.id;
  }
  const res = await fetch(`${API_URL}/${todoId}`, {
    method: "DELETE",
    headers: HEADERS,
  });
  console.log(await res.json());
  parentItem.remove();
  if (all) {
    alertStatus.classList.add("alert-clear");
    alertStatus.textContent = "TODO 삭제 완료";
    setTimeout(() => {
      alertStatus.classList.remove("alert-clear");
      alertStatus.textContent = "";
    }, 1000);
  }
}

// 전체 삭제 시급
async function deleteTodoAll() {
  let json = await getTodoData();
  // 이건 무조건 promiseall로 한번에 제거
  let promises = [];
  for (let todo of json) {
    promises.push(deleteEachTodo(todo.id, false));
  }
  console.log("ZZ2");
  await Promise.all(promises);
  // promise.all을 해봤지만 시간은 여전히 오래걸림....
  // 꼼수로 html을 먼저 지우던가 해야하나?
  alertStatus.classList.add("alert-clear");
  alertStatus.textContent = "전체 삭제 완료";
  setTimeout(() => {
    alertStatus.classList.remove("alert-clear");
    alertStatus.textContent = "";
  }, 1000);
  renderTodoAll();
}
