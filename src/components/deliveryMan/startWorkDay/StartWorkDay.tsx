"use client";

import React, { useEffect, useState } from "react";
import s from "./startWorkDay.module.scss";
import ButtonDarkBlue from "commons/buttonDarkBlue/ButtonDarkBlue";
import DeliveriesHistory from "commons/deliveriesHistory/DeliveriesHistory";
import PendingDeliveries from "commons/pendingDeliveries/PendingDeliveries";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../../../state/store";
import {
  packageServiceGetPackagesByUserIdAndStatus,
  packageServiceStartTrip,
} from "services/package.service";
import { FullPackage } from "types/types";

const StartWorkDay = () => {
  const [pendingPackages, setPendingPackages] = useState<FullPackage[]>([]);
  const [ongoingPackages, setOngoingPackages] = useState<FullPackage[]>([]);
  const [deliveredPackages, setDeliveredPackages] = useState<FullPackage[]>([]);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchPendingPackages = async () => {
      try {
        if (user.id !== null) {
          const response = await packageServiceGetPackagesByUserIdAndStatus(
            user.id,
            "pending"
          );
          setPendingPackages(response);
        } else {
          return;
        }
      } catch (error) {
        console.error("Error fetching pending packages:", error);
      }
    };

    fetchPendingPackages();
  }, [user]);

  useEffect(() => {
    const fetchDeliveredPackages = async () => {
      try {
        if (user.id !== null) {
          const response = await packageServiceGetPackagesByUserIdAndStatus(
            user.id,
            "delivered"
          );
          setDeliveredPackages(response);
        } else {
          return;
        }
      } catch (error) {
        console.error("Error fetching delivered packages:", error);
      }
    };
    fetchDeliveredPackages();
  }, [user]);

  useEffect(() => {
    const fetchOngoingPackages = async () => {
      try {
        if (user.id !== null) {
          const response = await packageServiceGetPackagesByUserIdAndStatus(
            user.id,
            "ongoing"
          );
          setOngoingPackages(response);
        } else {
          return;
        }
      } catch (error) {
        console.error("Error fetching ongoing packages:", error);
      }
    };

    fetchOngoingPackages();
  }, [user]);

  const combinedPackages = [...pendingPackages, ...ongoingPackages];

  const handleStartPackage = async (packageId: string) => {
    try {
      await packageServiceStartTrip(packageId);
    } catch (error) {
      console.error("Error updating package status:", error);
    }
  };

  return (
    <div className={s.packagesContainer}>
      <div className={s.packagesContentContainer}>
        <PendingDeliveries
          arrayPackages={combinedPackages}
          view="home-repartidor"
          section="repartos-pendientes"
          onStartPackage={handleStartPackage}
        />
        <DeliveriesHistory
          arrayPackages={deliveredPackages}
          view="home-repartidor"
          section="historial-repartos"
          onStartPackage={handleStartPackage}
        />
        {/* Corregir el botón para que siempre esté pegado al final de la página a 10px de separación */}
        <Link href={"/delivery-man/get-packages"}>
          <div className={s.buttonGetPackages}>
            <ButtonDarkBlue text="Obtener Paquetes" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default StartWorkDay;
