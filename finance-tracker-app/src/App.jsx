// src/App.jsx
import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

import Dashboard from "./components/Dashboard";
import TransactionForm from "./components/TransactionForm";
import CategoryManager from "./components/CategoryManager";
import SavingsGoals from "./components/SavingsGoals";
import BudgetManager from "./components/BudgetManager";
import Auth from "./components/Auth";

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("dashboard");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  if (!user) return <Auth onSuccess={setUser} />;

  return (
    <div className="app-root">
      <header>
        <h1>Personal Finance Tracker</h1>
        <nav>
          <button onClick={() => setView("dashboard")}>Dashboard</button>
          <button onClick={() => setView("add")}>Add</button>
          <button onClick={() => setView("categories")}>Categories</button>
          <button onClick={() => setView("goals")}>Goals</button>
          <button onClick={() => setView("budget")}>Budget</button>
          <button onClick={() => signOut(auth)}>Logout</button>
        </nav>
      </header>

      <main>
        {view === "dashboard" && <Dashboard user={user} />}
        {view === "add" && <TransactionForm user={user} />}
        {view === "categories" && <CategoryManager user={user} />}
        {view === "goals" && <SavingsGoals user={user} />}
        {view === "budget" && <BudgetManager user={user} />}
      </main>

      <footer>Made with ❤️ — Ranga and Praveen</footer>
    </div>
  );
}
