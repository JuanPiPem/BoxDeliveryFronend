import React from "react";
import s from "./loading.module.scss";
import { SyncLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className={s.outerLoadingContainer}>
      <SyncLoader color="#24424d" />{" "}
    </div>
  );
}
