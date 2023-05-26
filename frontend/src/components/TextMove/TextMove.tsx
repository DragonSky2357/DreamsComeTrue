import "./style.css";
import React from "react";

const TextMove = (props: any) => {
  return (
    <div className="animated-title">
      <div className={"track" + `${props.direction}`}>
        <div className="content">
          &nbsp;Happy&nbsp;Sweet&nbsp;Funny&nbsp;Sad
          &nbsp;Unbelievable&nbsp;enraged&nbsp;peaceful
          &nbsp;nervous&nbsp;jealous&nbsp;Suspicious
          &nbsp;Confused&nbsp;Loved&nbsp;hopeful
          &nbsp;bored&nbsp;sorry&nbsp;excited&nbsp;shy &nbsp;guilty&nbsp;scarry
        </div>
      </div>
    </div>
  );
};

export default TextMove;
