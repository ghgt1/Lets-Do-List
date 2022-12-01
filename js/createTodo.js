import { API_URL, doneSelector, sortSelector } from "./main.js";
import { renderTodo, alertHandler } from "./renderTodo.js";
import { fetchAPI } from "./requests.js";

// todo 생성
export async function createTodo(content) {
  const body = JSON.stringify({
    title: content,
  });
  await fetchAPI("POST", API_URL, body);
  // 여기서 이벤트생성이 아닌 render all 어차피 서버에 정보는 있다
  await renderTodo(doneSelector.value, sortSelector.value);
  alertHandler("alert-add", "TODO 추가 완료");
}
