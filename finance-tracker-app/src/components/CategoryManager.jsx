// src/components/CategoryManager.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";

export default function CategoryManager({ user }) {
  const [name, setName] = useState("");
  const [cats, setCats] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const q = query(collection(db, "categories"), where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setCats(list);
    });
    return () => unsub();
  }, [user]);

  async function addCategory() {
    if (!name) return setMessage("Enter a name");
    await addDoc(collection(db, "categories"), { uid: user.uid, name });
    setName("");
    setMessage("Added");
  }

  return (
    <div className="card">
      <h3>Manage Categories</h3>
      <div className="row">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category" />
        <button onClick={addCategory}>Add</button>
      </div>
      <ul>{cats.map((c) => <li key={c.id}>{c.name}</li>)}</ul>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
