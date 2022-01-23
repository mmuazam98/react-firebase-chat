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
  const [totalMessages, setTotalMessages] = useState(+localStorage.getItem("totalMessages") || 0);

  useEffect(() => {
    if (!loading) dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [loading]);

  useEffect(() => {
    function sendNotification(msg) {
      if (!("Notification" in window)) {
        return;
      } else if (Notification.permission === "granted" && msg.uid !== auth.currentUser.uid && values.length > totalMessages) {
        new Notification("1 new message", {
          body: msg.text,
          icon: msg.photoURL,
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
          if (permission === "granted" && msg.uid !== auth.currentUser.uid && values.length > totalMessages) {
            new Notification("1 new message", {
              body: msg.text,
              icon: msg.photoURL,
            });
          }
        });
      }
    }
    if (values && values.length) sendNotification(values[values.length - 1]);
    if (values && values.length > totalMessages) {
      localStorage.setItem("totalMessages", values.length);
      setTotalMessages(values.length);
    }
  }, [values]);

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
          <>{values && values.length > 0 && values.map((msg) => msg !== undefined && <Message key={msg?.id} message={msg} />)}</>
        )}

        <span ref={dummy}></span>
      </main>

      <form className="form" onSubmit={sendMessage}>
        <input id="messageInput" value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Message" autoComplete={"off"} />

        <button type="submit" disabled={!formValue}>
          <FiSend />
        </button>
      </form>
    </>
  );
}
