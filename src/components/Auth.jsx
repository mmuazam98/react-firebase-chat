import { useEffect, useState } from "react";
import { findDOMNode } from "react-dom";
import { GoogleAuthProvider, signInWithPopup, signOut } from "@firebase/auth";
import { useAppContext, useFirebaseAuth } from "../App";

import { VscSignOut } from "react-icons/vsc";
import { BiUserCircle } from "react-icons/bi";

import defaultUser from "../assets/default.jpg";
import googleLogo from "../assets/google.png";

import Profile from "./Profile";

export function SignIn({ loading }) {
  const { auth } = useFirebaseAuth();
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  return (
    <>
      <button onClick={signInWithGoogle} className="signIn" disabled={loading}>
        {loading ? (
          <div className="loading"></div>
        ) : (
          <>
            <img src={googleLogo} alt="google" /> Sign In with Google
          </>
        )}
      </button>
    </>
  );
}

export function ProfileDropdown() {
  const { auth, user } = useFirebaseAuth();
  const { setProfile } = useAppContext();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      const domNode = findDOMNode(this);

      if (!domNode || !domNode.contains(event.target)) {
        setShow(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
  }, []);
  return (
    user && (
      <>
        <div className="dropdown" onBlur={() => setShow(false)}>
          <div className={"profile-image " + (show && "show")} onClick={() => setShow((prev) => !prev)}>
            <img src={user.photoURL || defaultUser} alt="profile" onError={(e) => (e.target.src = defaultUser)} />
          </div>
          <div className={"dropdown-menu " + (show && "show")}>
            <div
              className="dropdown-item"
              onClick={() =>
                setProfile({
                  user: user,
                  show: true,
                })
              }
            >
              <BiUserCircle />
              Profile
            </div>
            <div className="dropdown-item" onClick={() => signOut(auth)}>
              <VscSignOut /> Sign Out
            </div>
          </div>
        </div>
      </>
    )
  );
}
