import React, { useState, useEffect } from "react";

export default function TaskForm({ onCreate, categories = [] }) {
  const [text, setText] = useState("");
  const [cat, setCat] = useState("");

  useEffect(() => {
    if (categories.length > 0) setCat(categories[0].id);
  }, [categories]);

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onCreate(text.trim(), cat || null);
    setText("");
  };

  return (
    <form onSubmit={submit} className="flex flex-col md:flex-row gap-2 items-start md:items-center">
  <input
    value={text}
    onChange={(e) => setText(e.target.value)}
    placeholder="Add a task..."
    className="flex-1 px-2 py-1 border rounded w-full md:w-auto text-black"
  />
  
  {categories.length > 0 && (
    <select value={cat} onChange={(e) => setCat(e.target.value)} className="px-2 py-1 border rounded w-full md:w-auto text-black">
      <option value="">No category</option>
      {categories.map((c) => (
        <option value={c.id} key={c.id}>{c.name}</option>
      ))}
    </select>
  )}

  <button className="px-3 py-1 bg-slate-700 text-white rounded w-full md:w-auto">Add</button>
</form>

  );
}
