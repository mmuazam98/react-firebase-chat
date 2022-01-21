import React from "react";
import moment from "moment";
import { useFirebaseAuth } from "../App";

import defaultUser from "../assets/default.jpg";

export default function Message(props) {
  const { auth } = useFirebaseAuth();
  const { text, uid, photoURL, createdAt } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <>
      <div className={`message-container ${messageClass}`}>
        <img src={photoURL || defaultUser} alt="profile" onError={(e) => (e.target.src = defaultUser)} />
        <div className="message">
          {text}
          <div>{createdAt && moment(createdAt.seconds * 1000).format("LT")}</div>
        </div>
      </div>
    </>
  );
}
