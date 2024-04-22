import React from "react";
import s from "./buttonDarkBlue.module.scss";
import { PulseLoader } from "react-spinners";
import { ButtonDarkBlueProps } from "types/types";

const ButtonDarkBlue = (prop: ButtonDarkBlueProps) => {
  return (
    <button className={`${s.buttonStyle}`}>
      {prop.loading ? (
        <PulseLoader color="#80cf8b" size={10} margin={5} />
      ) : (
        prop.text
      )}
    </button>
  );
};

export default ButtonDarkBlue;
