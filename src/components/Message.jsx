import React from "react";
import moment from "moment";
import { useAppContext, useFirebaseAuth } from "../App";

import defaultUser from "../assets/default.jpg";

import { MdContentCopy } from "react-icons/md";
import { BiUndo } from "react-icons/bi";

export default function Message(props) {
  const { user } = useFirebaseAuth();
  const { copiedSuccessfully } = useAppContext();
  const { text, uid, photoURL, createdAt, id } = props.message;

  const messageClass = uid === user.uid ? "sent" : "received";

  return (
    <>
      <div className={`message-container ${messageClass}`}>
        {uid !== user.uid && <img src={photoURL || defaultUser} alt="profile" onError={(e) => (e.target.src = defaultUser)} />}
        <div className="message">
          {text}
          <div>{createdAt && moment(createdAt.seconds * 1000).format("LT")}</div>
        </div>
        <MdContentCopy data-tip="Copy" onClick={copiedSuccessfully("copy", text)} />
        {uid === user.uid && (
          <>
            <BiUndo
              data-tip="Unsend"
              onClick={() => {
                props.unsendMessage(id);
              }}
            />
          </>
        )}
      </div>
    </>
  );
}
