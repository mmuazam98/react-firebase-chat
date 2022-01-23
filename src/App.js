import React, { createContext, useContext, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "@firebase/auth";
import "./App.css";
import ChatRoom from "./components/ChatRoom";
import { ProfileDropdown, SignIn } from "./components/Auth";
import Profile from "./components/Profile";
import { useDocument } from "react-firebase-hooks/firestore";

// import poo from "./assets/poo.png";

const auth = getAuth();

export const FirebaseAuthContext = createContext(null);
export const AppContext = createContext(null);

export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext);
  return context;
}
export function useAppContext() {
  const context = useContext(AppContext);
  return context;
}

export default function App() {
  const [user, loading] = useAuthState(auth);
  const [profile, setProfile] = useState({
    show: false,
    user: null,
  });

  return (
    <FirebaseAuthContext.Provider value={{ auth, user }}>
      <AppContext.Provider value={{ profile, setProfile }}>
        <div className="App">
          <header className="App-header">
            <h1>💬</h1>
            <ProfileDropdown />
            <Profile />
          </header>

          <section>{user ? <ChatRoom /> : <SignIn loading={loading} />}</section>
        </div>
      </AppContext.Provider>
    </FirebaseAuthContext.Provider>
  );
}
