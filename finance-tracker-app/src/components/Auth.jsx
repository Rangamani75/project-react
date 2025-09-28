// src/components/Auth.jsx
import React, { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

export default function Auth({ onSuccess }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignup(e) {
    e.preventDefault();
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);
      setMessage("Signup successful! Check email for verification.");
      onSuccess(cred.user);
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (!cred.user.emailVerified) {
        setMessage("Please verify your email first.");
      } else {
        onSuccess(cred.user);
      }
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div className="auth-card">
      <h2>{isSignup ? "Sign Up" : "Login"}</h2>
      <form onSubmit={isSignup ? handleSignup : handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary">
          {isSignup ? "Create Account" : "Login"}
        </button>
        <button type="button" className="link" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "Already have an account?" : "Create new account"}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
