import React from "react";

export default function DeployArrowDown(props: {
  width?: number;
  height?: number;
}) {
  const { width, height } = props;
  return (
    <svg
      width={width || "14"}
      height={height || "8"}
      viewBox="0 0 14 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        id="Stroke 6"
        d="M0.34362 0.33213C0.758879 -0.0716676 1.40739 -0.107106 1.8636 0.224929L1.99427 0.335563L6.9986 5.24423L12.0057 0.335563C12.4192 -0.069958 13.0676 -0.108094 13.5252 0.222041L13.6564 0.33213C14.0716 0.735928 14.1107 1.36908 13.7726 1.816L13.6599 1.94407L7.82708 7.66444C7.41234 8.07118 6.76163 8.10816 6.30399 7.77537L6.17292 7.66444L0.340105 1.94407C-0.114738 1.498 -0.113164 0.776307 0.34362 0.33213Z"
        fill="#24424D"
      />
    </svg>
  );
}
