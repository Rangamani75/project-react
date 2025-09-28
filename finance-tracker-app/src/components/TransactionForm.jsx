// src/components/TransactionForm.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";

export default function TransactionForm({ user }) {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("General");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [categories, setCategories] = useState(["General"]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const q = query(collection(db, "categories"), where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const list = [];
      snap.forEach((d) => list.push(d.data().name));
      if (list.length) setCategories(list);
    });
    return () => unsub();
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!amount || amount <= 0) return setMessage("Enter a positive amount");
    try {
      await addDoc(collection(db, "transactions"), {
        uid: user.uid,
        type,
        amount: parseFloat(amount),
        category,
        date,
        note,
        createdAt: new Date().toISOString(),
      });
      setMessage("Transaction saved.");
      setAmount(0);
      setNote("");
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div className="card form-card">
      <h3>Add Transaction</h3>
      <form onSubmit={handleSubmit}>
        <label>Type
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>
        <label>Amount
          <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <label>Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label>Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label>Note
          <input type="text" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
        <button className="btn-primary" type="submit">Save</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
