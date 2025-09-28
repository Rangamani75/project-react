// src/components/BudgetManager.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";

export default function BudgetManager({ user }) {
  const [budgets, setBudgets] = useState([]);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "budgets"), where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setBudgets(list);
    });
    return () => unsub();
  }, [user]);

  async function addBudget() {
    if (!category || !amount) return;
    await addDoc(collection(db, "budgets"), { uid: user.uid, category, amount: parseFloat(amount) });
    setCategory(""); setAmount(0);
  }

  return (
    <div className="card">
      <h3>Budgets</h3>
      <div className="row">
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="Monthly amount" />
        <button onClick={addBudget}>Save</button>
      </div>
      <ul>
        {budgets.map((b) => (
          <li key={b.id}>{b.category} — {b.amount}</li>
        ))}
      </ul>
    </div>
  );
}
