import React from "react";
import clsx from "clsx";

export default function TaskItem({ task, onToggle, onEdit, onDelete, categoriesMap = {} }) {
  const cat = task.categoryId ? categoriesMap[task.categoryId] : null;

  return (
    <div
      className={clsx(
        "p-3 rounded-md bg-white dark:bg-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3",
        { "opacity-60 line-through": task.completed }
      )}
    >
      {/* Left section: checkbox and task info */}
      <div className="flex items-start sm:items-center gap-2 flex-1">
        <input
          type="checkbox"
          checked={!!task.completed}
          onChange={() => onToggle(task)}
          aria-label={`toggle-${task.id}`}
          className="mt-1"
        />

        <div>
          <div
            className={clsx(
              "font-medium",
              "dark:text-white", // Ensure text is visible in dark mode
              { "text-black dark:text-white": !task.completed }
            )}
          >
            {task.todo}
          </div>
          {task.description && (
            <div className="text-sm text-slate-500 dark:text-slate-300">{task.description}</div>
          )}
        </div>
      </div>

      {/* Right section: category badge, edit & delete buttons */}
      <div className="flex items-center gap-2 mt-2 sm:mt-0">
        {cat && (
          <div className="flex items-center gap-1 text-xs">
            <div style={{ background: cat.color }} className="w-3 h-3 rounded" />
            <span>{cat.name}</span>
          </div>
        )}

        <button
          onClick={() => onEdit(task)}
          className="text-sm px-2 py-1 border rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(task)}
          className="text-sm px-2 py-1 border rounded text-red-600 bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800 transition"
        >
          Del
        </button>
      </div>
    </div>
  );
}
