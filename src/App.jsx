import React from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import "./App.css";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div className="max-w-3xl mx-auto p-4">
        <Header title="Personal Task Manager" />
        <main className="mt-4">
          <Home />
        </main>

        <footer className="mt-8 text-sm text-slate-500">
          Built for assessment — uses DummyJSON mock API. <br />
          Add tests, types, and server ordering for production.
        </footer>
      </div>
    </div>
  );
}
