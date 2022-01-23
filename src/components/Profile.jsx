import React, { useEffect, useRef } from "react";
import moment from "moment";
import defaultUser from "../assets/default.jpg";
import { FaRegTimesCircle } from "react-icons/fa";
import { useAppContext } from "../App";

export default function Profile() {
  const { profile, setProfile } = useAppContext();
  const containerRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target === containerRef.current) {
        setProfile({
          show: false,
          user: null,
        });
      }
    };
    if (profile.show) document.addEventListener("click", handleClickOutside, true);
    else document.removeEventListener("click", handleClickOutside, true);
  }, [profile.show]);
  return (
    <div className={"profile-container " + (profile.show && "visible")} ref={containerRef}>
      <div className="profile">
        <FaRegTimesCircle onClick={() => setProfile(false)} />
        <img src={profile?.user?.photoURL} alt="" onError={(e) => (e.target.src = defaultUser)} />
        <div className="name">{profile?.user?.displayName}</div>
        <div className="email">{profile?.user?.email}</div>
        <div className="lastSeen">
          Last signed in <span className="lowercase">{moment(profile?.user?.metadata.lastSignInTime).calendar()}</span>
        </div>
      </div>
    </div>
  );
}
