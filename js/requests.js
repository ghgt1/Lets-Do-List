import { HEADERS } from "./main.js";
// api fetch Header, Body함수
export async function fetchAPI(method, endpoint, body = "") {
  if (method === "GET") {
    const res = await fetch(`${endpoint}`, {
      method: method,
      headers: HEADERS,
    });
    const json = await res.json();
    return json;
  }
  if (!body) {
    await fetch(`${endpoint}`, {
      method: method,
      headers: HEADERS,
    });
  } else {
    await fetch(`${endpoint}`, {
      method: method,
      headers: HEADERS,
      body: body,
    });
  }
}
