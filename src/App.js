import React, { createContext, useContext } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "@firebase/auth";
import "./App.css";
import ChatRoom from "./components/ChatRoom";
import { ProfileDropdown, SignIn } from "./components/Auth";

// import poo from "./assets/poo.png";

const auth = getAuth();

export const FirebaseAuthContext = createContext(null);

export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext);
  return context;
}

export default function App() {
  const [user, loading] = useAuthState(auth);
  console.log(loading);
  return (
    <FirebaseAuthContext.Provider value={{ auth, user }}>
      <div className="App">
        <header className="App-header">
          <h1>💬</h1>
          <ProfileDropdown />
        </header>

        <section>{user ? <ChatRoom /> : <SignIn loading={loading} />}</section>
      </div>
    </FirebaseAuthContext.Provider>
  );
}
