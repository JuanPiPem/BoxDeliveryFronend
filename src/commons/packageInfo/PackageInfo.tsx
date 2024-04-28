"use client";

import React from "react";
import s from "./packageInfo.module.scss";
// import { FullPackage } from "types/types";
import { shortText } from "utils/textTrimmer";
import { formatDate } from "utils/getFormattDate";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import { statusTranslated } from "utils/translator";

const PackageInfo = () => {
  const currentPackage = useSelector(
    (state: RootState) => state.currentPackage
  );

  return (
    <div>
      <div className={s.statusDeliveryDataContainer}>
        <div className={s.statusDeliveryData}>
          <span className={s.bold}> Número de paquete: </span> #
          {currentPackage.id} <br />
          <span className={s.bold}>Estado: </span>
          {shortText(statusTranslated(currentPackage.status))} <br />
          <span className={s.bold}> Recibe: </span>
          {currentPackage.receiver_name} <br />
          <span className={s.bold}>Destino: </span>
          {shortText(currentPackage.address)} <br />
          <span className={s.bold}> Fecha de entrega: </span>
          {formatDate(currentPackage.date)} <br />
        </div>
      </div>
    </div>
  );
};

export default PackageInfo;
