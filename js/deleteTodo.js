import { API_URL, doneSelector, sortSelector, loadEl } from "./main.js";
import { renderTodo, getTodo, alertHandler, waitLoad } from "./renderTodo.js";
import { fetchAPI } from "./requests.js";

// todo 개별 삭제
export async function deleteEachTodo(todoId, all = false) {
  if (!all) {
    loadEl.classList.remove("loader-hidden");
    await fetchAPI("DELETE", `${API_URL}/${todoId}`);
    await waitLoad(500);
    loadEl.classList.add("loader-hidden");
  } else {
    await fetchAPI("DELETE", `${API_URL}/${todoId}`);
  }
}

// todo 전체 삭제
export async function deleteTodoAll() {
  let json = await getTodo();
  let promises = [];
  // 좀더연구if (todo.done)
  json.forEach((todo) => {
    if (todo.done) promises.push(deleteEachTodo(todo.id, true));
  });
  loadEl.classList.remove("loader-hidden");
  await Promise.all(promises);
  await renderTodo(doneSelector.value, sortSelector.value);
  loadEl.classList.add("loader-hidden");
  alertHandler("alert-clear", "삭제 완료");
}
