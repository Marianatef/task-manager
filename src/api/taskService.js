import axios from "axios";

const client = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 8000,
});


// GET all todos
export async function fetchTodos() {
  try {
    const res = await client.get("/todos");
    return Array.isArray(res.data.todos) ? res.data.todos : [];
  } catch (err) {
    console.warn("fetchTodos error, working offline:", err);
    return [];
  }
}

// GET a todo by id
export async function fetchTodoById(id) {
  try {
    const res = await client.get(`/todos/${id}`);
    return res.data;
  } catch (err) {
    console.warn(`fetchTodoById(${id}) failed, returning fallback:`, err);
    return null;
  }
}

// CREATE a new todo
export async function addTodo(payload) {
  try {
    const res = await client.post("/todos", payload);
    return res.data;
  } catch (err) {
    console.warn("addTodo failed on server, using local fallback:", err);
    return { ...payload, id: Date.now() };
  }
}

// UPDATE an existing todo
export async function updateTodo(id, updates) {
  try {
    const res = await client.put(`/todos/${id}`, updates);
    return res.data;
  } catch (err) {
    console.warn(`updateTodo(${id}) failed on server, using local fallback:`, err);
    return { id, ...updates };
  }
}

// DELETE a todo
export async function deleteTodo(id) {
  try {
    const res = await client.delete(`/todos/${id}`);
    return res.data;
  } catch (err) {
    console.warn(`deleteTodo(${id}) failed on server, using local fallback:`, err);
    return { id };
  }
}
