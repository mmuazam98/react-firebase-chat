import React, { useEffect, useRef, useState } from "react";
import { useFirebaseAuth } from "../App";

import { db } from "../firebaseConfig";
import { addDoc, collection, orderBy, query, serverTimestamp } from "@firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { FiSend } from "react-icons/fi";

import Message from "./Message";

export default function ChatRoom() {
  const { auth } = useFirebaseAuth();
  const dummy = useRef();

  const messagesRef = collection(db, "messages");
  const orderedMessages = query(messagesRef, orderBy("createdAt"));

  const [values, loading] = useCollectionData(orderedMessages);

  useEffect(() => {
    if (!loading) dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [loading]);

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await addDoc(messagesRef, {
      text: formValue.trim(),
      createdAt: serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <>{values && values.map((msg) => <Message key={msg.id} message={msg} />)}</>
        )}

        <span ref={dummy}></span>
      </main>

      <form className="form" onSubmit={sendMessage}>
        <input id="messageInput" value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Message" autoComplete={false} />

        <button type="submit" disabled={!formValue}>
          <FiSend />
        </button>
      </form>
    </>
  );
}
