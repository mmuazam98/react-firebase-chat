import React, { useEffect, useRef, useState } from "react";
import { useFirebaseAuth, useAppContext } from "../App";

import { db } from "../firebaseConfig";
import { addDoc, collection, orderBy, query, serverTimestamp, deleteDoc, doc } from "@firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import Filter from "bad-words";
import ReactTooltip from "react-tooltip";
import { toast } from "react-toastify";

import { FiSend } from "react-icons/fi";

import Message from "./Message";

export default function ChatRoom() {
  const { auth } = useFirebaseAuth();
  const { unsentSuccessfully } = useAppContext();
  const dummy = useRef();
  const filter = new Filter();

  const messagesRef = collection(db, "messages");
  const orderedMessages = query(messagesRef, orderBy("createdAt"));

  const messageList = [];
  const [messages, loading] = useCollection(orderedMessages);
  messages?.forEach((msg) => {
    messageList.push({
      id: msg.id,
      ...msg.data(),
    });
  });

  const [totalMessages, setTotalMessages] = useState(+localStorage.getItem("totalMessages") || 0);

  useEffect(() => {
    if (!loading) dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [loading]);

  useEffect(() => {
    function sendNotification(msg) {
      try {
        if (!("Notification" in window)) {
          return;
        } else if (Notification.permission === "granted" && msg.uid !== auth.currentUser.uid && messageList.length > totalMessages) {
          new Notification("1 new message", {
            body: msg.text,
            icon: msg.photoURL,
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(function (permission) {
            if (permission === "granted" && msg.uid !== auth.currentUser.uid && messageList.length > totalMessages) {
              new Notification("1 new message", {
                body: msg.text,
                icon: msg.photoURL,
              });
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
    if (messageList && messageList.length) {
      dummy.current.scrollIntoView({ behavior: "smooth" });
      sendNotification(messageList[messageList.length - 1]);
    }
    if (messageList && messageList.length > totalMessages) {
      localStorage.setItem("totalMessages", messageList.length);
      setTotalMessages(messageList.length);
    }
  }, [messageList]);

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await addDoc(messagesRef, {
      text: filter.clean(formValue.trim()),
      createdAt: serverTimestamp(),
      uid,
      photoURL,
    });
    if (filter.clean(formValue.trim()) !== formValue.trim()) {
      toast.warning("Hey! Please don't use such words 😒");
    }
    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  const unsendMessage = async (id) => {
    const message = doc(db, "messages", id);
    await deleteDoc(message);
    unsentSuccessfully();
    localStorage.setItem("totalMessages", messageList.length);
  };

  return (
    <>
      <main>
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            <ReactTooltip />
            {messageList?.map((msg) => {
              return msg !== undefined && <Message key={msg?.id} message={msg} unsendMessage={unsendMessage} />;
            })}
          </>
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
