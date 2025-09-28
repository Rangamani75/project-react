// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function Dashboard({ user }) {
  const [totals, setTotals] = useState({ income: 0, expense: 0, savings: 0 });

  useEffect(() => {
    const q = query(collection(db, "transactions"), where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      let income = 0, expense = 0;
      snap.forEach(doc => {
        const data = doc.data();
        if (data.type === "income") income += data.amount;
        else if (data.type === "expense") expense += data.amount;
      });
      setTotals({ income, expense, savings: income - expense });
    });
    return () => unsub();
  }, [user]);

  return (
    <div className="dashboard-cards">
      <div className="card card-income">
        <h4>Total Income</h4>
        <p className="big">${totals.income.toFixed(2)}</p>
      </div>
      <div className="card card-expense">
        <h4>Total Expenses</h4>
        <p className="big">${totals.expense.toFixed(2)}</p>
      </div>
      <div className="card card-savings">
        <h4>Savings</h4>
        <p className="big">${totals.savings.toFixed(2)}</p>
      </div>
    </div>
  );
}
