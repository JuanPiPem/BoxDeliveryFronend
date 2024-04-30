"use client";

import React, { useState } from "react";
import s from "./tableListPackages.module.scss";
import Package from "assets/img/Package";
import StatusInProgress from "assets/img/StatusInProgress";
import StatusPending from "assets/img/StatusPending";
import StatusDelivered from "assets/img/StatusDelivered";
import Link from "next/link";
import { shortText } from "../../utils/textTrimmer";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { TablelistPackagesProps } from "types/types";

//The viewType can be: "paquetes-admin", "perfil-repartidor" o "home-repartidor"
//The sections can be: "repartos-pendientes" "historial-repartos"
//The status can be: "pendiente", "en-curso" o "entregado"
//Example: <TableListPackages packageNumber="#0A235" address="Amenabar2356" city="CABA" viewType="paquetes-admin" section="repartos-pendientes" status="en-curso"/>

const TableListPackages = (prop: TablelistPackagesProps) => {
  const user = useSelector((state: RootState) => state.user);
  const [iniciarClicked, setIniciarClicked] = useState({
    [prop.packageNumber]: false,
  });
  const handleIniciarClick = () => {
    prop.onStartPackage(prop.packageNumber);
    setIniciarClicked((prevState) => ({
      ...prevState,
      [prop.packageNumber]: true,
    }));
  };

  return (
    <>
      <div className={`${s.container}`}>
        {!user.is_admin ? (
          <Link
            href={`/delivery-man/delivery-in-progress/${prop.packageNumber}`}
          >
            <div className={s.div1}>
              <Package />
              <div className={s.div2}>
                <p className={`${s.txt} ${s.fontBold}`}>
                  #{prop.packageNumber}
                </p>
                <p className={`${s.txt} ${s.fontNormal}`}>
                  {shortText(prop.address, 3)} <br />
                </p>
              </div>
            </div>
          </Link>
        ) : (
          <div className={s.div1}>
            <Link href={`/admin/singlePackage/${prop.packageNumber}`}>
              <Package />
              <div className={s.div2}>
                <p className={`${s.txt} ${s.fontBold}`}>
                  #{prop.packageNumber}
                </p>
                <p className={`${s.txt} ${s.fontNormal}`}>
                  {shortText(prop.address, 3)} <br />
                </p>
              </div>
            </Link>
          </div>
        )}

        <div className={`${s.div3}`}>
          {prop.viewType === "home-repartidor" ||
          prop.viewType === "perfil-repartidor" ? (
            <div
              className={`${s.statusContainer}`}
              id={
                prop.status === "pending" && !iniciarClicked[prop.packageNumber]
                  ? s.PENDIENTE
                  : prop.status === "ongoing" ||
                    (prop.status === "pending" &&
                      iniciarClicked[prop.packageNumber])
                  ? s.EN_CURSO
                  : s.ENTREGADO
              }
            >
              {prop.status === "pending" &&
              !iniciarClicked[prop.packageNumber] ? (
                <StatusPending />
              ) : prop.status === "ongoing" ||
                (prop.status === "pending" &&
                  iniciarClicked[prop.packageNumber]) ? (
                <StatusInProgress />
              ) : (
                <StatusDelivered />
              )}
              <p className={`${s.statusText}`}>
                {prop.status === "pending" &&
                !iniciarClicked[prop.packageNumber]
                  ? "PENDIENTE"
                  : prop.status === "ongoing" ||
                    (prop.status === "pending" &&
                      iniciarClicked[prop.packageNumber])
                  ? "EN CURSO"
                  : "ENTREGADO"}
              </p>
            </div>
          ) : null}
          {prop.viewType === "home-repartidor" &&
          prop.section === "repartos-pendientes" &&
          prop.status === "pending" &&
          !iniciarClicked[prop.packageNumber] ? (
            <button className={`${s.button}`} onClick={handleIniciarClick}>
              Iniciar
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default TableListPackages;
