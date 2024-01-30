import React from "react";
import s from "./deliveryMen.module.scss";
import Header from "commons/header/Header";
import ColorPoint from "assets/img/ColorPoint";
import PercentageGraph from "assets/img/PercentageGraph";
import VectorDown from "assets/img/VectorDown";
import Link from "next/link";

const DeliveryMen = () => {
  interface FakeData {
    name: string;
    state: string;
    level: number;
  }

  const arrayFakeData: FakeData[] = [
    { name: "Farid", state: "en curso", level: 52 },
    { name: "Luciana", state: "entregado", level: 100 },
    { name: "Dario", state: "en curso", level: 80 },
    { name: "Santiago", state: "deshabilitado", level: 0 },
  ];
  return (
    <>
      <div className={s.addPackagesContainer}>
        <div className={s.header}>
          <Header text="Repartidores" />
        </div>
        <div className={s.repartidores}>
          <div className={s.headList}>
            <div>
              <h1 className={s.month}>Enero </h1>
              <h1 className={s.day}> mie / 03</h1>
            </div>
          </div>
          {arrayFakeData.map((objeto) => (
            <>
              <Link href={"/admin/delivery-man-profile"}>
                <div className={s.contentUser} key={objeto.level + 1}>
                  <div className={s.percentage}>
                    <PercentageGraph level={objeto.level} />
                  </div>

                  <div className={s.nameAndState}>
                    <div id={s.objetoName}>{objeto.name}</div>
                    <div className={s.ProfileState}>
                      {" "}
                      <ColorPoint state={objeto.state} /> {objeto.state}
                    </div>
                  </div>
                  <div className={s.profilePicture}></div>
                </div>
              </Link>
            </>
          ))}
          <div className={s.vector}>
            <VectorDown />
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveryMen;
