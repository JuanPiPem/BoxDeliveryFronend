import React from "react";
import s from "./buttonDarkBlue.module.scss";
import { PulseLoader } from "react-spinners";

type Prop = {
  text: string | undefined;
  loading: boolean;
};

const ButtonDarkBlue = (prop: Prop) => {
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
