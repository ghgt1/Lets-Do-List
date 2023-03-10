import {
  API_URL,
  doneSelector,
  sortSelector,
  submitBtn,
  inputData,
  loadEl,
} from "./main.js";
import { renderTodo, alertHandler, waitLoad } from "./renderTodo.js";
import { fetchAPI } from "./requests.js";

//todo check 변경
//찍긋기도 구현.
//이건 전체 rendering안하고 방법은... dom으로 다루기?
export async function editCheckbox(todoId, todoTitle, todoDone) {
  const checkEl = document.getElementById(`check${todoId}`);
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
export async function editContent(todoId, todoTitle, todoDone) {
  submitBtn.textContent = "Edit";
  inputData.value = null;
  inputData.placeholder = "변경할 내용을 입력해주세요";
  inputData.focus();
  // console.log(inputData);
  const editFunction = async (event) => {
    event.preventDefault();
    const body = JSON.stringify({
      title: inputData.value,
      done: todoDone,
    });
    loadEl.classList.remove("loader-hidden");
    await fetchAPI("PUT", `${API_URL}/${todoId}`, body);
    submitBtn.textContent = "Submit";
    inputData.value = null;
    submitBtn.removeEventListener("click", editFunction);
    await waitLoad(500);
    await renderTodo(doneSelector.value, sortSelector.value);
    loadEl.classList.add("loader-hidden");
    alertHandler("alert-edit", "TODO 수정 완료");
    inputData.placeholder = "할일을 적어보세요";
  };
  submitBtn.addEventListener("click", editFunction);
}
