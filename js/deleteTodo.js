import { API_URL, doneSelector, sortSelector } from "./main.js";
import { renderTodo, getTodo, alertHandler } from "./renderTodo.js";
import { fetchAPI } from "./requests.js";

// todo 개별 삭제
export async function deleteEachTodo(todoId) {
  await fetchAPI("DELETE", `${API_URL}/${todoId}`);
}

// todo 전체 삭제
export async function deleteTodoAll() {
  let json = await getTodo();
  let promises = [];
  // 좀더연구
  json.forEach((todo) => {
    if (todo.done) promises.push(deleteEachTodo(todo.id));
  });
  await Promise.all(promises);
  await renderTodo(doneSelector.value, sortSelector.value);
  alertHandler("alert-clear", "삭제 완료");
}
