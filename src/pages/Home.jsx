import React, { useEffect, useState } from "react";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "../api/taskService";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import { readJSON, writeJSON } from "../utils/storage";
import { v4 as uuidv4 } from "uuid";

const CATS_KEY = "tm_categories";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState(() => readJSON(CATS_KEY, []));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // Save categories to localStorage
  useEffect(() => {
    writeJSON(CATS_KEY, categories);
  }, [categories]);

  // Load tasks from API
  useEffect(() => {
    async function loadTasks() {
      setLoading(true);
      setError("");
      try {
        const remote = await fetchTodos();
        const mapped = remote.map((r) => ({
          id: r.id ?? uuidv4(),
          todo: r.todo ?? r.title,
          completed: !!r.completed,
          description: r.description ?? "",
          categoryId: null,
        }));
        setTasks(mapped);
      } catch (err) {
        console.warn("Failed to fetch todos, using local state", err);
        setError("Failed to fetch todos. Working offline.");
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  // Create new task
  async function handleCreate(text, categoryId) {
    const payload = { todo: text, completed: false, userId: 1 };
    try {
      const created = await addTodo(payload);
      const newTask = {
        id: created.id ?? uuidv4(),
        todo: created.todo ?? text,
        completed: !!created.completed,
        description: created.description ?? "",
        categoryId,
      };
      setTasks((s) => [newTask, ...s]);
    } catch (err) {
      console.warn("Add failed on server, using local state", err);
      const local = {
        id: uuidv4(),
        todo: text,
        completed: false,
        description: "",
        categoryId,
      };
      setTasks((s) => [local, ...s]);
    }
  }

  // Toggle task completion
  async function handleToggle(task) {
    setTasks((s) =>
      s.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
    );
    try {
      await updateTodo(task.id, { completed: !task.completed });
    } catch (err) {
      console.warn("Update failed on server, using local fallback", err);
    }
  }

  // Delete task
  async function handleDelete(task) {
    setTasks((s) => s.filter((t) => t.id !== task.id));
    try {
      await deleteTodo(task.id);
    } catch (err) {
      console.warn("Delete failed on server, using local fallback", err);
    }
  }

  // Edit task
  async function handleEdit(task) {
    const v = prompt("Edit task text", task.todo);
    if (!v || !v.trim()) return;

    setTasks((s) =>
      s.map((t) => (t.id === task.id ? { ...t, todo: v } : t))
    );

    try {
      await updateTodo(task.id, { todo: v });
    } catch (err) {
      console.warn("Update failed on server, using local fallback", err);
    }
  }

  // Category management
  function addCategory(name) {
    if (!name) return;
    const colors = ["#60a5fa", "#f472b6", "#f59e0b", "#34d399", "#a78bfa", "#fb7185"];
    const color = colors[categories.length % colors.length];
    const cat = { id: uuidv4(), name, color };
    setCategories((s) => [...s, cat]);
  }

  function removeCategory(id) {
    setCategories((s) => s.filter((c) => c.id !== id));
    setTasks((s) =>
      s.map((t) => (t.categoryId === id ? { ...t, categoryId: null } : t))
    );
  }

  // Sort tasks
  const sortedTasks = (() => {
    const copy = [...tasks];
    switch (sortBy) {
      case "alpha":
        return copy.sort((a, b) => (a.todo || "").localeCompare(b.todo || ""));
      case "completed":
        return copy.sort((a, b) => b.completed - a.completed);
      case "active":
        return copy.sort((a, b) => a.completed - b.completed);
      default:
        return copy;
    }
  })();

  // Filter + search tasks
  const filteredTasks = sortedTasks.filter((t) => {
    if (filter === "active" && t.completed) return false;
    if (filter === "completed" && !t.completed) return false;
    if (search) return (t.todo || "").toLowerCase().includes(search.toLowerCase());
    return true;
  });

  return (
    <div className="space-y-4 p-2 sm:p-4 md:p-6 lg:p-8">
      {/* Create Task */}
      <section className="p-4 border rounded bg-white dark:bg-slate-800">
        <h2 className="font-medium mb-2 text-sm sm:text-base md:text-lg lg:text-xl">Create Task</h2>
        <TaskForm onCreate={handleCreate} categories={categories} />
      </section>

      {/* Tasks List */}
      <section className="p-4 border rounded">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mb-3 flex-wrap">
          <div className="flex gap-2 mb-2 sm:mb-0">
            <button
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-slate-700 text-white px-2 py-1 rounded" : "px-2 py-1 border rounded"}
            >
              All
            </button>
            <button
              onClick={() => setFilter("active")}
              className={filter === "active" ? "bg-slate-700 text-white px-2 py-1 rounded" : "px-2 py-1 border rounded"}
            >
              Active
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={filter === "completed" ? "bg-slate-700 text-white px-2 py-1 rounded" : "px-2 py-1 border rounded"}
            >
              Completed
            </button>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="px-2 py-1 border rounded flex-1 text-black"
          />

          <select
            className="px-2 py-1 border rounded text-black mt-2 sm:mt-0"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="alpha">A → Z</option>
            <option value="completed">Completed First</option>
            <option value="active">Active First</option>
          </select>
        </div>

        {loading && <div className="py-6 text-center">Loading…</div>}
        {error && <div className="text-red-500 mb-2">{error}</div>}

        <TaskList
          tasks={filteredTasks}
          setTasks={setTasks}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
          categories={categories}
        />
      </section>

      {/* Categories */}
      <section className="p-4 border rounded">
        <h3 className="font-medium mb-2 text-sm sm:text-base md:text-lg lg:text-xl">Categories</h3>
        <div className="flex gap-2 items-center mb-3">
          <CategoryForm onAdd={addCategory} />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.length === 0 && <div className="text-sm text-slate-500">No categories yet</div>}
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-2 border rounded px-2 py-1">
              <div style={{ background: c.color }} className="w-4 h-4 rounded" />
              <div>{c.name}</div>
              <button onClick={() => removeCategory(c.id)} className="ml-2 text-xs text-red-500">
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Category Form
function CategoryForm({ onAdd }) {
  const [v, setV] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!v.trim()) return;
        onAdd(v.trim());
        setV("");
      }}
      className="flex flex-col sm:flex-row sm:items-center gap-2"
    >
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="New category"
        className="px-2 py-1 border rounded text-black flex-1"
      />
      <button className="px-3 py-1 bg-slate-700 text-white rounded">Add</button>
    </form>
  );
}
