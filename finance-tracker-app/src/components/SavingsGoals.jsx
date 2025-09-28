// src/components/SavingsGoals.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";

export default function SavingsGoals({ user }) {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState(0);
  const [due, setDue] = useState("");

  useEffect(() => {
    const q = query(collection(db, "goals"), where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setGoals(list);
    });
    return () => unsub();
  }, [user]);

  async function createGoal() {
    if (!title || !target) return;
    await addDoc(collection(db, "goals"), {
      uid: user.uid,
      title,
      target: parseFloat(target),
      due,
      createdAt: new Date().toISOString(),
    });
    setTitle(""); setTarget(0); setDue("");
  }

  return (
    <div className="card">
      <h3>Savings Goals</h3>
      <div className="row">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Goal title" />
        <input value={target} onChange={(e) => setTarget(e.target.value)} type="number" placeholder="Target amount" />
        <input value={due} onChange={(e) => setDue(e.target.value)} type="date" />
        <button onClick={createGoal}>Create</button>
      </div>
      <ul>
        {goals.map((g) => (
          <li key={g.id}>
            <strong>{g.title}</strong> — target {g.target} due {g.due || 'N/A'}
          </li>
        ))}
      </ul>
    </div>
  );
}
