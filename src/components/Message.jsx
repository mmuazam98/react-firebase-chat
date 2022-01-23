import React from "react";
import moment from "moment";
import { useAppContext, useFirebaseAuth } from "../App";

import defaultUser from "../assets/default.jpg";
import { getAdditionalUserInfo } from "firebase/auth";

export default function Message(props) {
  const { auth, user } = useFirebaseAuth();
  const { setProfile } = useAppContext();
  const { text, uid, photoURL, createdAt } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <>
      <div className={`message-container ${messageClass}`}>
        <img
          src={photoURL || defaultUser}
          alt="profile"
          onError={(e) => (e.target.src = defaultUser)}
          onClick={() => {
            if (uid !== user.uid) {
              setProfile({
                user: user,
                show: true,
              });
            }
          }}
        />
        <div className="message">
          {text}
          <div>{createdAt && moment(createdAt.seconds * 1000).format("LT")}</div>
        </div>
      </div>
    </>
  );
}
