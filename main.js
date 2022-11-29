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

inputForm.addEventListener("submit", (event) => {
  event.preventDefault();
  createTodo(inputData.value);
  inputData.value = null;
});

clearBtn.addEventListener("click", deleteTodoAll);

renderTodoAll();

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

  const editBtn = document.getElementById(`edit${json.id}`);
  editBtn.addEventListener("click", editTodo);
  const deleteBtn = document.getElementById(`delete${json.id}`);
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

// render List
async function renderTodoAll() {
  todoLists.innerHTML = "";
  let json = await getTodoData();
  for (let todo of json) {
    renderEachItem(todo);
  }
  return json;
}

// 수정
// 수정은 내용뿐만이아닌, 완료여부도 필요함
async function editTodo() {
  submitBtn.textContent = "Edit";
  inputData.value = null;
  const parentItem = document.getElementById(this.id.slice(4, this.id.length));
  const editFunction = async (event) => {
    event.preventDefault();
    const res = await fetch(`${API_URL}/${parentItem.id}`, {
      method: "PUT",
      headers: HEADERS,
      body: JSON.stringify({
        title: inputData.value,
        done: false,
      }),
    });
    parentItem.childNodes[1].textContent = inputData.value;
    submitBtn.textContent = "Submit";
    inputData.value = null;
    // eventlistner삭제
    submitBtn.removeEventListener("click", editFunction);
    alertStatus.classList.add("alert-edit");
    alertStatus.textContent = "TODO 수정 완료";
    setTimeout(() => {
      alertStatus.classList.remove("alert-edit");
      alertStatus.textContent = "";
    }, 1000);
  };
  submitBtn.addEventListener("click", editFunction);
}

// 하나씩 삭제
async function deleteEachTodo(todoId = "", all = true) {
  // all은 전체삭제인지 판단하는것
  let parentItem = "";
  if (all) {
    parentItem = document.getElementById(this.id.slice(6, this.id.length));
    todoId = parentItem.id;
    parentItem.remove();
  }
  const res = await fetch(`${API_URL}/${todoId}`, {
    method: "DELETE",
    headers: HEADERS,
  });
  if (all) {
    alertStatus.classList.add("alert-clear");
    alertStatus.textContent = "TODO 삭제 완료";
    setTimeout(() => {
      alertStatus.classList.remove("alert-clear");
      alertStatus.textContent = "";
    }, 1000);
  }
}

// 전체 삭제
async function deleteTodoAll() {
  let json = await getTodoData();
  let promises = [];
  for (let todo of json) {
    promises.push(deleteEachTodo(todo.id, false));
  }
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
