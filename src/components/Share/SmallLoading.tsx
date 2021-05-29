import React from "react";

export default class SmallLoading extends React.PureComponent {
  render() {
    return (
      <svg
        width="50"
        height="7"
        viewBox="0 0 207 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="loading">
          <rect id="Rectangle 1" width="150" height="44" fill="transparent" />
          <circle id="dot1" cx="55" cy="22" r="13" fill="springgreen" />
          <circle id="dot2" cx="104" cy="22" r="13" fill="springgreen" />
          <circle id="dot3" cx="152" cy="22" r="13" fill="springgreen" />
        </g>
      </svg>
    );
  }
}
