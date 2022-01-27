import React, { createContext, useContext, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "@firebase/auth";
import "./App.css";
import ChatRoom from "./components/ChatRoom";
import { ProfileDropdown, SignIn } from "./components/Auth";
import Profile from "./components/Profile";

import { ToastContainer, toast } from "react-toastify";

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
  const copiedSuccessfully = (type, text) => () => {
    navigator.clipboard.writeText(text);
    toast.success("Text copied to clipboard.");
  };

  const unsentSuccessfully = () => {
    toast.success("Message has been unsent.");
  };

  return (
    <FirebaseAuthContext.Provider value={{ auth, user }}>
      <AppContext.Provider value={{ profile, setProfile, copiedSuccessfully, unsentSuccessfully }}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          toastStyle={{ backgroundColor: "#2c5364", color: "white" }}
        />
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
