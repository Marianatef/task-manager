import React, { useMemo } from "react";
import TaskItem from "./TaskItem";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function TaskList({ tasks, setTasks, onToggle, onEdit, onDelete, categories }) {
  const categoriesMap = useMemo(() => {
    const m = {};
    (categories || []).forEach((c) => (m[c.id] = c));
    return m;
  }, [categories]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(tasks);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setTasks(reordered);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="task-list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
            {tasks.length === 0 && <div className="p-4 text-center text-slate-500">No tasks to show</div>}
            {tasks.map((t, idx) => (
              <Draggable key={t.id} draggableId={String(t.id)} index={idx}>
                {(prov, snapshot) => (
                  <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className={snapshot.isDragging ? "scale-105" : ""}>
                    <TaskItem task={t} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} categoriesMap={categoriesMap} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
