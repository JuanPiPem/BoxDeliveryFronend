"use client";

import React from "react";
import s from "./startWorkDay.module.scss";
import ButtonDarkBlue from "commons/buttonDarkBlue/ButtonDarkBlue";
import DeliveriesHistory from "commons/deliveriesHistory/DeliveriesHistory";
import PendingDeliveries from "commons/pendingDeliveries/PendingDeliveries";
import Link from "next/link";
import { fakeData } from "utils/fakeData";

const StartWorkDay = () => {
  interface FakeData {
    packageNumber: string;
    address: string;
    city: string;
    status: string;
  }

  const arrayFakeDataPendingPackages: FakeData[] = fakeData;
  const arrayFakeData: FakeData[] = fakeData;

  return (
    <>
      <div className={s.packagesContainer}>
        <div className={s.packagesContentContainer}>
          <PendingDeliveries
            arrayPackages={arrayFakeDataPendingPackages}
            view="home-repartidor"
            section="repartos-pendientes"
          />
          <DeliveriesHistory
            arrayPackages={arrayFakeData}
            view="home-repartidor"
            section="historial-repartos"
          />
          {/*           Corregir el botón para que siempre que pegado al final de la 
          página a 10px de separación */}
          <Link href={"/delivery-man/get-packages"}>
            <div className={s.buttonGetPackages}>
              <ButtonDarkBlue text="Obtener Paquetes" />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default StartWorkDay;
