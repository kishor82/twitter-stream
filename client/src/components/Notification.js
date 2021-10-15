import React from "react";
import "./Notification.css";
import { useSelector } from "react-redux";
const Notification = () => {
  const { unreadCount } = useSelector((state) => state.TweetData);

  return (
    <div>
      <button type="button" className="icon-button">
        <i className="fas fa-bell"></i>
        {!!unreadCount && (
          <span className="icon-button__badge">{unreadCount}</span>
        )}
      </button>
    </div>
  );
};

export default Notification;
