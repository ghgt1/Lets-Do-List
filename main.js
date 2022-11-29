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

inputForm.addEventListener("submit", (event) => {
  event.preventDefault();
  createTodo(inputData.value);
});
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

  //inner html로 작성
  const todoSection = document.createElement("div");
  todoSection.id = json.id;
  todoSection.classList.add("todos");
  todoSection.innerHTML = /* html */ `
	<p class="title">${content}</p>
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
  // const editBtn = document.getElementById(`edit${json.id}`);
  // editBtn.addEventListener("click", editGrocery);
  // const deleteBtn = document.getElementById(`delete${json.id}`);
  // deleteBtn.addEventListener("click", deleteEachGrocery);
}

// render List
async function renderTodo() {
  const res = await fetch(API_URL, {
    method: "GET",
    headers: HEADERS,
  });
  //   json은 응답데이터
  const json = await res.json();
  console.log(json);
  // const todoSection = document.createElement("div");
}
// createTodo();

// readTodo();
