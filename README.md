# Personal Task Manager

A modern, responsive task management app built with **React + Vite + TailwindCSS**.  
Supports task CRUD, categories, drag & drop, dark mode, and works offline.

**Live Demo:** [Personal Task Manager](https://task-manager-etew6zolk-marianatefs-projects.vercel.app/)

---

## Features

- Fetch tasks from API (`https://dummyjson.com`)  
- Create, edit, delete tasks  
- Toggle completion (with optimistic UI updates)  
- Local fallback when API is down  
- Categorization with color tagging  
- Search, filter, and sorting  
- Drag & Drop using `react-beautiful-dnd`  
- Light/Dark theme using `localStorage`  
- Fully responsive design (mobile-first)  
- Local category persistence  

---

## Installation

```bash
git clone https://github.com/Marianatef/task-manager.git
cd task-manager
npm install
npm run dev
