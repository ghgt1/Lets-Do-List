import { HEADERS } from "./main.js";
// api fetch Header, Body함수
export async function fetchAPI(method, endpoint, body = "") {
  if (method === "GET") {
    try {
      const res = await fetch(`${endpoint}`, {
        method: method,
        headers: HEADERS,
      });
      const json = await res.json();
      return json;
    } catch (error) {
      alert("오류가 발생하였습니다.");
    }
  }
  if (!body) {
    try {
      await fetch(`${endpoint}`, {
        method: method,
        headers: HEADERS,
      });
    } catch (error) {
      alert("오류가 발생하였습니다.");
    }
  } else {
    try {
      await fetch(`${endpoint}`, {
        method: method,
        headers: HEADERS,
        body: body,
      });
    } catch (error) {
      alert("오류가 발생하였습니다.");
    }
  }
}
